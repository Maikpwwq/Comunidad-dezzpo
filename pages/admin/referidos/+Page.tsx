/**
 * Admin Referral Control Tower
 *
 * Global monitoring of the referral program:
 * - Metrics on conversion, total points awarded, active referrers
 * - Audit table of all referral interactions
 */

import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
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
            <Container fluid className="p-5 text-center">
                <CircularProgress size={40} sx={{ color: '#0f766e' }} />
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Cargando auditoría de referidos...
                </Typography>
            </Container>
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
        <Container fluid className="p-4">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} color="#0f766e" gutterBottom>
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
                    sx={{ color: '#0f766e', borderColor: '#0f766e', borderRadius: 2 }}
                >
                    Actualizar
                </Button>
            </Box>

            {/* KPI Cards */}
            <Row className="g-3 mb-4">
                <Col md={3} sm={6} xs={12}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: '#f0fdfa', borderRadius: 2, color: '#0f766e' }}>
                                <GroupAddIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#0f766e">
                                    {totalInvited}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Invitaciones
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
                                    {totalCompleted}
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
                                    {totalPointsAwarded} pts
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Puntos Entregados
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>

                <Col md={3} sm={6} xs={12}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: '#fdf2f8', borderRadius: 2, color: '#db2777' }}>
                                <VerifiedIcon fontSize="large" />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={800} color="#db2777">
                                    {conversionRate}%
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tasa de Conversión
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Col>
            </Row>

            {/* Filter Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={statusFilter}
                    onChange={(_, val) => setStatusFilter(val)}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label={`Todos (${referrals.length})`} value="all" />
                    <Tab label={`Registrados Pendientes (${referrals.filter((r) => r.status === 'pending').length})`} value="pending" />
                    <Tab label={`Contratos Completados (${referrals.filter((r) => r.status === 'completed').length})`} value="completed" />
                </Tabs>
            </Box>

            {/* Referrals List Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
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
        </Container>
    )
}
