import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getFunnelMetrics } from '@/services/admin/adminService'
import { trackSearch } from '@/utils/analytics'
import * as firebaseService from '@/services/firebase'

// Mock firebase firestore methods used by adminService & analytics
vi.mock('@services/firebase', () => ({
    firestore: { __mockFirestore: true },
    isFirebaseAvailable: vi.fn(() => true),
}))

vi.mock('firebase/firestore', () => {
    return {
        collection: vi.fn((_db, colName) => ({ colName })),
        query: vi.fn((col, ...clauses) => ({ col, clauses })),
        where: vi.fn((field, op, val) => ({ field, op, val })),
        getCountFromServer: vi.fn(async (q) => {
            const eventNameClause = q.clauses?.find((c: any) => c.field === 'eventName')
            const eventName = eventNameClause?.val
            if (eventName === 'search_services') return { data: () => ({ count: 309 }) }
            if (eventName === 'view_profile') return { data: () => ({ count: 27 }) }
            if (eventName === 'initiate_contact') return { data: () => ({ count: 0 }) }
            if (eventName === 'complete_payment') return { data: () => ({ count: 0 }) }
            return { data: () => ({ count: 0 }) }
        }),
        addDoc: vi.fn(async (_col, data) => ({ id: 'mock-doc-id', ...data })),
        getDocs: vi.fn(async () => ({ docs: [], size: 0 })),
        doc: vi.fn((_db, col, id) => ({ col, id })),
        getDoc: vi.fn(async () => ({ exists: () => false, data: () => null })),
    }
})

describe('Admin Dashboard & Funnel Baseline Characterization', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('characterizes getFunnelMetrics querying funnel_events with count queries', async () => {
        const metrics = await getFunnelMetrics()
        expect(metrics).toEqual([
            { stage: 'Búsquedas', count: 309 },
            { stage: 'Vistas Perfil', count: 27 },
            { stage: 'Contactos', count: 0 },
            { stage: 'Pagos Completados', count: 0 },
        ])
    })

    it('characterizes fallback to zeroes when Firebase is unavailable', async () => {
        const spy = vi.spyOn(firebaseService, 'isFirebaseAvailable').mockReturnValueOnce(false)
        const metrics = await getFunnelMetrics()
        expect(metrics).toEqual([
            { stage: 'Búsquedas', count: 0 },
            { stage: 'Vistas Perfil', count: 0 },
            { stage: 'Contactos', count: 0 },
            { stage: 'Pagos Completados', count: 0 },
        ])
        spy.mockRestore()
    })

    it('characterizes trackSearch event structure and parameters', async () => {
        const mockGtag = vi.fn()
        ;(window as any).gtag = mockGtag

        trackSearch('Plomería', 'Suba', 8)

        expect(mockGtag).toHaveBeenCalledWith('event', 'search_services', {
            service: 'Plomería',
            zone: 'Suba',
            results_count: 8,
        })
    })
})
