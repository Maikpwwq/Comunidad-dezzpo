/**
 * Comentarios Component
 *
 * Comments container with Sendbird integration for profile pages.
 * Migrated from src/app/components/Comentarios.jsx
 *
 * Note: Sendbird provider is currently commented out pending setup.
 */

import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import '@sendbird/uikit-react/dist/index.css'

// Uncomment when ready for Sendbird integration
// import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
// import { ComentarPerfil } from './ComentarPerfil'

export interface ComentariosProps {
    /** Sendbird channel URL */
    channelUrl?: string
    /** User ID for Sendbird */
    userID?: string
    /** User display name */
    nickname?: string
}

export function Comentarios({
    channelUrl,
    // userID,
    // nickname,
}: ComentariosProps): React.ReactElement {
    // Debug log (remove in production)
    if (import.meta.env.DEV && channelUrl) {
        console.log('Comentarios channelUrl:', channelUrl)
    }

    // Sendbird App ID from environment
    // const _appId = import.meta.env.VITE_APP_SENDBIRD_APPID

    return (
        <Container fixed className="p-2">
            <Box
                sx={{ bgcolor: '#cfe8fc' }}
                className="p-4 cardFrame"
            >
                {/* TODO: Uncomment when Sendbird is configured
                <SendbirdProvider
                    appId={appId}
                    userId={userID}
                    nickname={nickname}
                >
                    <ComentarPerfil channelUrl={channelUrl} />
                </SendbirdProvider>
                */}

                {/* Placeholder content */}
                <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                    <p>Sección de comentarios</p>
                    <small>Integración de Sendbird próximamente</small>
                </Box>
            </Box>
        </Container>
    )
}

export default Comentarios
