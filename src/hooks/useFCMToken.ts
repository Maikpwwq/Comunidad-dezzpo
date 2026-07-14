/**
 * useFCMToken Hook
 *
 * Registers the browser for Firebase Cloud Messaging push notifications.
 * On mount (for authenticated Comerciantes), it:
 *   1. Registers the FCM service worker
 *   2. Requests notification permission
 *   3. Retrieves the FCM token
 *   4. Persists the token to the user's Firestore document (fcmTokens array)
 *
 * SSR-safe: all browser APIs are guarded behind `typeof window !== 'undefined'`.
 */

import { useEffect, useRef } from 'react'
import { useUserStore } from '@stores/userStore'
import { firebaseApp } from '@services/firebase'
import { firebaseClientConfig } from '@services/firebase/config'
import { updateUser } from '@services/users'
import { arrayUnion } from 'firebase/firestore'

/**
 * Lazily import firebase/messaging to avoid SSR crashes.
 * Returns { getMessaging, getToken, onMessage } or null on SSR.
 */
async function loadMessaging() {
    if (typeof window === 'undefined') return null
    const mod = await import('firebase/messaging')
    return mod
}

export function useFCMToken(): void {
    const userId = useUserStore((state) => state.userId)
    const rol = useUserStore((state) => state.rol)
    const hasRegistered = useRef(false)

    useEffect(() => {
        // Only run for authenticated Comerciantes (role 2) on the client
        if (typeof window === 'undefined') return
        if (!userId || rol !== 2) return
        if (hasRegistered.current) return
        if (!firebaseApp) return

        hasRegistered.current = true

        ;(async () => {
            try {
                const messagingMod = await loadMessaging()
                if (!messagingMod) return

                const { getMessaging, getToken, onMessage } = messagingMod

                // 1. Register the FCM service worker
                const swRegistration = await navigator.serviceWorker.register(
                    '/firebase-messaging-sw.js'
                )

                // 2. Send the Firebase config to the SW so it can initialize
                if (swRegistration.active) {
                    swRegistration.active.postMessage({
                        type: 'INIT_FIREBASE_SW',
                        config: firebaseClientConfig,
                    })
                } else {
                    // Wait for the SW to activate
                    swRegistration.addEventListener('statechange', () => {
                        if (swRegistration.active) {
                            swRegistration.active.postMessage({
                                type: 'INIT_FIREBASE_SW',
                                config: firebaseClientConfig,
                            })
                        }
                    })
                }

                // 3. Request notification permission
                const permission = await Notification.requestPermission()
                if (permission !== 'granted') {
                    console.log('[FCM] Notification permission denied')
                    return
                }

                // 4. Get the FCM token
                const messaging = getMessaging(firebaseApp)
                const vapidKey = import.meta.env.VITE_APP_FIREBASE_VAPID_KEY
                const token = await getToken(messaging, {
                    vapidKey,
                    serviceWorkerRegistration: swRegistration,
                })

                if (!token) {
                    console.warn('[FCM] No token received')
                    return
                }

                console.log('[FCM] Token obtained:', token.substring(0, 20) + '...')

                // 5. Persist the token to Firestore (arrayUnion prevents duplicates)
                await updateUser({
                    userId,
                    role: 2,
                    data: {
                        fcmTokens: arrayUnion(token) as unknown as string[],
                        lastActive: new Date().toISOString(),
                    },
                })

                // 6. Listen for foreground messages
                onMessage(messaging, (payload) => {
                    console.log('[FCM] Foreground message:', payload)
                    // Show a browser notification even in foreground
                    if (payload.notification) {
                        new Notification(
                            payload.notification.title || '¡Nuevo Trabajo!',
                            {
                                body: payload.notification.body || '',
                                icon: '/favicon.ico',
                            }
                        )
                    }
                })
            } catch (err) {
                console.error('[FCM] Registration failed:', err)
            }
        })()
    }, [userId, rol])
}

export default useFCMToken
