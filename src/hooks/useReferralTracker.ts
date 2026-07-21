import { useEffect } from 'react'

const STORAGE_KEY = 'dezzpo_ref_code'

/**
 * Hook to capture referral code from URL parameters (?ref=CODIGO)
 * and persist it in sessionStorage for user registration attribution.
 */
export function useReferralTracker(): void {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const params = new URLSearchParams(window.location.search)
        const refParam = params.get('ref') || params.get('referralCode') || params.get('referral')

        if (refParam) {
            const cleanCode = refParam.trim().toUpperCase()
            sessionStorage.setItem(STORAGE_KEY, cleanCode)
        }
    }, [])
}

/**
 * Reads the stored referral code from sessionStorage if present.
 */
export function getStoredReferralCode(): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(STORAGE_KEY)
}

/**
 * Clears the stored referral code after attribution.
 */
export function clearStoredReferralCode(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(STORAGE_KEY)
}
