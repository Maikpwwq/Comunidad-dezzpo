/**
 * useAdminGuard Hook
 *
 * Checks Firebase custom claims for admin access.
 * Uses getIdTokenResult() to read claims.admin === true.
 *
 * Usage in admin layout:
 * ```tsx
 * const { isAdmin, isLoading } = useAdminGuard()
 * if (isLoading) return <Spinner />
 * if (!isAdmin) redirect to '/'
 * ```
 */

import { useState, useEffect } from 'react'
import { auth } from '@services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { navigate } from 'vike/client/router'

interface AdminGuardState {
    isAdmin: boolean
    isLoading: boolean
}

export function useAdminGuard(): AdminGuardState {
    const [state, setState] = useState<AdminGuardState>({
        isAdmin: false,
        isLoading: true,
    })

    useEffect(() => {
        if (!auth) {
            setState({ isAdmin: false, isLoading: false })
            navigate('/')
            return
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setState({ isAdmin: false, isLoading: false })
                navigate('/')
                return
            }

            try {
                // Force refresh token to read latest custom claims
                const tokenResult = await user.getIdTokenResult(true)
                const isAdmin = tokenResult.claims.admin === true

                setState({ isAdmin, isLoading: false })
                if (!isAdmin) {
                    navigate('/')
                }
            } catch (error) {
                console.error('Admin guard error:', error)
                setState({ isAdmin: false, isLoading: false })
                navigate('/')
            }
        })

        return () => unsubscribe()
    }, [])

    return state
}

export default useAdminGuard
