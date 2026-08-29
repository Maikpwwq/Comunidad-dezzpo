import { describe, it, expect, vi } from 'vitest'
import { createAutonomousWorker } from '@/services/social/autonomousWorker'
import type { MetaGraphPost } from '@/services/social/types'

describe('Autonomous Worker (Production Cron Engine)', () => {
  const mockPosts: MetaGraphPost[] = [
    {
      id: 'group1_post1',
      message: 'Ofrezco servicios de plomería y remodelación de baños en Suba',
      from: { id: 'user_1', name: 'Mario Plomero' },
      created_time: '2026-08-29T00:00:00Z',
      permalink_url: 'https://facebook.com/groups/group1/posts/post1',
    },
    {
      id: 'group1_post2',
      message: 'Busco pintor profesional urgente para casa de 2 pisos',
      from: { id: 'user_2', name: 'Laura Dueña' },
      created_time: '2026-08-29T00:01:00Z',
      permalink_url: 'https://facebook.com/groups/group1/posts/post2',
    },
    {
      id: 'group1_post3',
      message: 'Vendo bicicleta usada en buen estado',
      from: { id: 'user_3', name: 'Carlos' },
      created_time: '2026-08-29T00:02:00Z',
      permalink_url: 'https://facebook.com/groups/group1/posts/post3',
    },
  ]

  const mockCustomFetch = vi.fn().mockImplementation(async (url: string) => {
    if (url.includes('/feed')) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({
          'x-app-usage': JSON.stringify({ call_count: 20, total_cputime: 15, total_time: 10 }),
        }),
        json: async () => ({ data: mockPosts }),
      }
    }
    if (url.includes('/comments')) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({
          'x-app-usage': JSON.stringify({ call_count: 22, total_cputime: 16, total_time: 11 }),
        }),
        json: async () => ({ id: 'comment_123' }),
      }
    }
    return { ok: false, status: 404, headers: new Headers(), json: async () => ({}) }
  })

  it('should execute a scan tick, classify posts, and dispatch comments', async () => {
    const worker = createAutonomousWorker(
      {
        groupIds: ['group_bogota_1'],
        pageAccessToken: 'test_token',
        jitterMinMs: 5,
        jitterMaxMs: 10,
        maxCommentsPerHour: 10,
        quietHoursStart: 3,
        quietHoursEnd: 4,
      },
      { customFetch: mockCustomFetch as unknown as typeof fetch }
    )

    const metrics = await worker.executeScanTick()

    expect(metrics.totalPostsScanned).toBe(3)
    expect(metrics.classifiedSupply).toBe(1)
    expect(metrics.classifiedDemand).toBe(1)
    expect(metrics.classifiedNeutral).toBe(1)
    expect(metrics.enqueued).toBe(2)
    expect(metrics.dispatched).toBe(2)
    expect(metrics.failed).toBe(0)
  })

  it('should pause and resume without scanning', async () => {
    const worker = createAutonomousWorker(
      {
        groupIds: ['group_1'],
        pageAccessToken: 'test_token',
      },
      { customFetch: mockCustomFetch as unknown as typeof fetch }
    )

    worker.pause()
    expect(worker.getState().isPaused).toBe(true)

    const metrics = await worker.executeScanTick()
    expect(metrics.totalPostsScanned).toBe(0)

    worker.resume()
    expect(worker.getState().isPaused).toBe(false)
  })

  it('should update and persist deltas across ticks', async () => {
    const mockPersistence = {
      getDelta: vi.fn().mockResolvedValue(null),
      setDelta: vi.fn().mockResolvedValue(undefined),
      logEvent: vi.fn().mockResolvedValue(undefined),
    }

    const worker = createAutonomousWorker(
      {
        groupIds: ['group_1'],
        pageAccessToken: 'test_token',
        jitterMinMs: 2,
        jitterMaxMs: 5,
        quietHoursStart: 3,
        quietHoursEnd: 4,
      },
      {
        persistence: mockPersistence,
        customFetch: mockCustomFetch as unknown as typeof fetch,
      }
    )

    await worker.executeScanTick()
    expect(mockPersistence.setDelta).toHaveBeenCalledWith('group_1', '2026-08-29T00:00:00Z')
    expect(mockPersistence.logEvent).toHaveBeenCalled()
  })
})
