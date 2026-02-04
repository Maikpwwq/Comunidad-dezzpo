import React from 'react'

const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN

/**
 * SendbirdProviderWrapper
 * 
 * SSR-safe wrapper that only loads Sendbird SDK on client-side.
 * Uses a separate inner component to avoid Rules of Hooks violations.
 */
export const SendbirdProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    // SSR or not yet mounted: render children without Sendbird
    if (!isMounted) {
        return <>{children}</>
    }

    // No app ID configured: skip Sendbird entirely
    if (!appId) {
        return <>{children}</>
    }

    // Only render the actual Sendbird component on client after mount
    return <SendbirdClientProvider>{children}</SendbirdClientProvider>
}

/**
 * Inner component that handles Sendbird initialization.
 * This is only rendered on the client, so it's safe to use hooks and lazy imports.
 */
const SendbirdClientProvider = ({ children }: { children: React.ReactNode }) => {
    // Import useAuth here - this component only renders on client
    const [SendbirdProvider, setSendbirdProvider] = React.useState<React.ComponentType<any> | null>(null)
    const [userAuthID, setUserAuthID] = React.useState<string | null>(null)
    const [userAuthName, setUserAuthName] = React.useState<string | null>(null)

    React.useEffect(() => {
        // Dynamically import Sendbird SDK
        Promise.all([
            import('@sendbird/uikit-react/SendbirdProvider'),
            import('@sendbird/uikit-react/dist/index.css'),
        ]).then(([sendbirdModule]) => {
            setSendbirdProvider(() => sendbirdModule.default)
        }).catch(err => {
            console.error('Failed to load Sendbird SDK:', err)
        })

        // Get user from localStorage (Zustand persisted state)
        try {
            const stored = localStorage.getItem('user-storage')
            if (stored) {
                const parsed = JSON.parse(stored)
                if (parsed.state?.userId) {
                    setUserAuthID(parsed.state.userId)
                    setUserAuthName(parsed.state.displayName || '')
                }
            }
        } catch (e) {
            console.warn('Could not read user from localStorage:', e)
        }
    }, [])

    // SDK not loaded yet or no user: just render children
    if (!SendbirdProvider || !userAuthID) {
        return <>{children}</>
    }

    return (
        <SendbirdProvider
            appId={appId!}
            userId={userAuthID}
            nickname={userAuthName || ''}
            accessToken={accessToken}
        >
            {children}
        </SendbirdProvider>
    )
}

export default SendbirdProviderWrapper
