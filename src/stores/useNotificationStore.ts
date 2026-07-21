/**
 * Notification Store — Zustand
 *
 * Global reactive state for user notifications and unread badge count.
 */

import { create } from 'zustand'
import type { NotificationDocument } from '@services/types'
import {
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from '@services/notificationService'

interface NotificationState {
    notifications: NotificationDocument[]
    unreadCount: number
    loading: boolean
    setNotifications: (list: NotificationDocument[]) => void
    setLoading: (loading: boolean) => void
    markRead: (notificationId: string) => Promise<void>
    markAllRead: (userId: string) => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: true,

    setNotifications: (list) => {
        const unread = list.filter((n) => !n.isRead).length
        set({ notifications: list, unreadCount: unread, loading: false })
    },

    setLoading: (loading) => set({ loading }),

    markRead: async (notificationId) => {
        const { notifications } = get()
        const updated = notifications.map((n) =>
            (n.notificationId || n.id) === notificationId ? { ...n, isRead: true } : n
        )
        const unread = updated.filter((n) => !n.isRead).length
        set({ notifications: updated, unreadCount: unread })

        await markNotificationAsRead(notificationId)
    },

    markAllRead: async (userId) => {
        const { notifications } = get()
        const updated = notifications.map((n) => ({ ...n, isRead: true }))
        set({ notifications: updated, unreadCount: 0 })

        await markAllNotificationsAsRead(userId)
    },
}))
