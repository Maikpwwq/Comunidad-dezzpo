import { useState, useCallback, useRef } from 'react'
import {
    checkComercianteNameAvailability,
    checkTiendaNameAvailability,
    type ComercianteDuplicateMatch,
    type TiendaDuplicateMatch,
    type DuplicateCheckResult,
} from '@services/validation/duplicateCheckService'

export type DuplicateCheckType = 'comerciante' | 'tienda'
export type DuplicateCheckStatus = 'idle' | 'checking' | 'available' | 'matches_found'

export interface UseDuplicateNameCheckOptions {
    type: DuplicateCheckType
    excludeId?: string
}

export interface UseDuplicateNameCheckReturn<T> {
    status: DuplicateCheckStatus
    isChecking: boolean
    matches: T[]
    exactMatch: boolean
    checkedValue: string
    handleBlur: (currentValue: string) => Promise<void>
    validateName: (name: string) => Promise<DuplicateCheckResult<T>>
    reset: () => void
}

export function useDuplicateNameCheck<T extends ComercianteDuplicateMatch | TiendaDuplicateMatch>({
    type,
    excludeId,
}: UseDuplicateNameCheckOptions): UseDuplicateNameCheckReturn<T> {
    const [status, setStatus] = useState<DuplicateCheckStatus>('idle')
    const [matches, setMatches] = useState<T[]>([])
    const [exactMatch, setExactMatch] = useState(false)
    const [checkedValue, setCheckedValue] = useState('')
    const [isChecking, setIsChecking] = useState(false)

    // Store last checked value to prevent duplicate queries if value hasn't changed
    const lastCheckedRef = useRef<string>('')

    const validateName = useCallback(
        async (name: string): Promise<DuplicateCheckResult<T>> => {
            const trimmed = name.trim()
            if (!trimmed || trimmed.length < 2) {
                setStatus('idle')
                setMatches([])
                setExactMatch(false)
                setCheckedValue('')
                lastCheckedRef.current = ''
                return { isAvailable: true, exactMatch: false, matches: [] }
            }

            setIsChecking(true)
            setStatus('checking')

            try {
                let result: DuplicateCheckResult<any>
                if (type === 'comerciante') {
                    result = await checkComercianteNameAvailability(trimmed, excludeId)
                } else {
                    result = await checkTiendaNameAvailability(trimmed, excludeId)
                }

                setCheckedValue(trimmed)
                lastCheckedRef.current = trimmed
                setExactMatch(result.exactMatch)
                setMatches(result.matches as T[])

                if (result.matches.length > 0) {
                    setStatus('matches_found')
                } else {
                    setStatus('available')
                }

                return result as DuplicateCheckResult<T>
            } catch (error) {
                console.error('[useDuplicateNameCheck] Error during validation:', error)
                setStatus('idle')
                return { isAvailable: true, exactMatch: false, matches: [] }
            } finally {
                setIsChecking(false)
            }
        },
        [type, excludeId]
    )

    const handleBlur = useCallback(
        async (currentValue: string) => {
            const trimmed = currentValue.trim()
            if (!trimmed || trimmed.length < 2) {
                setStatus('idle')
                setMatches([])
                setExactMatch(false)
                setCheckedValue('')
                lastCheckedRef.current = ''
                return
            }

            // If already checked with the exact same value, avoid redundant network calls
            if (trimmed === lastCheckedRef.current && status !== 'idle') {
                return
            }

            await validateName(trimmed)
        },
        [validateName, status]
    )

    const reset = useCallback(() => {
        setStatus('idle')
        setMatches([])
        setExactMatch(false)
        setCheckedValue('')
        lastCheckedRef.current = ''
        setIsChecking(false)
    }, [])

    return {
        status,
        isChecking,
        matches,
        exactMatch,
        checkedValue,
        handleBlur,
        validateName,
        reset,
    }
}
