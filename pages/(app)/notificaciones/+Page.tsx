/**
 * Notificaciones (Notifications) Page
 *
 * Displays user notifications.
 */

// Bootstrap
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// MUI
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'

export const documentProps = {
    title: 'Notificaciones | Comunidad Dezzpo',
    description: 'Historial de notificaciones de tu cuenta.',
}

export default function Page() {
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex pt-4 pb-4">
                <Col className="col-12">
                    <Typography variant="h4" className="headline-xl mb-4">
                        Notificaciones
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '300px',
                            color: 'text.secondary'
                        }}
                    >
                        <NotificationsNoneIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6">
                            No tienes notificaciones nuevas
                        </Typography>
                        <Typography variant="body2">
                            Te avisaremos cuando haya actualizaciones importantes.
                        </Typography>
                    </Box>
                </Col>
            </Row>
        </Container>
    )
}
