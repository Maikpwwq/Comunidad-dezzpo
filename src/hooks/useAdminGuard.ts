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
        let cancelled = false

        async function checkAdminClaim() {
            try {
                const user = auth?.currentUser
                if (!user) {
                    if (!cancelled) {
                        setState({ isAdmin: false, isLoading: false })
                        navigate('/')
                    }
                    return
                }

                // Force refresh to pick up latest claims
                const tokenResult = await user.getIdTokenResult(true)
                const isAdmin = tokenResult.claims.admin === true

                if (!cancelled) {
                    setState({ isAdmin, isLoading: false })
                    if (!isAdmin) {
                        navigate('/')
                    }
                }
            } catch (error) {
                console.error('Admin guard error:', error)
                if (!cancelled) {
                    setState({ isAdmin: false, isLoading: false })
                    navigate('/')
                }
            }
        }

        checkAdminClaim()

        return () => {
            cancelled = true
        }
    }, [])

    return state
}

export default useAdminGuard
