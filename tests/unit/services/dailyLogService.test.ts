import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    generateContractShareToken,
    verifyContractShareToken,
    addDailyLog,
} from '@/services/contracts/dailyLogService'
import * as firebaseModule from '@/services/firebase'

vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: vi.fn(),
    firestore: {},
}))

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    doc: vi.fn(),
    addDoc: vi.fn().mockResolvedValue({ id: 'log-123' }),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
}))

describe('dailyLogService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('generateContractShareToken & verifyContractShareToken', () => {
        it('generates consistent token for the same contractId', () => {
            const token1 = generateContractShareToken('contract-abc-123')
            const token2 = generateContractShareToken('contract-abc-123')
            expect(token1).toBe(token2)
            expect(token1).toContain('contract')
        })

        it('verifies valid token correctly', () => {
            const token = generateContractShareToken('contract-abc-123')
            expect(verifyContractShareToken('contract-abc-123', token)).toBe(true)
            expect(verifyContractShareToken('contract-xyz-999', token)).toBe(false)
        })
    })

    describe('addDailyLog', () => {
        it('rejects log when both notes and photos are empty', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(true)

            const result = await addDailyLog({
                contractId: 'c1',
                authorId: 'user1',
                notes: '   ',
                photos: [],
            })

            expect(result.success).toBe(false)
            expect(result.error?.code).toBe('VALIDATION_ERROR')
        })

        it('creates daily log successfully when photos or notes are present', async () => {
            vi.mocked(firebaseModule.isFirebaseAvailable).mockReturnValue(true)

            const result = await addDailyLog({
                contractId: 'c1',
                authorId: 'user1',
                notes: 'Instalación de tuberías completada',
                photos: ['https://storage.googleapis.com/test.webp'],
                isPublicForShare: true,
            })

            expect(result.success).toBe(true)
            expect(result.data?.logId).toBe('log-123')
            expect(result.data?.isPublicForShare).toBe(true)
        })
    })
})

