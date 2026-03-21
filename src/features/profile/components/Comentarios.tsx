/**
 * Comentarios Component
 *
 * Comments container with Sendbird integration for profile pages.
 * Migrated from src/app/components/Comentarios.jsx
 *
 * Note: Sendbird provider is currently commented out pending setup.
 */

import React from 'react'
import { Box, Container } from '@mui/material'
import clsx from 'clsx'
import styles from './Comentarios.module.scss'
import '@sendbird/uikit-react/dist/index.css'

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { ComentarPerfil } from './ComentarPerfil'

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
    userID,
    nickname,
}: ComentariosProps): React.ReactElement {
    // Debug log (remove in production)
    if (import.meta.env.DEV && channelUrl) {
        console.log('Comentarios channelUrl:', channelUrl)
    }

    // Sendbird App ID from environment
    const appId = import.meta.env.VITE_APP_SENDBIRD_APPID

    return (
        <Container fixed className={clsx(styles.Container)}>
            <Box
                // sx={{ bgcolor: '#cfe8fc' }} // Moved to SCSS
                className={clsx(styles.CommentCard)}
            >
                {!userID ? (
                    <Box className={clsx(styles.Placeholder)} sx={{ p: 4, textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold', color: 'var(--primary-titles-text-color)' }}>Sección de comentarios</p>
                        <small>Debes iniciar sesión para ver y publicar comentarios en este perfil.</small>
                    </Box>
                ) : (
                    <SendbirdProvider
                        appId={appId}
                        userId={userID}
                        nickname={nickname || 'Usuario'}
                    >
                        <ComentarPerfil channelUrl={channelUrl || ''} />
                    </SendbirdProvider>
                )}
            </Box>
        </Container>
    )
}

export default Comentarios
