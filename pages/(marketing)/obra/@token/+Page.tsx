import React, { useState, useEffect } from 'react'
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    LinearProgress,
    Stack,
    CircularProgress,
    Divider,
} from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ConstructionIcon from '@mui/icons-material/Construction'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ShareIcon from '@mui/icons-material/Share'
import { usePageContext } from '@hooks/usePageContext'
import {
    getDailyLogsByContract,
    getMilestonesByContract,
    calculateMilestoneProgress,
    type ContractDailyLog,
    type ContractMilestone,
} from '@services/contracts'
import { navigate } from 'vike/client/router'

export default function ObraPublicPage() {
    const pageContext = usePageContext()
    const token = pageContext.routeParams?.token as string | undefined

    const [logs, setLogs] = useState<ContractDailyLog[]>([])
    const [milestones, setMilestones] = useState<ContractMilestone[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Token shape is `${contractIdPrefix}-${hex}` or direct contractId
    const contractIdPrefix = token?.split('-')[0] || ''

    useEffect(() => {
        let isMounted = true
        async function fetchPublicProgress() {
            if (!token) return
            setIsLoading(true)
            try {
                // Fetch public logs and milestones
                // If token contains full or partial ID, attempt to read contract logs
                const contractId = token.length > 20 ? token : token.split('-')[0]
                const [lRes, mRes] = await Promise.all([
                    getDailyLogsByContract(contractId),
                    getMilestonesByContract(contractId),
                ])

                if (isMounted) {
                    if (lRes.success && lRes.data) {
                        setLogs(lRes.data.filter((l) => l.isPublicForShare))
                    }
                    if (mRes.success && mRes.data) {
                        setMilestones(mRes.data)
                    }
                }
            } catch (err) {
                console.warn('[ObraPublic] Error loading:', err)
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        fetchPublicProgress()
        return () => {
            isMounted = false
        }
    }, [token])

    const progress = calculateMilestoneProgress(milestones)

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Avance de Obra en Vivo · Comunidad Dezzpo',
                text: 'Revisa la bitácora visual y el progreso en tiempo real de este proyecto.',
                url: window.location.href,
            }).catch(() => {})
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            alert('Enlace copiado al portapapeles.')
        }
    }

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress size={36} color="primary" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Cargando bitácora de obra en tiempo real...
                </Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            {/* Header banner */}
            <Box
                sx={{
                    bgcolor: '#0f172a',
                    color: 'white',
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    mb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                        icon={<VerifiedUserIcon style={{ color: '#0d9488' }} />}
                        label="Obra Certificada por Comunidad Dezzpo"
                        sx={{ bgcolor: 'rgba(13, 148, 136, 0.15)', color: '#2dd4bf', fontWeight: 600, fontSize: '0.75rem' }}
                    />
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        onClick={handleShare}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', borderRadius: 2 }}
                    >
                        Compartir
                    </Button>
                </Box>

                <Typography variant="h4" fontWeight="bold">
                    Bitácora de Obra en Tiempo Real
                </Typography>

                <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 600 }}>
                    Sigue las entregas parciales, actas de recibo a satisfacción bilaterales y el avance fotográfico diario respaldado por tecnología Dezzpo.
                </Typography>

                {milestones.length > 0 && (
                    <Box sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                Progreso General: <strong>{progress.completedCount} de {progress.totalCount} hitos aprobados</strong>
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" sx={{ color: '#2dd4bf' }}>
                                {progress.progressPercentage}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress.progressPercentage}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#0d9488' } }}
                        />
                    </Box>
                )}
            </Box>

            {/* Milestones Overview */}
            {milestones.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ConstructionIcon color="primary" /> Hitos del Contrato
                    </Typography>
                    <Stack spacing={1.5}>
                        {milestones.map((m) => {
                            const isApproved = m.status === 'approved' || m.status === 'paid'
                            return (
                                <Box
                                    key={m.milestoneId}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: isApproved ? '#bbf7d0' : '#e2e8f0',
                                        borderRadius: 2,
                                        bgcolor: isApproved ? '#f0fdf4' : '#ffffff',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {m.order}. {m.title}
                                        </Typography>
                                        {m.description && (
                                            <Typography variant="caption" color="text.secondary">
                                                {m.description}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Chip
                                        icon={isApproved ? <CheckCircleIcon style={{ fontSize: 14 }} /> : undefined}
                                        label={isApproved ? 'Aprobado' : `${m.percentage}%`}
                                        size="small"
                                        color={isApproved ? 'success' : 'default'}
                                        sx={{ fontWeight: 600, fontSize: '0.72rem' }}
                                    />
                                </Box>
                            )
                        })}
                    </Stack>
                </Box>
            )}

            {/* Daily visual progress feed */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Avances Fotográficos Verificados ({logs.length})
            </Typography>

            {logs.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center', border: '1px dashed #cbd5e1', borderRadius: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                        Aún no hay fotos públicas publicadas en este avance de obra.
                    </Typography>
                </Card>
            ) : (
                <Stack spacing={3}>
                    {logs.map((log) => (
                        <Card key={log.logId} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                            {log.photos && log.photos.length > 0 && (
                                <Box sx={{ display: 'grid', gridTemplateColumns: log.photos.length > 1 ? '1fr 1fr' : '1fr', gap: 1, bgcolor: '#0f172a' }}>
                                    {log.photos.map((photoUrl, idx) => (
                                        <Box
                                            key={idx}
                                            component="img"
                                            src={photoUrl}
                                            alt={`Foto de avance ${idx + 1}`}
                                            sx={{ width: '100%', height: 260, objectFit: 'cover' }}
                                        />
                                    ))}
                                </Box>
                            )}
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                    {new Date(log.createdAt).toLocaleDateString('es-CO', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Typography>
                                <Typography variant="body1">
                                    {log.notes}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            <Divider sx={{ my: 5 }} />

            {/* Conversion CTA */}
            <Box
                sx={{
                    textAlign: 'center',
                    p: { xs: 3, md: 4 },
                    bgcolor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#166534', mb: 1 }}>
                    ¿Pensando en remodelar tu hogar o edificio?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                    En Comunidad Dezzpo cuentas con cotizaciones gratuitas, contratistas certificados y control de pagos por hitos de entrega.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={() => navigate('/nuevo-proyecto')}
                    sx={{
                        bgcolor: '#0d9488',
                        '&:hover': { bgcolor: '#0f766e' },
                        fontWeight: 'bold',
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                    }}
                >
                    Cotizar mi Proyecto Gratis
                </Button>
            </Box>
        </Container>
    )
}
