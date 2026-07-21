/**
 * Notification Service Unit Tests
 *
 * Tests for notification creation, broadcasting, real-time fetching, and read state management.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    createNotification,
    broadcastNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '@services/notificationService'

import * as firestoreModule from 'firebase/firestore'

// Mock Firebase availability & Firestore methods
vi.mock('@services/firebase', () => ({
    isFirebaseAvailable: () => true,
    firestore: {},
}))

vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal<typeof import('firebase/firestore')>()
    return {
        ...actual,
        collection: vi.fn(() => ({ type: 'collection' })),
        doc: vi.fn((_db, ...paths) => ({ type: 'doc', path: paths.join('/') })),
        addDoc: vi.fn(() => Promise.resolve({ id: 'notif-123' })),
        getDocs: vi.fn(),
        updateDoc: vi.fn(() => Promise.resolve()),
        writeBatch: vi.fn(() => ({
            update: vi.fn(),
            commit: vi.fn(() => Promise.resolve()),
        })),
        query: vi.fn((col) => col),
        where: vi.fn(),
        onSnapshot: vi.fn(),
    }
})

describe('notificationService', () => {
    const mockUserId = 'user-test-777'

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('createNotification', () => {
        it('creates a new notification document and assigns ID', async () => {
            const id = await createNotification({
                recipientId: mockUserId,
                type: 'quote_received',
                title: 'Nueva propuesta',
                body: 'Un contratista envió una cotización',
            })

            expect(id).toBe('notif-123')
            expect(firestoreModule.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    recipientId: mockUserId,
                    type: 'quote_received',
                    isRead: false,
                })
            )
        })
    })

    describe('broadcastNotification', () => {
        it('creates a broadcast notification targeted to ALL', async () => {
            const id = await broadcastNotification({
                title: 'Mantenimiento del sistema',
                body: 'La plataforma estará en mantenimiento breve',
            })

            expect(id).toBe('notif-123')
            expect(firestoreModule.addDoc).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    recipientId: 'ALL',
                    type: 'system_announcement',
                })
            )
        })
    })

    describe('getUserNotifications', () => {
        it('fetches and merges direct and broadcast notifications ordered by date', async () => {
            vi.mocked(firestoreModule.getDocs)
                .mockResolvedValueOnce({
                    docs: [
                        {
                            id: 'n1',
                            data: () => ({
                                title: 'Direct notif',
                                createdAt: '2026-07-21T10:00:00Z',
                                isRead: false,
                            }),
                        },
                    ],
                } as any)
                .mockResolvedValueOnce({
                    docs: [
                        {
                            id: 'n2',
                            data: () => ({
                                title: 'Broadcast notif',
                                createdAt: '2026-07-21T12:00:00Z',
                                isRead: false,
                            }),
                        },
                    ],
                } as any)

            const list = await getUserNotifications(mockUserId)

            expect(list.length).toBe(2)
            expect(list[0]!.title).toBe('Broadcast notif')
            expect(list[1]!.title).toBe('Direct notif')
        })
    })

    describe('markNotificationAsRead', () => {
        it('updates notification isRead status in firestore', async () => {
            const success = await markNotificationAsRead('n1')

            expect(success).toBe(true)
            expect(firestoreModule.updateDoc).toHaveBeenCalledWith(
                expect.anything(),
                { isRead: true }
            )
        })
    })
})
