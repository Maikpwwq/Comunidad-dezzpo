import { describe, it, expect, vi } from 'vitest'
import {
  parseInterceptionSnapshot,
  subscribeToSocialInterceptions,
  createFirestorePersistenceAdapter,
} from '@/services/social/interceptionsRepository'
import type { QuerySnapshot, DocumentData, Firestore } from 'firebase/firestore'

describe('Interceptions Repository (Production Firestore Data Layer)', () => {
  it('should return clean EMPTY_SOCIAL_STATS with no hardcoded mocks when snapshot is empty', () => {
    const emptySnap = {
      empty: true,
      size: 0,
      docs: [],
    } as unknown as QuerySnapshot<DocumentData>

    const stats = parseInterceptionSnapshot(emptySnap)

    expect(stats.totalInterceptions).toBe(0)
    expect(stats.demandInterceptions).toBe(0)
    expect(stats.supplyInterceptions).toBe(0)
    expect(stats.dispatchedComments).toBe(0)
    expect(stats.simulatedComments).toBe(0)
    expect(stats.failedComments).toBe(0)
    expect(stats.breakerState).toBe('CLOSED')
    expect(stats.appUsage.callCountPercent).toBe(0)
    expect(stats.recentEvents).toEqual([])
  })

  it('should dynamically aggregate real document records and sort by timestamp descending', () => {
    const mockDocs = [
      {
        id: 'doc_1',
        data: () => ({
          postId: 'post_101',
          commentId: 'comment_101',
          authorName: 'Mario Albañil',
          groupName: 'Construcción Bogotá',
          intent: 'SUPPLY',
          detectedTrade: 'albañil',
          copyId: 'MAES-01',
          renderedComment: 'Comentario maestro',
          timestamp: '2026-09-01T10:00:00Z',
          status: 'dispatched',
        }),
      },
      {
        id: 'doc_2',
        data: () => ({
          postId: 'post_102',
          authorName: 'Laura Propietaria',
          groupName: 'Plomería Suba',
          intent: 'DEMAND',
          detectedTrade: 'plomero',
          copyId: 'CLI-01',
          renderedComment: 'Comentario cliente',
          timestamp: '2026-09-01T12:00:00Z', // More recent than doc_1
          status: 'visited',
          visitedAt: '2026-09-01T12:05:00Z',
        }),
      },
      {
        id: 'doc_3',
        data: () => ({
          postId: 'post_103',
          authorName: 'Pedro Electricista',
          groupName: 'Electricistas Bogotá',
          intent: 'SUPPLY',
          detectedTrade: 'electricista',
          copyId: 'MAES-02',
          renderedComment: 'Comentario electricista',
          timestamp: '2026-09-01T09:00:00Z',
          status: 'failed',
          errorCode: 403,
          errorDetails: 'Missing Permission #3',
        }),
      },
      {
        id: 'doc_4',
        data: () => ({
          postId: 'post_104',
          authorName: 'Test Simulation',
          groupName: 'Simulaciones',
          intent: 'DEMAND',
          detectedTrade: 'pintor',
          copyId: 'TEST-01',
          renderedComment: 'Test mock',
          timestamp: '2026-09-01T08:00:00Z',
          status: 'simulated',
        }),
      },
    ]

    const snap = {
      empty: false,
      size: 4,
      docs: mockDocs,
    } as unknown as QuerySnapshot<DocumentData>

    const stats = parseInterceptionSnapshot(snap)

    expect(stats.totalInterceptions).toBe(4)
    expect(stats.supplyInterceptions).toBe(2)
    expect(stats.demandInterceptions).toBe(2)
    expect(stats.dispatchedComments).toBe(2) // doc_1 (dispatched) + doc_2 (visited)
    expect(stats.failedComments).toBe(1) // doc_3 (failed)
    expect(stats.simulatedComments).toBe(1) // doc_4 (simulated)

    // Verify sorted descending by timestamp
    expect(stats.recentEvents[0]?.id).toBe('doc_2')
    expect(stats.recentEvents[1]?.id).toBe('doc_1')
    expect(stats.recentEvents[2]?.id).toBe('doc_3')
    expect(stats.recentEvents[3]?.id).toBe('doc_4')

    // Verify error detail capture
    expect(stats.recentEvents[2]?.errorCode).toBe(403)
    expect(stats.recentEvents[2]?.errorDetails).toBe('Missing Permission #3')
  })

  it('should return no-op cleanup when window is undefined in SSR', () => {
    const onUpdate = vi.fn()
    const originalWindow = globalThis.window

    try {
      // @ts-expect-error simulating SSR environment
      delete globalThis.window

      const unsubscribe = subscribeToSocialInterceptions(onUpdate)
      expect(typeof unsubscribe).toBe('function')
      expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ totalInterceptions: 0 }))
      expect(() => unsubscribe()).not.toThrow()
    } finally {
      globalThis.window = originalWindow
    }
  })

  it('should persist events and deltas via FirestorePersistenceAdapter', async () => {
    const mockDb = {
      type: 'firestore',
    } as unknown as Firestore

    const adapter = createFirestorePersistenceAdapter(mockDb)

    expect(adapter.getDelta).toBeDefined()
    expect(adapter.setDelta).toBeDefined()
    expect(adapter.logEvent).toBeDefined()
  })
})
