/**
 * Invitar Amigos (Referral Program) Dashboard
 *
 * Full-featured gamified referral center:
 * - Unique referral code generator & copyable invite link
 * - Direct social sharing buttons (WhatsApp, Facebook, Email)
 * - Metrics KPIs (Total Invited, Active, Points Balance, Total Earned)
 * - Rewards redemption catalog with points deduction
 * - Audit table of referred users and status
 */

import { useState, useEffect, useCallback } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import EmailIcon from '@mui/icons-material/Email'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarsIcon from '@mui/icons-material/Stars'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import VerifiedIcon from '@mui/icons-material/Verified'

import { useUserStore } from '@stores/userStore'
import {
    getReferralSummary,
    redeemReward,
} from '@services/referralService'
import { REWARD_CATALOG } from '@config/referrals.config'
import type { ReferralRecord } from '@services/types'

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)


    const [referralCode, setReferralCode] = useState<string>('')
    const [stats, setStats] = useState({
        totalInvited: 0,
        activeReferrals: 0,
        pointsBalance: 0,
        totalPointsEarned: 0,
    })
    const [referralsList, setReferralsList] = useState<ReferralRecord[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [copySuccess, setCopySuccess] = useState<boolean>(false)

    const [redeemModal, setRedeemModal] = useState<{
        open: boolean
        reward: (typeof REWARD_CATALOG)[number] | null
        couponCode: string
    }>({ open: false, reward: null, couponCode: '' })

    const [isRedeeming, setIsRedeeming] = useState<boolean>(false)
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error' | 'info'
    }>({ open: false, message: '', severity: 'info' })

    const loadData = useCallback(async () => {
        if (!currentUserId) {
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            const data = await getReferralSummary(currentUserId)
            setReferralCode(data.referralCode)
            setStats(data.stats)
            setReferralsList(data.referralsList)
        } catch (error) {
            console.error('Error loading referral summary:', error)
        } finally {
            setLoading(false)
        }
    }, [currentUserId])

    useEffect(() => {
        loadData()
    }, [loadData])

    const referralUrl = typeof window !== 'undefined' && referralCode
        ? `${window.location.origin}/ingreso?ref=${referralCode}`
        : `https://comunidad-dezzpo.vercel.app/ingreso?ref=${referralCode}`

    const shareText = `¡Hola! Te invito a unirte a Comunidad Dezzpo, la red profesional para mantenimiento, remodelaciones y servicios del hogar en Colombia. Regístrate usando mi enlace de recomendación: ${referralUrl}`

    const handleCopyLink = () => {
        if (!referralUrl) return
        navigator.clipboard.writeText(referralUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 3000)
    }

    const handleRedeem = async (reward: (typeof REWARD_CATALOG)[number]) => {
        if (!currentUserId) return
        setIsRedeeming(true)
        try {
            const res = await redeemReward(currentUserId, reward.id)
            if (res.success && res.couponCode) {
                setRedeemModal({
                    open: true,
                    reward,
                    couponCode: res.couponCode,
                })
                loadData()
            } else {
                setSnackbar({
                    open: true,
                    message: res.message,
                    severity: 'error',
                })
            }
        } catch (error) {
            console.error('Error during reward redemption:', error)
            setSnackbar({
                open: true,
                message: 'Ocurrió un error inesperado al canjear la recompensa.',
                severity: 'error',
            })
        } finally {
            setIsRedeeming(false)
        }
    }

    if (loading) {
        return (
            <Container fluid className="p-5 text-center">
                <CircularProgress size={40} sx={{ color: '#0f766e' }} />
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Cargando tu programa de referidos...
                </Typography>
            </Container>
        )
    }

    return (
        <Container fluid className="p-4">
            {/* Header Title */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={800} color="#0f766e" gutterBottom>
                    Programa de Referidos "Voz a Voz"
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
                    Recomienda la Comunidad Dezzpo a propietarios y contratistas. Gana <strong>50 Puntos Dezzpo</strong> por cada amigo que se registre y <strong>200 Puntos</strong> cuando completen su primer contrato o proyecto.
                </Typography>
            </Box>

            {/* Main Invite Card */}
            <Card
                sx={{
                    mb: 5,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                    color: '#fff',
                    boxShadow: '0 12px 30px rgba(15, 118, 110, 0.2)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Row className="align-items-center">
                        <Col md={7} xs={12} className="mb-3 mb-md-0">
                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, opacity: 0.9 }}>
                                Tu Código Único de Referido
                            </Typography>
                            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: 2, my: 1 }}>
                                {referralCode || 'GENERANDO...'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                Comparte este enlace con tus contactos para acumular beneficios acumulables.
                            </Typography>
                        </Col>

                        <Col md={5} xs={12} className="text-md-end text-center">
                            <Tooltip title={copySuccess ? '¡Enlace copiado!' : 'Copiar enlace al portapapeles'}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={handleCopyLink}
                                    sx={{
                                        bgcolor: '#fff',
                                        color: '#0f766e',
                                        fontWeight: 700,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 3,
                                        '&:hover': { bgcolor: '#f0fdfa' },
                                    }}
                                >
                                    {copySuccess ? '¡Copiado!' : 'Copiar tu Enlace'}
                                </Button>
                            </Tooltip>

                            {/* Social Share Buttons */}
                            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'center', md: 'flex-end' }, mt: 2.5 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<WhatsAppIcon />}
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                                    target="_blank"
                                    sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 2 }}
                                >
                                    WhatsApp
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<FacebookIcon />}
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`}
                                    target="_blank"
                                    sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 2 }}
                                >
                                    Facebook
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EmailIcon />}
                                    href={`mailto:?subject=${encodeURIComponent('Te invito a Comunidad Dezzpo')}&body=${encodeURIComponent(shareText)}`}
                                    sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 2 }}
                                >
                                    Email
                                </Button>
                            </Box>
                        </Col>
                    </Row>
                </CardContent>
            </Card>

            {/* Metrics KPIs */}
            <Row className="g-3 mb-5">
                <Col md={3} sm={6} xs={12}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: '#f0fdfa', borderRadius: 2, color: '#0f766e' }}>
                                <GroupAddIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#0f766e">
                                    {stats.totalInvited}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Amigos Invitados
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>

                <Col md={3} sm={6} xs={12}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: '#ecfdf5', borderRadius: 2, color: '#059669' }}>
                                <CheckCircleIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#059669">
                                    {stats.activeReferrals}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Referidos Activos
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>

                <Col md={3} sm={6} xs={12}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: '#fffbeb', borderRadius: 2, color: '#d97706' }}>
                                <StarsIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#d97706">
                                    {stats.pointsBalance} pts
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Puntos Disponibles
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>

                <Col md={3} sm={6} xs={12}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: '#fdf2f8', borderRadius: 2, color: '#db2777' }}>
                                <CardGiftcardIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#db2777">
                                    {stats.totalPointsEarned} pts
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Ganados
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>
            </Row>

            {/* Catalog of Rewards */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="h5" fontWeight={700} color="#0f766e" sx={{ mb: 2 }}>
                    Catálogo de Recompensas y Canje de Puntos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Utiliza tus puntos acumulados para obtener descuentos directos en membresías, certificaciones o inspecciones.
                </Typography>

                <Row className="g-4">
                    {REWARD_CATALOG.map((reward) => {
                        const canAfford = stats.pointsBalance >= reward.pointsCost
                        return (
                            <Col key={reward.id} md={6} lg={3} xs={12}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: canAfford ? '#0d9488' : 'divider',
                                        boxShadow: canAfford ? '0 4px 20px rgba(13,148,136,0.1)' : 'none',
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                            <Chip
                                                label={`${reward.pointsCost} Puntos`}
                                                sx={{
                                                    bgcolor: canAfford ? '#f0fdfa' : '#f3f4f6',
                                                    color: canAfford ? '#0f766e' : '#6b7280',
                                                    fontWeight: 700,
                                                }}
                                                size="small"
                                            />
                                            <Chip
                                                label={reward.targetRole === 2 ? 'Comerciante' : 'Propietario'}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1rem', mb: 1 }}>
                                            {reward.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {reward.description}
                                        </Typography>
                                    </CardContent>

                                    <Box sx={{ p: 3, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            disabled={!canAfford || isRedeeming}
                                            onClick={() => handleRedeem(reward)}
                                            sx={{
                                                borderRadius: 2,
                                                bgcolor: '#0f766e',
                                                '&:hover': { bgcolor: '#0d9488' },
                                            }}
                                        >
                                            {canAfford ? 'Canjear Puntos' : `Faltan ${reward.pointsCost - stats.pointsBalance} pts`}
                                        </Button>
                                    </Box>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Box>

            {/* Referrals Activity Table */}
            <Box>
                <Typography variant="h5" fontWeight={700} color="#0f766e" sx={{ mb: 2 }}>
                    Historial de Amigos Referidos
                </Typography>

                {referralsList.length === 0 ? (
                    <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #cbd5e1', boxShadow: 'none' }}>
                        <Typography variant="body1" color="text.secondary">
                            Aún no has registrado referidos. ¡Copia tu enlace y comienza a invitar a tus contactos!
                        </Typography>
                    </Card>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Amigo Referido</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Tipo de Usuario</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Fecha Registro</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Puntos Otorgados</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {referralsList.map((ref) => (
                                    <TableRow key={ref.referralId || ref.createdAt} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            {ref.referredUserName}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={ref.referredUserRole === 2 ? 'Comerciante' : 'Propietario'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(ref.createdAt).toLocaleDateString('es-CO', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                {...(ref.status === 'completed' ? { icon: <VerifiedIcon /> } : {})}
                                                label={ref.status === 'completed' ? 'Primer Contrato completado' : 'Registrado (Pendiente contrato)'}
                                                color={ref.status === 'completed' ? 'success' : 'default'}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />

                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800, color: '#0f766e' }}>
                                            +{ref.pointsEarned} pts
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>

            {/* Redemption Success Dialog */}
            <Dialog open={redeemModal.open} onClose={() => setRedeemModal({ open: false, reward: null, couponCode: '' })}>
                <DialogTitle sx={{ fontWeight: 700, color: '#0f766e' }}>
                    ¡Recompensa Canjeada Exitosamente!
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Has canjeado <strong>{redeemModal.reward?.name}</strong>.
                    </Typography>
                    <Box sx={{ p: 3, bgcolor: '#f0fdfa', border: '1px dashed #0d9488', borderRadius: 3, textAlign: 'center', my: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            CÓDIGO DE CUPÓN DEZZPO:
                        </Typography>
                        <Typography variant="h4" fontWeight={900} color="#0f766e" sx={{ letterSpacing: 2, mt: 1 }}>
                            {redeemModal.couponCode}
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Ingresa este código al momento de realizar la suscripción o agendar tu certificación para aplicar tu beneficio.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button variant="contained" onClick={() => setRedeemModal({ open: false, reward: null, couponCode: '' })} sx={{ bgcolor: '#0f766e' }}>
                        Entendido
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    )
}
