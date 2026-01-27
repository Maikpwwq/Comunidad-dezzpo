/**
 * Mensajes (Messages) Page
 *
 * Messaging interface for user communications.
 * Integrates Sendbird chat.
 */

import { SendbirdChat } from '@features/messaging'
import { useAuth } from '@hooks/useAuth'

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// MUI
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const documentProps = {
    title: 'Mensajes | Comunidad Dezzpo',
    description: 'Mensajería en tiempo real con la comunidad Dezzpo.',
}

export default function Page() {
    const { currentUser } = useAuth()

    // If we have a user, show chat. Otherwise show login prompt or empty state.
    // Assuming protected route, user should be logged in.

    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex align-items-start pt-4 pb-4" style={{ height: 'calc(100vh - 100px)' }}>
                <Col className="col-12 h-100">
                    <Typography variant="h4" className="headline-xl mb-3">
                        Mensajes
                    </Typography>

                    <Box sx={{ height: '100%', width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                        {currentUser ? (
                            <SendbirdChat
                                userId={currentUser.userId || ''}
                                userName={currentUser.displayName || 'Usuario'}
                            />
                        ) : (
                            <Box p={3}>
                                <Typography>Cargando chat...</Typography>
                            </Box>
                        )}
                    </Box>
                </Col>
            </Row>
        </Container>
    )
}
