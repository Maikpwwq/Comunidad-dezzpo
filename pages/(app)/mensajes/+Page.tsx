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
import { Container, Row, Col } from 'react-bootstrap'
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
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex align-items-start pt-4 pb-4" style={{ height: 'calc(100vh - 100px)' }}>
                <Col className="col-12 h-100">
                    <h1 className="type-hero-title mb-3">
                        Mensajes
                    </h1>
                    <Box sx={{ height: '100%', width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                        {currentUser ? (
                            <MessagingDashboard initialChannelUrl={channelUrl} />
                        ) : (
                            <Box p={3}>
                                <Typography className="body-1">Cargando chat...</Typography>
                            </Box>
                        )}
                    </Box>
                </Col>
            </Row>
        </Container>
    )
}
