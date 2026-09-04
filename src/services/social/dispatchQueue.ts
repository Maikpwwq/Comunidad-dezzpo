/**
 * Humanized Asynchronous Dispatch Queue with Jitter, Hourly Rate Limiting,
 * and 6:4 (60% Supply / 40% Demand) Quota Ratio Balancing.
 * 
 * Strict Anti-Ban Enforcement:
 * - NO Promise.all or concurrent bursts.
 * - Random delays (Jitter) between 45s and 120s.
 * - Max 10-15 comments per hour rolling window.
 * - Automated pause during quiet/night hours (11:00 PM - 06:00 AM).
 * - Weighted 6:4 Dispatch Scheduling (60% Supply / 40% Demand).
 */

import type {
  DispatchTask,
  QueueConfig,
  QueueStats,
} from './types'
import { CircuitBreaker } from './circuitBreaker'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRandomJitter(minMs: number, maxMs: number): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

export class DispatchQueue {
  private queue: DispatchTask[] = []
  private dispatchedTimestamps: number[] = []
  private dispatchedSupplyCount = 0
  private dispatchedDemandCount = 0

  private readonly jitterMinMs: number
  private readonly jitterMaxMs: number
  private readonly maxCommentsPerHour: number
  private readonly quietHoursStart: number
  private readonly quietHoursEnd: number
  private readonly targetSupplyRatio: number
  private readonly targetDemandRatio: number
  private readonly enableRatioBalancing: boolean
  private isProcessing = false

  constructor(config?: QueueConfig) {
    this.jitterMinMs = config?.jitterMinMs ?? 45_000
    this.jitterMaxMs = config?.jitterMaxMs ?? 120_000
    this.maxCommentsPerHour = config?.maxCommentsPerHour ?? 12
    this.quietHoursStart = config?.quietHoursStart ?? 23
    this.quietHoursEnd = config?.quietHoursEnd ?? 6
    this.targetSupplyRatio = config?.targetRatio?.supply ?? 0.60
    this.targetDemandRatio = config?.targetRatio?.demand ?? 0.40
    this.enableRatioBalancing = config?.enableRatioBalancing ?? true
  }

  /**
   * Adds a prepared task to the queue.
   */
  public enqueue(task: DispatchTask): void {
    // Avoid duplicate enqueues for the same post ID
    const exists = this.queue.some((t) => t.postId === task.postId && t.status === 'PENDING')
    if (!exists) {
      this.queue.push(task)
    }
  }

  /**
   * Checks if current time falls within configured quiet hours.
   */
  public isQuietHour(now: Date = new Date()): boolean {
    if (this.quietHoursStart === -1 || this.quietHoursStart === this.quietHoursEnd) {
      return false
    }
    const hour = now.getHours()
    if (this.quietHoursStart > this.quietHoursEnd) {
      // Overnight (e.g. 23:00 to 06:00)
      return hour >= this.quietHoursStart || hour < this.quietHoursEnd
    }
    return hour >= this.quietHoursStart && hour < this.quietHoursEnd
  }

  /**
   * Cleans up dispatched timestamps older than 60 minutes.
   */
  private pruneHourlyWindow(): void {
    const oneHourAgo = Date.now() - 3_600_000
    this.dispatchedTimestamps = this.dispatchedTimestamps.filter((ts) => ts > oneHourAgo)
  }

  /**
   * Selects the next pending task according to the target 6:4 (Supply:Demand) ratio policy.
   */
  public getNextPendingTask(): DispatchTask | undefined {
    const pending = this.queue.filter((t) => t.status === 'PENDING')
    if (pending.length === 0) return undefined

    if (!this.enableRatioBalancing) {
      return pending[0]
    }

    const pendingSupply = pending.filter((t) => t.intent === 'SUPPLY')
    const pendingDemand = pending.filter((t) => t.intent === 'DEMAND')

    // If both Supply and Demand tasks are pending, balance toward the 60/40 ratio
    if (pendingSupply.length > 0 && pendingDemand.length > 0) {
      const totalDispatched = this.dispatchedSupplyCount + this.dispatchedDemandCount
      if (totalDispatched === 0) {
        // Start cycle by prioritizing Supply (60% target)
        return pendingSupply[0]
      }

      const currentSupplyRatio = this.dispatchedSupplyCount / totalDispatched
      // If supply is below target (60%), dispatch Supply first
      if (currentSupplyRatio < this.targetSupplyRatio) {
        return pendingSupply[0]
      }
      // Otherwise, dispatch Demand
      return pendingDemand[0]
    }

    // Only supply available
    if (pendingSupply.length > 0) {
      return pendingSupply[0]
    }

    // Only demand available
    return pendingDemand[0]
  }

