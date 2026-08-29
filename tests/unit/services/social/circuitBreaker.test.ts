import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CircuitBreaker, createCircuitBreaker } from '@/services/social/circuitBreaker'

describe('Social Circuit Breaker Engine', () => {
  let breaker: CircuitBreaker

  beforeEach(() => {
    breaker = createCircuitBreaker({
      usageThresholdPercent: 80,
      baseCooldownMs: 60_000, // 1 min for testing
      maxCooldownMs: 600_000,
    })
  })

  it('should initialize in CLOSED state and allow operations', () => {
    const snapshot = breaker.getSnapshot()
    expect(snapshot.state).toBe('CLOSED')
    expect(snapshot.lastUsage).toBeNull()
    expect(breaker.canProceed()).toBe(true)
  })

  it('should remain CLOSED when usage is below 80%', () => {
    breaker.reportUsage({ call_count: 50, total_cputime: 40, total_time: 30 })
    expect(breaker.getSnapshot().state).toBe('CLOSED')
    expect(breaker.canProceed()).toBe(true)
  })

  it('should trip to OPEN immediately when call_count >= 80%', () => {
    breaker.reportUsage({ call_count: 82, total_cputime: 40, total_time: 30 })
    const snapshot = breaker.getSnapshot()
    expect(snapshot.state).toBe('OPEN')
    expect(snapshot.cooldownSecondsRemaining).toBeGreaterThan(0)
    expect(breaker.canProceed()).toBe(false)
  })

  it('should trip to OPEN immediately when total_cputime >= 80%', () => {
    breaker.reportUsage({ call_count: 20, total_cputime: 85, total_time: 15 })
    expect(breaker.getSnapshot().state).toBe('OPEN')
    expect(breaker.canProceed()).toBe(false)
  })

  it('should trip to OPEN on Meta Rate Limit errors (Code 4 and 17)', () => {
    breaker.reportError(4, 'App rate limit exceeded')
    expect(breaker.getSnapshot().state).toBe('OPEN')
    expect(breaker.canProceed()).toBe(false)

    breaker.reset()
    breaker.reportError(17, 'User rate limit exceeded')
    expect(breaker.getSnapshot().state).toBe('OPEN')
  })

  it('should trigger permanent KILL SWITCH (HALTED) on Error 368 (Spam block)', () => {
    breaker.reportError(368, 'Your account is temporarily restricted from posting')
    const snapshot = breaker.getSnapshot()
    expect(snapshot.state).toBe('HALTED')
    expect(snapshot.haltReason).toContain('KILL SWITCH ACTIVATED')
    expect(breaker.canProceed()).toBe(false)
  })

  it('should transition from OPEN to HALF_OPEN after cooldown expires', () => {
    vi.useFakeTimers()
    const now = Date.now()
    vi.setSystemTime(now)

    breaker.reportUsage({ call_count: 85, total_cputime: 20, total_time: 10 })
    expect(breaker.getSnapshot().state).toBe('OPEN')
    expect(breaker.canProceed()).toBe(false)

    // Advance time past cooldown (1 min + jitter ~ 70s)
    vi.advanceTimersByTime(75_000)

    // canProceed() should detect expired cooldown and transition to HALF_OPEN
    expect(breaker.canProceed()).toBe(true)
    expect(breaker.getSnapshot().state).toBe('HALF_OPEN')

    // Reporting healthy usage in HALF_OPEN should close the breaker
    breaker.reportUsage({ call_count: 25, total_cputime: 20, total_time: 15 })
    expect(breaker.getSnapshot().state).toBe('CLOSED')

    vi.useRealTimers()
  })

  it('should support manual state forcing for dev simulation and MCP', () => {
    breaker.forceState('OPEN', 'Simulated Rate Limit')
    expect(breaker.getSnapshot().state).toBe('OPEN')
    expect(breaker.getSnapshot().haltReason).toBe('Simulated Rate Limit')

    breaker.forceState('CLOSED')
    expect(breaker.getSnapshot().state).toBe('CLOSED')
    expect(breaker.canProceed()).toBe(true)
  })
})
