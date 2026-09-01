import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DispatchQueue, createDispatchQueue } from '@/services/social/dispatchQueue'
import { createCircuitBreaker } from '@/services/social/circuitBreaker'
import type { DispatchTask, PostIntent } from '@/services/social/types'

describe('Social Dispatch Queue with Jitter and 6:4 Ratio Balancing', () => {
  let queue: DispatchQueue

  beforeEach(() => {
    queue = createDispatchQueue({
      jitterMinMs: 1, // Fast for testing
      jitterMaxMs: 2,
      maxCommentsPerHour: 20,
      quietHoursStart: -1, // Disabled for testing
      quietHoursEnd: -1,
      targetRatio: { supply: 0.60, demand: 0.40 },
      enableRatioBalancing: true,
    })
  })

  const createDummyTask = (id: string, intent: PostIntent = 'SUPPLY', groupName = 'Maestros Bogotá'): DispatchTask => ({
    id,
    postId: `post_${id}`,
    postPermalink: `https://facebook.com/groups/1/posts/${id}`,
    authorId: `author_${id}`,
    authorName: `Author ${id}`,
    groupName,
    detectedTrade: 'maestro',
    commentBody: `Hola Author ${id}, mira nuestro catálogo 👉 https://dezzpo.com`,
    utmUrl: 'https://dezzpo.com?utm_source=facebook',
    copyId: intent === 'SUPPLY' ? 'VTA-CON-CON-01' : 'CLI-RAP-CON-CON-01',
    intent,
    status: 'PENDING',
    enqueuedAt: Date.now(),
    dispatchedAt: null,
    errorCode: null,
  })

  it('should enqueue tasks and prevent duplicate pending items', () => {
    queue.enqueue(createDummyTask('1'))
    queue.enqueue(createDummyTask('1')) // Duplicate
    queue.enqueue(createDummyTask('2'))

    const stats = queue.getStats()
    expect(stats.pending).toBe(2)
  })

  it('should process tasks sequentially and update status to DISPATCHED', async () => {
    queue.enqueue(createDummyTask('1'))
    queue.enqueue(createDummyTask('2'))

    const mockPoster = vi.fn().mockResolvedValue({ success: true })
    const results = await queue.processQueue(mockPoster)

    expect(mockPoster).toHaveBeenCalledTimes(2)
    expect(results[0]?.status).toBe('DISPATCHED')
    expect(results[1]?.status).toBe('DISPATCHED')
    expect(queue.getStats().pending).toBe(0)
    expect(queue.getStats().dispatchedInCurrentHour).toBe(2)
  })

  it('should enforce 6:4 (60% Supply / 40% Demand) ratio priority during processing', async () => {
    // Enqueue 5 Demand and 5 Supply tasks
    queue.enqueue(createDummyTask('D1', 'DEMAND'))
    queue.enqueue(createDummyTask('D2', 'DEMAND'))
    queue.enqueue(createDummyTask('D3', 'DEMAND'))
    queue.enqueue(createDummyTask('D4', 'DEMAND'))
    queue.enqueue(createDummyTask('D5', 'DEMAND'))
    queue.enqueue(createDummyTask('S1', 'SUPPLY'))
    queue.enqueue(createDummyTask('S2', 'SUPPLY'))
    queue.enqueue(createDummyTask('S3', 'SUPPLY'))
    queue.enqueue(createDummyTask('S4', 'SUPPLY'))
    queue.enqueue(createDummyTask('S5', 'SUPPLY'))

    const mockPoster = vi.fn().mockResolvedValue({ success: true })
    const results = await queue.processQueue(mockPoster)

    expect(mockPoster).toHaveBeenCalledTimes(10)
    
    // Check that Supply (60% target) was dispatched first to establish ratio
    expect(results[0]?.id).toBe('S1')
    expect(results[0]?.intent).toBe('SUPPLY')

    const stats = queue.getStats()
    expect(stats.dispatchedSupplyTotal).toBe(5)
    expect(stats.dispatchedDemandTotal).toBe(5)
    expect(stats.currentRatio.supplyPercent).toBe(50)
    expect(stats.currentRatio.demandPercent).toBe(50)
  })

  it('should enforce hourly comment limit and mark excess as SKIPPED', async () => {
    const limitedQueue = createDispatchQueue({
      jitterMinMs: 1,
      jitterMaxMs: 2,
      maxCommentsPerHour: 3,
      quietHoursStart: -1,
      quietHoursEnd: -1,
    })

    limitedQueue.enqueue(createDummyTask('1'))
    limitedQueue.enqueue(createDummyTask('2'))
    limitedQueue.enqueue(createDummyTask('3'))
    limitedQueue.enqueue(createDummyTask('4')) // 4th exceeds maxCommentsPerHour = 3

    const mockPoster = vi.fn().mockResolvedValue({ success: true })
    const results = await limitedQueue.processQueue(mockPoster)

    expect(mockPoster).toHaveBeenCalledTimes(3)
    expect(results[3]?.status).toBe('SKIPPED')
    expect(results[3]?.errorDetails).toContain('Hourly comment limit reached')
  })

  it('should stop processing if circuit breaker is OPEN', async () => {
    const breaker = createCircuitBreaker()
    breaker.trip('Rate limit exceeded in test')

    queue.enqueue(createDummyTask('1'))
    queue.enqueue(createDummyTask('2'))

    const mockPoster = vi.fn().mockResolvedValue({ success: true })
    const results = await queue.processQueue(mockPoster, breaker)

    expect(mockPoster).not.toHaveBeenCalled()
    expect(results[0]?.status).toBe('SKIPPED')
    expect(results[0]?.errorCode).toBe(429)
  })

  it('should preserve groupName across enqueued tasks and results', () => {
    const task = createDummyTask('grp_1', 'SUPPLY', 'Construcción y Reformas Suba')
    queue.enqueue(task)
    const next = queue.getNextPendingTask()
    expect(next?.groupName).toBe('Construcción y Reformas Suba')
  })
})

