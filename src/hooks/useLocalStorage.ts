/**
 * useLocalStorage Hook
 *
 * Provides type-safe localStorage access with automatic JSON serialization,
 * SSR safety, and React state synchronization.
 *
 * @example
 * ```tsx
 * const [role, setRole] = useLocalStorage<number>('role', 0)
 * const [user, setUser] = useLocalStorage<User | null>('user', null)
 * ```
 */

import { useState, useCallback, useEffect } from 'react'

/**
 * Hook for managing localStorage with React state synchronization
 *
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // Get initial value from localStorage or use default
    const getStoredValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue
        }

        try {
            const item = window.localStorage.getItem(key)
            return item ? (JSON.parse(item) as T) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error)
            return initialValue
        }
    }, [key, initialValue])

    const [storedValue, setStoredValue] = useState<T>(getStoredValue)

    // Update localStorage when value changes
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value
                setStoredValue(valueToStore)

                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore))
                }
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error)
            }
        },
        [key, storedValue]
    )

    // Remove item from localStorage
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue)
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key)
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error)
        }
    }, [key, initialValue])

    // Sync with other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue) as T)
                } catch {
                    // Ignore parse errors
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [key])

    return [storedValue, setValue, removeValue]
}

export default useLocalStorage
