import React from 'react'
import { useAuth } from '@hooks/useAuth'

const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN

// Lazy load SendbirdProvider only on client side to avoid SSR crash
const SendbirdProvider = React.lazy(() =>
    import('@sendbird/uikit-react/SendbirdProvider')
)

export const SendbirdProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        // Import CSS only on client side
        import('@sendbird/uikit-react/dist/index.css')
        setIsMounted(true)
    }, [])

    // SSR: Return children without Sendbird
    if (typeof window === 'undefined' || !isMounted) {
        return <>{children}</>
    }

    // No app ID configured
    if (!appId) {
        console.warn('Sendbird App ID not found in environment variables')
        return <>{children}</>
    }

    // Get user after mount check (useAuth requires UserAuthContext)
    const { currentUser } = useAuth()
    const userAuthID = currentUser?.userId
    const userAuthName = currentUser?.displayName

    // Guest users: skip Sendbird
    if (!userAuthID) {
        return <>{children}</>
    }

    return (
        <React.Suspense fallback={<>{children}</>}>
            <SendbirdProvider
                appId={appId}
                userId={userAuthID}
                nickname={userAuthName || ''}
                accessToken={accessToken}
            >
                {children}
            </SendbirdProvider>
        </React.Suspense>
    )
}

