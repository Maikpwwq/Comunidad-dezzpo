import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseUserRegistrationDate, getAdminStats } from '@/services/admin/adminService'
import * as firestoreModule from 'firebase/firestore'

vi.mock('@/services/firebase', () => ({
    isFirebaseAvailable: vi.fn(() => true),
    firestore: { type: 'firestore' },
    auth: null,
}))

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal<typeof import('firebase/firestore')>()
    return {
        ...actual,
        collection: vi.fn((_db, name) => ({ id: name, path: name })),
        doc: vi.fn((_db, ...paths) => ({ id: paths[paths.length - 1], path: paths.join('/') })),
        getDocs: vi.fn(),
        query: vi.fn((col) => col),
        where: vi.fn(),
    }
})

describe('parseUserRegistrationDate', () => {
    it('should parse dd-MM-yyyy string format (standard in Dezzpo)', () => {
        const parsed = parseUserRegistrationDate('21-08-2026')
        expect(parsed).not.toBeNull()
        expect(parsed?.getFullYear()).toBe(2026)
        expect(parsed?.getMonth()).toBe(7) // August is 7 (0-indexed)
        expect(parsed?.getDate()).toBe(21)
    })

    it('should parse dd/MM/yyyy format with slashes', () => {
        const parsed = parseUserRegistrationDate('03/09/2026')
        expect(parsed).not.toBeNull()
        expect(parsed?.getFullYear()).toBe(2026)
        expect(parsed?.getMonth()).toBe(8) // September is 8
        expect(parsed?.getDate()).toBe(3)
    })

    it('should parse yyyy-MM-dd format', () => {
        const parsed = parseUserRegistrationDate('2026-08-15')
        expect(parsed).not.toBeNull()
        expect(parsed?.getFullYear()).toBe(2026)
        expect(parsed?.getMonth()).toBe(7)
        expect(parsed?.getDate()).toBe(15)
    })

    it('should parse ISO 8601 strings accurately', () => {
        const parsed = parseUserRegistrationDate('2026-08-25T14:20:00.000Z')
        expect(parsed).not.toBeNull()
        expect(parsed?.toISOString()).toBe('2026-08-25T14:20:00.000Z')
    })

    it('should parse Firestore Timestamp-like objects with toDate()', () => {
        const targetDate = new Date('2026-08-10T12:00:00.000Z')
        const fakeTimestamp = { toDate: () => targetDate }
        const parsed = parseUserRegistrationDate(fakeTimestamp)
        expect(parsed).toEqual(targetDate)
    })

    it('should parse numeric epoch timestamps', () => {
        const nowMs = Date.now()
        const parsedMs = parseUserRegistrationDate(nowMs)
        expect(parsedMs?.getTime()).toBe(nowMs)

        const nowSec = Math.floor(nowMs / 1000)
        const parsedSec = parseUserRegistrationDate(nowSec)
        expect(parsedSec?.getTime()).toBe(nowSec * 1000)
    })

    it('should return null for null, undefined, empty, or placeholder values', () => {
        expect(parseUserRegistrationDate(null)).toBeNull()
        expect(parseUserRegistrationDate(undefined)).toBeNull()
        expect(parseUserRegistrationDate('')).toBeNull()
        expect(parseUserRegistrationDate('   ')).toBeNull()
        expect(parseUserRegistrationDate('—')).toBeNull()
        expect(parseUserRegistrationDate('invalid-date')).toBeNull()
    })
})

describe('getAdminStats (Real Firestore user aggregation)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should accurately count total users and calculate newUsersLast30d based on document dates', async () => {
        const now = new Date()
        const recentDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        const olderDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) // 60 days ago

        const pad = (n: number) => String(n).padStart(2, '0')
        const formatDdMmYyyy = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`

        const mockPropDocs = [
            { id: 'prop-1', data: () => ({ userJoined: formatDdMmYyyy(recentDate) }) },
        ]

        const mockComDocs = [
            { id: 'com-1', data: () => ({ userJoined: formatDdMmYyyy(recentDate) }) },
            { id: 'com-2', data: () => ({ userJoined: formatDdMmYyyy(olderDate) }) },
            { id: 'com-3', data: () => ({ userJoined: formatDdMmYyyy(recentDate) }) },
        ]

        vi.mocked(firestoreModule.getDocs).mockImplementation(async (targetRef: any) => {
            const path = targetRef?.id || targetRef?.path || ''
            if (path.includes('usersPropietariosResidentes')) {
                return {
                    size: mockPropDocs.length,
                    forEach: (cb: any) => mockPropDocs.forEach(cb),
                } as any
            }
            if (path.includes('usersComerciantesCalificados')) {
                return {
                    size: mockComDocs.length,
                    forEach: (cb: any) => mockComDocs.forEach(cb),
                } as any
            }
            return {
                size: 0,
                forEach: () => {},
            } as any
        })

        const stats = await getAdminStats()

        expect(stats.totalPropietarios).toBe(1)
        expect(stats.totalComerciantes).toBe(3)
        expect(stats.totalUsers).toBe(4)
        expect(stats.newPropietariosLast30d).toBe(1)
        expect(stats.newComerciantesLast30d).toBe(2)
        expect(stats.newUsersLast30d).toBe(3)
    })
})
