import React from 'react'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import '@sendbird/uikit-react/dist/index.css'
import { useAuth } from '@hooks/useAuth'

const appId = import.meta.env.VITE_APP_SENDBIRD_APPID
const accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN

export const SendbirdProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth()
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const userAuthID = currentUser?.userId
    const userAuthName = currentUser?.displayName

    if (!appId) {
        console.warn('Sendbird App ID not found in environment variables')
        return <>{children}</>
    }

    if (!isMounted) {
        return <>{children}</>
    }

    return (
        <SendbirdProvider
            appId={appId}
            userId={userAuthID || ''}
            nickname={userAuthName || ''}
            accessToken={accessToken}
        >
            {children}
        </SendbirdProvider>
    )
}
