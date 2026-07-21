/**
 * Public User Classification & Ranking Matrix Page (/clasificacion-usuarios)
 *
 * Explains how Comerciantes Calificados and Propietarios are categorized, ranked,
 * and awarded badges based on operation size, experience, and membership.
 */

import { Container, Row, Col } from 'react-bootstrap'
import { Box, Typography, Chip, Button } from '@mui/material'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import UserRankingTable from '@components/common/UserRankingTable'
import { navigate } from 'vike/client/router'

export default function Page() {
    return (
        <div className="ranking-page-wrapper">
            {/* Header Hero */}
            <Container fluid className="p-0">
                <Row
                    className="m-0 w-100 p-5 d-flex align-items-center"
                    style={{
                        minHeight: '280px',
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    }}
                >
                    <Col className="text-center">
                        <Chip
                            icon={<WorkspacePremiumIcon sx={{ color: '#38bdf8 !important' }} />}
                            label="Sistema de Reputación y Match Perfecto"
                            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 700, mb: 2 }}
                        />
                        <h1 className="type-hero-title text-blanco text-center mb-2">
                            Clasificación y Niveles de Usuario
                        </h1>
                        <Typography variant="body1" sx={{ color: '#cbd5e1', maxWidth: 720, mx: 'auto' }}>
                            Conoce cómo categorizamos y rankeamos a nuestros Comerciantes Calificados y Propietarios según su escala de operación, trayectoria y fidelidad en la plataforma.
                        </Typography>
                    </Col>
                </Row>
            </Container>

            {/* Matrix Table */}
            <Container className="py-5">
                <UserRankingTable />

                {/* Call to action */}
                <Box sx={{ mt: 8, p: 4, borderRadius: 4, bgcolor: '#0f172a', color: '#ffffff', textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                        ¿Quieres aumentar tu nivel y destacar en Dezzpo?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3, maxWidth: 640, mx: 'auto' }}>
                        Completa tus proyectos a través de la plataforma, solicita inspecciones y obtén valoraciones positivas para desbloquear nuevos rangos e insignias.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate('/nuevo-proyecto')}
                            sx={{ fontWeight: 700, borderRadius: 2.5, px: 3.5, py: 1 }}
                        >
                            Publicar un Proyecto
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', fontWeight: 700, borderRadius: 2.5, px: 3.5, py: 1 }}
                            onClick={() => navigate('/comunidad-comerciantes')}
                        >
                            Registrarme como Comerciante
                        </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    )
}
