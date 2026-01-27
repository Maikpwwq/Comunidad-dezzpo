/**
 * SendbirdChat Component
 *
 * Main Sendbird chat integration component.
 * Migrated from src/app/components/SendbirdDefaultChat.jsx
 */

import React from 'react'
import { App as SendBirdApp } from '@sendbird/uikit-react'
import '@sendbird/uikit-react/dist/index.css'

const accessToken = import.meta.env.VITE_APP_SENDBIRD_APPTOKEN
const appId = import.meta.env.VITE_APP_SENDBIRD_APPID

export interface SendbirdChatProps {
    /** User ID for Sendbird */
    userId?: string
    /** User display name */
    userName?: string
    /** Channel URL to open (reserved for future use) */
    channelUrl?: string
}

/**
 * Sendbird chat wrapper component
 * User will be created automatically if not present in Sendbird server
 */
export function SendbirdChat({
    userId = '',
    userName = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    channelUrl: _channelUrl,
}: SendbirdChatProps): React.ReactElement {
    if (!appId) {
        console.warn('Sendbird appId not configured')
        return <div>Chat configuration missing</div>
    }

    return (
        <SendBirdApp
            appId={appId}
            userId={userId}
            nickname={userName}
            accessToken={accessToken}
        />
    )
}

export default SendbirdChat
