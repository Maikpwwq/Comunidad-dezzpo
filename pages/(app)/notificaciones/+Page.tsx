/**
 * Notificaciones (Notifications) Page
 *
 * Displays user notifications.
 */
// Bootstrap
import { Container, Row, Col } from 'react-bootstrap'
// MUI
import { Typography, Box } from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
export default function Page() {
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex pt-4 pb-4">
                <Col className="col-12">
                    <h1 className="type-hero-title mb-4">
                        Notificaciones
                    </h1>
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
                        <Typography className="headline-s">
                            No tienes notificaciones nuevas
                        </Typography>
                        <Typography className="body-2">
                            Te avisaremos cuando haya actualizaciones importantes.
                        </Typography>
                    </Box>
                </Col>
            </Row>
        </Container>
    )
}