  /**
   * Returns current queue statistics and limits.
   */
  public getStats(): QueueStats {
    this.pruneHourlyWindow()
    const pendingSupply = this.queue.filter((t) => t.status === 'PENDING' && t.intent === 'SUPPLY').length
    const pendingDemand = this.queue.filter((t) => t.status === 'PENDING' && t.intent === 'DEMAND').length
    const totalDispatched = this.dispatchedSupplyCount + this.dispatchedDemandCount

    const supplyPercent = totalDispatched > 0
      ? Math.round((this.dispatchedSupplyCount / totalDispatched) * 100)
      : Math.round(this.targetSupplyRatio * 100)

    const demandPercent = totalDispatched > 0
      ? Math.round((this.dispatchedDemandCount / totalDispatched) * 100)
      : Math.round(this.targetDemandRatio * 100)

    return {
      pending: this.queue.filter((t) => t.status === 'PENDING').length,
      pendingSupply,
      pendingDemand,
      dispatchedInCurrentHour: this.dispatchedTimestamps.length,
      dispatchedSupplyTotal: this.dispatchedSupplyCount,
      dispatchedDemandTotal: this.dispatchedDemandCount,
      currentRatio: {
        supplyPercent,
        demandPercent,
      },
      maxPerHour: this.maxCommentsPerHour,
      isQuietHour: this.isQuietHour(),
    }
  }

  /**
   * Processes enqueued tasks one-by-one with humanized delays and rate checks.
   */
  public async processQueue(
    posterFn: (
      postId: string,
      message: string
    ) => Promise<{ success: boolean; commentId?: string | undefined; errorCode?: number | undefined; errorMessage?: string | undefined }>,
    circuitBreaker?: CircuitBreaker
  ): Promise<readonly DispatchTask[]> {
    if (this.isProcessing) {
      return this.queue
    }

    this.isProcessing = true
    const processedTasks: DispatchTask[] = []

    try {
      while (this.queue.some((t) => t.status === 'PENDING')) {
        const task = this.getNextPendingTask()
        if (!task) break

        // 1. Check Quiet Hours
        if (this.isQuietHour()) {
          task.status = 'SKIPPED'
          task.errorDetails = 'Skipped: Currently in configured quiet hours (Night time mode)'
          processedTasks.push(task)
          continue
        }

        // 2. Check Hourly Limit
        this.pruneHourlyWindow()
        if (this.dispatchedTimestamps.length >= this.maxCommentsPerHour) {
          task.status = 'SKIPPED'
          task.errorDetails = `Skipped: Hourly comment limit reached (${this.dispatchedTimestamps.length}/${this.maxCommentsPerHour})`
          processedTasks.push(task)
          continue
        }

        // 3. Check Circuit Breaker
        if (circuitBreaker && !circuitBreaker.canProceed()) {
          task.status = 'SKIPPED'
          task.errorCode = 429
          task.errorDetails = 'Skipped: Circuit breaker is OPEN/HALTED'
          processedTasks.push(task)
          break // Stop processing remaining queue until breaker recovers
        }

        // 4. Humanized Jitter Delay Before Posting
        const jitter = getRandomJitter(this.jitterMinMs, this.jitterMaxMs)
        await sleep(jitter)

        // 5. Execute Post
        const result = await posterFn(task.postId, task.commentBody)
        task.dispatchedAt = Date.now()

        const hasValidCommentId = typeof result.commentId === 'string' && result.commentId.trim().length > 0

        if (result.success && hasValidCommentId) {
          task.status = 'DISPATCHED'
          task.commentId = result.commentId
          task.errorCode = null
          this.dispatchedTimestamps.push(task.dispatchedAt)
          if (task.intent === 'SUPPLY') {
            this.dispatchedSupplyCount += 1
          } else if (task.intent === 'DEMAND') {
            this.dispatchedDemandCount += 1
          }
        } else {
          task.status = 'FAILED'
          task.commentId = null
          task.errorCode = result.errorCode ?? (result.success ? 422 : 500)
          task.errorDetails = result.errorMessage || (result.success && !hasValidCommentId ? 'Meta Graph API response missing valid comment_id' : 'Dispatch failed')
        }

        processedTasks.push(task)
      }
    } finally {
      this.isProcessing = false
    }

    return processedTasks
  }

  /**
   * Empties the queue and resets dispatch counts if requested.
   */
  public clearQueue(resetCounts = false): void {
    this.queue = []
    if (resetCounts) {
      this.dispatchedTimestamps = []
      this.dispatchedSupplyCount = 0
      this.dispatchedDemandCount = 0
    }
  }
}

export function createDispatchQueue(config?: QueueConfig): DispatchQueue {
  return new DispatchQueue(config)
}

