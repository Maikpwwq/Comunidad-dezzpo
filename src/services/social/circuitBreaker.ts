/**
 * Circuit Breaker Engine for Meta Graph API Rate Limit & Anti-Ban Protection
 * 
 * Monitored Headers:
 * - X-App-Usage: {"call_count": X, "total_cputime": Y, "total_time": Z}
 * - X-Business-Usecase-Usage: {"{acc_id}": [{"type": "...", "call_count": X, ...}]}
 * 
 * Strict Protection Law:
 * Any usage metric >= 80% immediately trips the circuit to OPEN.
 * Error 368 (Spam/Account block) permanently trips the circuit to HALTED (Kill Switch).
 */

import type {
  AppUsageMetrics,
  CircuitBreakerConfig,
  CircuitBreakerSnapshot,
  CircuitBreakerState,
} from './types'

export class CircuitBreaker {
  private state: CircuitBreakerState = 'CLOSED'
  private lastUsage: AppUsageMetrics | null = null
  private maxUsageRecorded = 0
  private consecutiveFailures = 0
  private cooldownUntil: number | null = null
  private backoffMultiplier = 1
  private haltReason: string | undefined = undefined

  private readonly thresholdPercent: number
  private readonly baseCooldownMs: number
  private readonly maxCooldownMs: number

  constructor(config?: CircuitBreakerConfig) {
    this.thresholdPercent = config?.usageThresholdPercent ?? 80
    this.baseCooldownMs = config?.baseCooldownMs ?? 300_000 // 5 minutes
    this.maxCooldownMs = config?.maxCooldownMs ?? 3_600_000 // 60 minutes
  }

  /**
   * Reports live usage metrics from X-App-Usage header.
   */
  public reportUsage(metrics: AppUsageMetrics): void {
    this.lastUsage = metrics
    const currentMax = Math.max(metrics.call_count, metrics.total_cputime, metrics.total_time)
    if (currentMax > this.maxUsageRecorded) {
      this.maxUsageRecorded = currentMax
    }

    if (this.state === 'HALTED') return

    if (currentMax >= this.thresholdPercent) {
      this.trip(
        `Critical usage threshold reached: ${currentMax}% (Threshold: ${this.thresholdPercent}%) [call_count: ${metrics.call_count}%, cpu: ${metrics.total_cputime}%, time: ${metrics.total_time}%]`
      )
    } else if (this.state === 'HALF_OPEN') {
      // Probe succeeded and usage is healthy
      this.state = 'CLOSED'
      this.consecutiveFailures = 0
      this.backoffMultiplier = 1
      this.cooldownUntil = null
    }
  }

  /**
   * Reports Meta Graph API native error codes to trigger safety measures.
   * - Error 368: Spam / Policy Block -> Permanent HALT
   * - Error 4: App Rate Limit -> Trip to OPEN
   * - Error 17: User/Page Rate Limit -> Trip to OPEN
   */
  public reportError(errorCode: number, message?: string): void {
    if (errorCode === 368) {
      this.state = 'HALTED'
      this.haltReason = `KILL SWITCH ACTIVATED: Meta Error 368 (Temporarily blocked for spam/suspicious behavior). Halting all operations. Details: ${message ?? 'No details'}`
      this.cooldownUntil = null
      return
    }

    if (errorCode === 4 || errorCode === 17) {
      this.trip(`Meta Rate Limit Exceeded (Error ${errorCode}): ${message ?? 'Rate limit reached'}`)
      return
    }

    // Generic failures (5xx, timeouts, network issues)
    this.consecutiveFailures += 1
    if (this.consecutiveFailures >= 3 && this.state === 'CLOSED') {
      this.trip(`Consecutive request failures (${this.consecutiveFailures}) reached limit.`)
    }
  }

  /**
   * Reports a successful request execution without rate limit warnings.
   */
  public reportSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED'
      this.consecutiveFailures = 0
      this.backoffMultiplier = 1
      this.cooldownUntil = null
    }
  }

  /**
   * Evaluates if execution is safe to proceed.
   */
  public canProceed(): boolean {
    if (this.state === 'HALTED') {
      return false
    }

    if (this.state === 'CLOSED') {
      return true
    }

    if (this.state === 'OPEN') {
      const now = Date.now()
      if (this.cooldownUntil !== null && now >= this.cooldownUntil) {
        // Transition to HALF_OPEN to allow a single probe request
        this.state = 'HALF_OPEN'
        return true
      }
      return false
    }

    if (this.state === 'HALF_OPEN') {
      // In HALF_OPEN, only allow one probe at a time
      return true
    }

    return false
  }

  /**
   * Manually trips the circuit breaker with exponential backoff calculation.
   */
  public trip(reason?: string): void {
    if (this.state === 'HALTED') return

    this.state = 'OPEN'
    this.consecutiveFailures += 1

    // Calculate exponential backoff: base * 2^(failures - 1)
    const rawCooldown = this.baseCooldownMs * Math.pow(2, Math.max(0, this.consecutiveFailures - 1))
    const cappedCooldown = Math.min(this.maxCooldownMs, rawCooldown)
    // Add ±10% jitter to prevent synchronized retry spikes
    const jitter = cappedCooldown * (0.9 + Math.random() * 0.2)

    this.cooldownUntil = Date.now() + Math.round(jitter)
    this.backoffMultiplier = Math.pow(2, Math.max(0, this.consecutiveFailures - 1))

    if (reason) {
      this.haltReason = reason
    }
  }

  /**
   * Resets the circuit breaker state to CLOSED (used for tests and admin overrides).
   */
  public reset(): void {
    this.state = 'CLOSED'
    this.lastUsage = null
    this.consecutiveFailures = 0
    this.cooldownUntil = null
    this.backoffMultiplier = 1
    this.haltReason = undefined
  }

  /**
   * Returns an immutable snapshot of current circuit breaker metrics.
   */
  public getSnapshot(): CircuitBreakerSnapshot {
    const now = Date.now()
    const secondsRemaining =
      this.cooldownUntil !== null && this.cooldownUntil > now
        ? Math.ceil((this.cooldownUntil - now) / 1000)
        : 0

    return {
      state: this.state,
      lastUsage: this.lastUsage ? { ...this.lastUsage } : null,
      maxUsageRecorded: this.maxUsageRecorded,
      consecutiveFailures: this.consecutiveFailures,
      cooldownUntil: this.cooldownUntil,
      cooldownSecondsRemaining: secondsRemaining,
      backoffMultiplier: this.backoffMultiplier,
      ...(this.haltReason ? { haltReason: this.haltReason } : {}),
    }
  }

  // ─── Simulation & Dev Methods (For MCP & Local Testing) ─────────────────────

  public forceState(state: CircuitBreakerState, reason?: string): void {
    this.state = state
    if (reason) this.haltReason = reason
    if (state === 'CLOSED') {
      this.cooldownUntil = null
    } else if (state === 'OPEN') {
      this.cooldownUntil = Date.now() + this.baseCooldownMs
    }
  }
}

export function createCircuitBreaker(config?: CircuitBreakerConfig): CircuitBreaker {
  return new CircuitBreaker(config)
}
