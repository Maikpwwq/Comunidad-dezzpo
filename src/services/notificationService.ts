/**
 * Notification Service
 *
 * Handles database operations for in-app and mass notifications:
 * - Individual and broadcast notification creation
 * - Real-time Firestore subscription (`onSnapshot`)
 * - Mark as read / mark all as read
 * - Filtered queries (system announcements, service updates, social activity)
 */

import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    query,
    where,
    onSnapshot,
    writeBatch,
    type Unsubscribe,
} from 'firebase/firestore'
import { firestore } from './firebase'
import type { NotificationDocument, NotificationType } from './types'

const NOTIFICATIONS_COLLECTION = 'notifications'

/**
 * Creates an individual system notification
 */
export async function createNotification(
    data: Omit<NotificationDocument, 'notificationId' | 'isRead' | 'createdAt'>
): Promise<string | null> {
    if (!firestore) return null

    try {
        const colRef = collection(firestore, NOTIFICATIONS_COLLECTION)
        const docRef = await addDoc(colRef, {
            ...data,
            isRead: false,
            createdAt: new Date().toISOString(),
        })

        await updateDoc(docRef, { notificationId: docRef.id })
        return docRef.id
    } catch (error) {
        console.error('Error creating notification:', error)
        return null
    }
}

/**
 * Creates a mass broadcast notification for all users or targeted by role (Admin action)
 */
export async function broadcastNotification(data: {
    title: string
    body: string
    actionUrl?: string | undefined
    recipientRole?: 1 | 2 | undefined
    type?: NotificationType | undefined
}): Promise<string | null> {
    return createNotification({
        recipientId: 'ALL',
        recipientRole: data.recipientRole,
        type: data.type || 'system_announcement',
        title: data.title,
        body: data.body,
        actionUrl: data.actionUrl,
    })
}

/**
 * Gets user notifications (Direct notifications + Broadcasts for 'ALL')
 */
export async function getUserNotifications(userId: string): Promise<NotificationDocument[]> {
    if (!firestore || !userId) return []

    try {
        const colRef = collection(firestore, NOTIFICATIONS_COLLECTION)

        // Fetch direct user notifications
        const qDirect = query(colRef, where('recipientId', '==', userId))
        const snapDirect = await getDocs(qDirect)

        // Fetch broadcast notifications
        const qBroadcast = query(colRef, where('recipientId', '==', 'ALL'))
        const snapBroadcast = await getDocs(qBroadcast)

        const allDocs = [...snapDirect.docs, ...snapBroadcast.docs]
        const map = new Map<string, NotificationDocument>()

        allDocs.forEach((d) => {
            const data = { ...d.data(), notificationId: d.id } as NotificationDocument
            map.set(d.id, data)
        })

        const sorted = Array.from(map.values()).sort(
            (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')
        )

        return sorted
    } catch (error) {
        console.error('Error fetching user notifications:', error)
        return []
    }
}

/**
 * Subscribes to real-time notification updates for a user
 */
export function subscribeUserNotifications(
    userId: string,
    onUpdate: (notifications: NotificationDocument[]) => void
): Unsubscribe {
    if (!firestore || !userId) {
        onUpdate([])
        return () => {}
    }

    const colRef = collection(firestore, NOTIFICATIONS_COLLECTION)

    // Subscribe to direct user notifications
    const qDirect = query(colRef, where('recipientId', '==', userId))
    
    // Subscribe to mass broadcasts
    const qBroadcast = query(colRef, where('recipientId', '==', 'ALL'))

    let directList: NotificationDocument[] = []
    let broadcastList: NotificationDocument[] = []

    const mergeAndEmit = () => {
        const map = new Map<string, NotificationDocument>()
        directList.forEach((n) => map.set(n.notificationId || n.id, n))
        broadcastList.forEach((n) => map.set(n.notificationId || n.id, n))

        const sorted = Array.from(map.values()).sort(
            (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')
        )
        onUpdate(sorted)
    }

    const unsubDirect = onSnapshot(
        qDirect,
        (snapshot) => {
            directList = snapshot.docs.map(
                (d) => ({ ...d.data(), notificationId: d.id } as NotificationDocument)
            )
            mergeAndEmit()
        },
        (error) => {
            console.error('Real-time direct notifications subscription error:', error)
        }
    )

    const unsubBroadcast = onSnapshot(
        qBroadcast,
        (snapshot) => {
            broadcastList = snapshot.docs.map(
                (d) => ({ ...d.data(), notificationId: d.id } as NotificationDocument)
            )
            mergeAndEmit()
        },
        (error) => {
            console.error('Real-time broadcast notifications subscription error:', error)
        }
    )

    return () => {
        unsubDirect()
        unsubBroadcast()
    }
}

/**
 * Marks a single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
    if (!firestore || !notificationId) return false

    try {
        const docRef = doc(firestore, NOTIFICATIONS_COLLECTION, notificationId)
        await updateDoc(docRef, { isRead: true })
        return true
    } catch (error) {
        console.error('Error marking notification as read:', error)
        return false
    }
}

/**
 * Marks all notifications for a user as read
 */
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
    if (!firestore || !userId) return false

    try {
        const notifications = await getUserNotifications(userId)
        const unread = notifications.filter((n) => !n.isRead && n.notificationId)

        if (unread.length === 0) return true

        const batch = writeBatch(firestore)
        unread.forEach((n) => {
            if (n.notificationId) {
                const docRef = doc(firestore, NOTIFICATIONS_COLLECTION, n.notificationId)
                batch.update(docRef, { isRead: true })
            }
        })

        await batch.commit()
        return true
    } catch (error) {
        console.error('Error marking all notifications as read:', error)
        return false
    }
}
