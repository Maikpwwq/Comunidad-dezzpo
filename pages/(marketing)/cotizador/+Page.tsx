import { Container, Box, Typography, Chip, Grid, Card, CardContent } from '@mui/material'
import CalculateIcon from '@mui/icons-material/Calculate'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { SmartEstimatorWizard } from '@components/common'

export default function CotizadorPage() {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Chip
                    icon={<CalculateIcon style={{ color: '#0d9488' }} />}
                    label="Herramienta Gratuita para Propietarios"
                    sx={{ bgcolor: '#f0fdfa', color: '#0d9488', fontWeight: 600, mb: 2 }}
                />
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1.5, fontSize: { xs: '2rem', md: '2.6rem' } }}>
                    Calcula el Presupuesto de tu Reforma
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Obtén en segundos un rango de precios estimado para mano de obra y materiales en Bogotá. Sin registros obligatorios ni llamadas no deseadas.
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={9} lg={8}>
                    <SmartEstimatorWizard />
                </Grid>
            </Grid>

            {/* Value props */}
            <Grid container spacing={3} sx={{ mt: 6 }}>
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 0 }}>
                            <SpeedIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Precios Actualizados
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Basado en los rendimientos y tarifas unitarias promedio de más de 90 oficios de la construcción en Bogotá.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 0 }}>
                            <SecurityIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Cero Sorpresas
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Entiende el desglose aproximado entre mano de obra y materiales antes de recibir las cotizaciones definitivas.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ p: 2.5, border: '1px solid #e2e8f0', borderRadius: 3, height: '100%' }}>
                        <CardContent sx={{ p: 0 }}>
                            <VerifiedUserIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Contratistas Auditados
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Al solicitar cotización formal, solo profesionales con identidad contrastada y calificaciones reales pueden postularse.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}

