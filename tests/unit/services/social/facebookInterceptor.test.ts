import { describe, it, expect, vi } from 'vitest'
import {
  startInterceptionScan,
  createInterceptionWorker,
  classifyPostIntent,
  prepareComment,
  createCircuitBreaker,
  createMetaGraphClient,
  createDispatchQueue,
} from '@/services/social'
import type { MetaGraphPost } from '@/services/social/types'

describe('Facebook Interceptor Orchestrator', () => {
  it('should export all public modules and factory functions cleanly', () => {
    expect(startInterceptionScan).toBeDefined()
    expect(createInterceptionWorker).toBeDefined()
    expect(classifyPostIntent).toBeDefined()
    expect(prepareComment).toBeDefined()
    expect(createCircuitBreaker).toBeDefined()
    expect(createMetaGraphClient).toBeDefined()
    expect(createDispatchQueue).toBeDefined()
  })

  it('should execute a full scan cycle via startInterceptionScan', async () => {
    const mockPost: MetaGraphPost = {
      id: 'group_test_post_1',
      message: 'Busco plomero con urgencia en Chapinero',
      from: { id: 'user_test', name: 'Laura' },
      created_time: '2026-08-29T00:00:00Z',
      permalink_url: 'https://facebook.com/groups/1/posts/1',
    }

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('/feed')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({
            'x-app-usage': JSON.stringify({ call_count: 10, total_cputime: 10, total_time: 10 }),
          }),
          json: async () => ({ data: [mockPost] }),
        }
      }
      if (url.includes('/comments')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({
            'x-app-usage': JSON.stringify({ call_count: 12, total_cputime: 12, total_time: 12 }),
          }),
          json: async () => ({ id: 'comment_999' }),
        }
      }
      return { ok: false, status: 404, headers: new Headers(), json: async () => ({}) }
    })

    const metrics = await startInterceptionScan(
      {
        groupIds: ['group_101'],
        pageAccessToken: 'token_123',
        jitterMinMs: 2,
        jitterMaxMs: 5,
        quietHoursStart: 3,
        quietHoursEnd: 4,
      },
      { customFetch: mockFetch as unknown as typeof fetch }
    )

    expect(metrics.totalPostsScanned).toBe(1)
    expect(metrics.classifiedDemand).toBe(1)
    expect(metrics.dispatched).toBe(1)
    expect(metrics.failed).toBe(0)
  })
})
