import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    createInspirationBoard,
    getBoardsByOwner,
} from '@/services/inspiration/inspirationBoardService'
import * as firebaseModule from '@/services/firebase'

vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: vi.fn(),
    firestore: {},
}))

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn().mockResolvedValue({ id: 'board-new-1' }),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
}))

describe('inspirationBoardService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createInspirationBoard', () => {
        it('rejects board creation when title is empty', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(true)

            const result = await createInspirationBoard({
                ownerId: 'user-1',
                title: '   ',
            })

            expect(result.success).toBe(false)
            expect(result.error?.code).toBe('VALIDATION_ERROR')
        })

        it('creates board successfully when valid', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(true)

            const result = await createInspirationBoard({
                ownerId: 'user-1',
                title: 'Ideas para Cocina Pequeña',
                description: 'Paleta blanco y madera con mesón de granito',
            })

            expect(result.success).toBe(true)
            expect(result.data?.boardId).toBe('board-new-1')
            expect(result.data?.title).toBe('Ideas para Cocina Pequeña')
            expect(result.data?.items).toEqual([])
        })
    })

    describe('getBoardsByOwner', () => {
        it('returns empty list when firebase is unavailable', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(false)

            const result = await getBoardsByOwner('user-1')
            expect(result.success).toBe(true)
            expect(result.data).toEqual([])
        })
    })
})

