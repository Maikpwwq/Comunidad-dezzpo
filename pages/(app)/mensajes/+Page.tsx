/**
 * Mensajes (Messages) Page
 *
 * Messaging interface for user communications.
 * Integrates Sendbird chat.
 */
import { useState, useEffect } from 'react'
import { MessagingDashboard } from '@features/messaging'
import { useAuth } from '@hooks/useAuth'
// Bootstrap
import { Container } from 'react-bootstrap'
// MUI
import { Typography, Box } from '@mui/material'

export default function Page() {
    const { currentUser } = useAuth()
    const [channelUrl, setChannelUrl] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const queryParams = new URLSearchParams(window.location.search)
            const channel = queryParams.get('channel')
            if (channel) setChannelUrl(channel)
        }
    }, [])

    return (
        <Container fluid className="p-0" style={{ height: '100%' }}>
            <Box
                sx={{
                    width: '100%',
                    height: { xs: 'calc(100dvh - 70px)', md: 'calc(100dvh - 96px)' },
                    px: { xs: 1, sm: 2, md: 3 },
                    py: { xs: 1, md: 2 },
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                }}
            >
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <h1 className="type-hero-title m-0" style={{ fontSize: '1.75rem' }}>
                        Mensajes
                    </h1>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        width: '100%',
                        border: '1px solid #e2e8f0',
                        borderRadius: { xs: '12px', md: '16px' },
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    }}
                >
                    {currentUser ? (
                        <MessagingDashboard initialChannelUrl={channelUrl} />
                    ) : (
                        <Box p={3} display="flex" alignItems="center" justifyContent="center" height="100%">
                            <Typography className="body-1" color="text.secondary">
                                Cargando chat...
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    )
}

