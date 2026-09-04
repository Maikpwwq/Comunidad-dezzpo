/**
 * Admin Referral Control Tower
 *
 * Global monitoring of the referral program:
 * - Metrics on conversion, total points awarded, active referrers
 * - Audit table of all referral interactions
 */

import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Button,
    Tabs,
    Tab,
} from '@mui/material'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarsIcon from '@mui/icons-material/Stars'
import RefreshIcon from '@mui/icons-material/Refresh'
import VerifiedIcon from '@mui/icons-material/Verified'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { useAdminGuard } from '@hooks/useAdminGuard'
import { getAllReferralsForAdmin } from '@services/referralService'
import type { ReferralRecord } from '@services/types'

export default function Page() {
    const { isAdmin, isLoading } = useAdminGuard()
    const [referrals, setReferrals] = useState<ReferralRecord[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')

    const fetchReferrals = async () => {
        setLoading(true)
        try {
            const data = await getAllReferralsForAdmin()
            setReferrals(data)
        } catch (error) {
            console.error('Error fetching admin referrals:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin) {
            fetchReferrals()
        }
    }, [isAdmin])

    if (isLoading || (loading && referrals.length === 0)) {
        return (
            <Box sx={{ p: 5, textAlign: 'center' }}>
                <CircularProgress size={40} sx={{ color: '#0f766e' }} />
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Cargando auditoría de referidos...
                </Typography>
            </Box>
        )
    }

    const filteredList = referrals.filter((ref) => {
        if (statusFilter === 'all') return true
        return ref.status === statusFilter
    })

    const totalInvited = referrals.length
    const totalCompleted = referrals.filter((r) => r.status === 'completed').length
    const totalPointsAwarded = referrals.reduce((sum, r) => sum + (r.pointsEarned || 0), 0)
    const conversionRate = totalInvited > 0 ? Math.round((totalCompleted / totalInvited) * 100) : 0

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        color="#0f766e"
                        sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' } }}
                        gutterBottom
                    >
                        Gestión del Programa de Referidos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitoreo global de invitaciones, relaciones voz a voz y distribución de puntos.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchReferrals}
                    size="small"
                    sx={{ color: '#0f766e', borderColor: '#0f766e', borderRadius: 2, px: 2, flexShrink: 0 }}
                >
                    Actualizar
                </Button>
            </Box>

            {/* KPI Cards Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 2.5 } }}>
                        <Box sx={{ p: 1.5, bgcolor: '#f0fdfa', borderRadius: 2, color: '#0f766e', display: 'flex' }}>
                            <GroupAddIcon fontSize="medium" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h5" fontWeight={800} color="#0f766e" sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' } }}>
                                {totalInvited}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                Total Invitaciones
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 2.5 } }}>
                        <Box sx={{ p: 1.5, bgcolor: '#ecfdf5', borderRadius: 2, color: '#059669', display: 'flex' }}>
                            <CheckCircleIcon fontSize="medium" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h5" fontWeight={800} color="#059669" sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' } }}>
                                {totalCompleted}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                Referidos Activos
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 2.5 } }}>
                        <Box sx={{ p: 1.5, bgcolor: '#fffbeb', borderRadius: 2, color: '#d97706', display: 'flex' }}>
                            <StarsIcon fontSize="medium" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h5" fontWeight={800} color="#d97706" sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' } }}>
                                {totalPointsAwarded} pts
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                Puntos Entregados
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: { xs: 2, sm: 2.5 } }}>
                        <Box sx={{ p: 1.5, bgcolor: '#fdf2f8', borderRadius: 2, color: '#db2777', display: 'flex' }}>
                            <VerifiedIcon fontSize="medium" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h5" fontWeight={800} color="#db2777" sx={{ fontSize: { xs: '1.4rem', sm: '1.6rem' } }}>
                                {conversionRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                Tasa de Conversión
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Filter Tabs (Scrollable for mobile) */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={statusFilter}
                    onChange={(_, val) => setStatusFilter(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        '& .MuiTab-root': {
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 48,
                        },
                    }}
                >
                    <Tab label={`Todos (${referrals.length})`} value="all" />
                    <Tab label={`Pendientes (${referrals.filter((r) => r.status === 'pending').length})`} value="pending" />
                    <Tab label={`Completados (${referrals.filter((r) => r.status === 'completed').length})`} value="completed" />
                </Tabs>
            </Box>

            {/* MOBILE CARD VIEW (< md) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                {filteredList.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">
                            No hay registros de referidos para el filtro seleccionado.
                        </Typography>
                    </Paper>
                ) : (
                    filteredList.map((ref) => (
                        <Card
                            key={ref.referralId || ref.createdAt}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: 'none',
                                overflow: 'hidden',
                            }}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={ref.refCodeUsed}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 800, fontSize: '0.72rem', height: 22 }}
                                        />
                                        <Chip
                                            label={ref.status === 'completed' ? 'Completado' : 'Pendiente'}
                                            color={ref.status === 'completed' ? 'success' : 'default'}
                                            size="small"
                                            sx={{ fontWeight: 700, fontSize: '0.72rem', height: 22 }}
                                        />
                                    </Box>
                                    <Typography variant="caption" fontWeight={800} sx={{ color: '#0f766e', fontSize: '0.85rem' }}>
                                        +{ref.pointsEarned} pts
                                    </Typography>
                                </Box>

                                {/* Referrer -> Referred flow */}
                                <Box
                                    sx={{
                                        p: 1.25,
                                        bgcolor: 'background.default',
                                        borderRadius: 2,
                                        mb: 1.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Referente
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700} noWrap>
                                            {ref.referrerName || 'Desconocido'}
                                        </Typography>
                                    </Box>

                                    <ArrowForwardIcon sx={{ color: 'text.disabled', fontSize: 16, flexShrink: 0 }} />

                                    <Box sx={{ minWidth: 0, textAlign: 'right' }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Amigo
                                        </Typography>
                                        <Typography variant="body2" fontWeight={700} noWrap>
                                            {ref.referredUserName || 'Invitado'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip
                                        label={ref.referredUserRole === 2 ? 'Comerciante' : 'Propietario'}
                                        size="small"
                                        color={ref.referredUserRole === 2 ? 'primary' : 'secondary'}
                                        variant="outlined"
                                        sx={{ height: 22, fontSize: '0.7rem' }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(ref.createdAt).toLocaleDateString('es-CO', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            {/* DESKTOP TABLE VIEW (>= md) */}
            <TableContainer
                component={Paper}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    borderRadius: 3,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Referente (Quien Invitó)</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Código Usado</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Amigo Referido</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Rol Referido</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Fecha Registro</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Puntos Otorgados</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No hay registros de referidos para el filtro seleccionado.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredList.map((ref) => (
                                <TableRow key={ref.referralId || ref.createdAt} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{ref.referrerName}</TableCell>
                                    <TableCell>
                                        <Chip label={ref.refCodeUsed} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                                    </TableCell>
                                    <TableCell>{ref.referredUserName}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={ref.referredUserRole === 2 ? 'Comerciante' : 'Propietario'}
                                            size="small"
                                            color={ref.referredUserRole === 2 ? 'primary' : 'secondary'}
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
                                            label={ref.status === 'completed' ? 'Contrato Completado' : 'Registrado'}
                                            color={ref.status === 'completed' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: '#0f766e' }}>
                                        +{ref.pointsEarned} pts
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
