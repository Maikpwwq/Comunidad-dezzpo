import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DispatchQueue, createDispatchQueue } from '@/services/social/dispatchQueue'
import { createCircuitBreaker } from '@/services/social/circuitBreaker'
import type { DispatchTask } from '@/services/social/types'

describe('Social Dispatch Queue with Jitter', () => {
  let queue: DispatchQueue

  beforeEach(() => {
    queue = createDispatchQueue({
      jitterMinMs: 5, // Fast for testing
      jitterMaxMs: 10,
      maxCommentsPerHour: 3,
      quietHoursStart: -1, // Disabled for testing
      quietHoursEnd: -1,
    })
  })

  const createDummyTask = (id: string): DispatchTask => ({
    id,
    postId: `post_${id}`,
    postPermalink: `https://facebook.com/groups/1/posts/${id}`,
    authorId: `author_${id}`,
    authorName: `Author ${id}`,
    commentBody: `Hola Author ${id}, mira nuestro catálogo 👉 https://dezzpo.com`,
    utmUrl: 'https://dezzpo.com?utm_source=facebook',
    copyId: 'VTA-CON-CON-01',
    intent: 'SUPPLY',
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

  it('should enforce hourly comment limit and mark excess as SKIPPED', async () => {
    queue.enqueue(createDummyTask('1'))
    queue.enqueue(createDummyTask('2'))
    queue.enqueue(createDummyTask('3'))
    queue.enqueue(createDummyTask('4')) // 4th exceeds maxCommentsPerHour = 3

    const mockPoster = vi.fn().mockResolvedValue({ success: true })
    const results = await queue.processQueue(mockPoster)

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
})
