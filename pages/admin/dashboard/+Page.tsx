/**
 * Admin Dashboard — Executive Command Center
 *
 * High-density executive analytics dashboard with KPI cards, multi-stream funding model stats,
 * skill certification queue metrics, referral program (Voz a Voz) performance,
 * and role-adaptive user classification (Category, Classification, Grade).
 */
import React, { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    Skeleton,
    Chip,
    Tabs,
    Tab,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CategoryIcon from '@mui/icons-material/Category'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import HandshakeIcon from '@mui/icons-material/Handshake'
import ShareIcon from '@mui/icons-material/Share'
import ShieldIcon from '@mui/icons-material/Shield'

import {
    Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

import {
    getAdminStats,
    getContractStats,
    getFunnelMetrics,
    getGeographicDensity,
    getCertificationDashboardStats,
    getReferralDashboardStats,
    getUserClassificationBreakdown,
    getMultiStreamMonetization,
    getSocialInterceptorStats,
    subscribeToSocialInterceptions,
    type AdminStats,
    type ContractStats,
    type FunnelMetric,
    type ZoneDensity,
    type CertificationDashboardStats,
    type ReferralDashboardStats,
    type UserClassificationBreakdown,
    type MultiStreamMonetizationStats,
    type SocialInterceptorStats,
} from '@services/admin'

import { PRICING } from '@config/pricing.config'

function formatCurrency(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export default function Page() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [contracts, setContracts] = useState<ContractStats | null>(null)
    const [funnel, setFunnel] = useState<FunnelMetric[]>([])
    const [zones, setZones] = useState<ZoneDensity[]>([])
    const [certifications, setCertifications] = useState<CertificationDashboardStats | null>(null)
    const [referrals, setReferrals] = useState<ReferralDashboardStats | null>(null)
    const [classificationBreakdown, setClassificationBreakdown] = useState<UserClassificationBreakdown | null>(null)
    const [monetizationStreams, setMonetizationStreams] = useState<MultiStreamMonetizationStats | null>(null)
    const [socialStats, setSocialStats] = useState<SocialInterceptorStats | null>(null)
    const [loading, setLoading] = useState(true)

    // Filter tab for User Classification breakdown (categories, classifications, grades)
    const [classificationTab, setClassificationTab] = useState<'clasificacion' | 'categoria' | 'grado'>('clasificacion')

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const [s, c, f, z, cert, ref, cls, mon, soc] = await Promise.all([
                    getAdminStats(),
                    getContractStats(),
                    getFunnelMetrics(),
                    getGeographicDensity(),
                    getCertificationDashboardStats(),
                    getReferralDashboardStats(),
                    getUserClassificationBreakdown(),
                    getMultiStreamMonetization(),
                    getSocialInterceptorStats(),
                ])
                setStats(s)
                setContracts(c)
                setFunnel(f)
                setZones(z)
                setCertifications(cert)
                setReferrals(ref)
                setClassificationBreakdown(cls)
                setMonetizationStreams(mon)
                setSocialStats(soc)
            } catch (err) {
                console.error('Error loading admin dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    // Real-time Firestore subscription for Social Interceptions (SSR-safe with unmount cleanup)
    useEffect(() => {
        if (typeof window === 'undefined') return
        const unsubscribe = subscribeToSocialInterceptions((liveStats) => {
            setSocialStats(liveStats)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    const contractData = contracts
        ? [
            { name: 'Activos', value: contracts.active, fill: '#00897b' },
            { name: 'Completados', value: contracts.completed, fill: '#4caf50' },
            { name: 'Disputados', value: contracts.disputed, fill: '#f44336' },
        ]
        : []

    // Monetization funding streams chart data
    const fundingStreamsData = monetizationStreams
        ? [
            { name: 'Membresías Comerciantes', value: monetizationStreams.comerciantesMembershipPotential, fill: '#00897b' },
            { name: 'Certificaciones Técnicas', value: monetizationStreams.certificationsApprovedRevenue, fill: '#9c27b0' },
            { name: 'Contratos & Anticipos (ePayco)', value: monetizationStreams.contractEscrowVolume, fill: '#ff9800' },
            { name: 'Tarifas de Plataforma (10%)', value: monetizationStreams.platformFeeRevenue, fill: '#4caf50' },
        ]
        : []

    // Current classification breakdown list based on active tab
    const activeClassificationList = classificationBreakdown
        ? classificationTab === 'clasificacion'
            ? classificationBreakdown.classifications
            : classificationTab === 'categoria'
            ? classificationBreakdown.categories
            : classificationBreakdown.grades
        : []

    return (
        <Box sx={{ pb: 6 }}>
            {/* Header */}
            <Box sx={{ mb: { xs: 2.5, sm: 4 } }}>
                <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#0f172a"
                    gutterBottom
                    sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' }, letterSpacing: '-0.02em' }}
                >
                    Centro de Control Ejecutivo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Monitoreo en tiempo real del modelo de negocios, desempeño de la comunidad, conversiones y flujo de caja.
                </Typography>
            </Box>

            {/* ── 1. GLOBAL PILLAR KPIS ────────────────────────────────────────────── */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.05rem', sm: '1.25rem' }, flexWrap: 'wrap' }}>
                <PeopleIcon sx={{ color: 'var(--brand-teal, #00897b)' }} /> Métricas Principales de la Comunidad
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: { xs: 1.5, sm: 2, md: 2.5 },
                    mb: { xs: 3, sm: 4 },
                }}
            >
                <KPICard
                    title="Total Usuarios"
                    value={stats?.totalUsers}
                    subtitle={`${stats?.totalPropietarios || 0} Prop. | ${stats?.totalComerciantes || 0} Com.`}
                    loading={loading}
                    icon={<PeopleIcon sx={{ color: '#3f51b5' }} />}
                    color="#3f51b5"
                />
                <KPICard
                    title="Nuevos Registros (30d)"
                    value={stats?.newUsersLast30d}
                    loading={loading}
                    icon={<PersonAddIcon sx={{ color: '#4caf50' }} />}
                    color="#4caf50"
                    chip={stats && stats.newUsersLast30d > 0 ? (
                        <Chip
                            icon={<TrendingUpIcon />}
                            label={`+${stats.newUsersLast30d}`}
                            size="small"
                            color="success"
                            variant="outlined"
                        />
                    ) : undefined}
                />
                <KPICard
                    title="Certificaciones de Habilidades"
                    value={certifications?.approvedCount}
                    subtitle={`${certifications?.pendingCount || 0} Pendientes | ${certifications?.totalRequests || 0} Solic.`}
                    loading={loading}
                    icon={<HowToRegIcon sx={{ color: '#9c27b0' }} />}
                    color="#9c27b0"
                />
                <KPICard
                    title="Programa Referidos (Voz a Voz)"
                    value={referrals ? `${referrals.conversionRate}%` : undefined}
                    subtitle={`${referrals?.totalRegistered || 0} Registros de ${referrals?.totalInvitations || 0} Inv.`}
                    loading={loading}
                    icon={<CardMembershipIcon sx={{ color: '#ff9800' }} />}
                    color="#ff9800"
                    isString
                />
            </Box>

            {/* ── 2. MODELO DE NEGOCIOS Y FUENTES DE FINANCIACIÓN ─────────────────── */}
            <Typography variant="h6" fontWeight={700} sx={{ mt: { xs: 3, sm: 5 }, mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.05rem', sm: '1.25rem' }, flexWrap: 'wrap' }}>
                <AccountBalanceIcon sx={{ color: '#00897b' }} /> Modelo de Negocio y Fuentes de Financiación
            </Typography>

            {/* Funding Sources KPI Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: { xs: 1.5, sm: 2, md: 2.5 },
                    mb: 3,
                }}
            >
                <KPICard
                    title="1. Membresías Anuales"
                    value={monetizationStreams ? formatCurrency(monetizationStreams.comerciantesMembershipPotential) : undefined}
                    subtitle={`$${(PRICING.COMERCIANTE_MEMBERSHIP_ANNUAL?.amount || 150000).toLocaleString('es-CO')} / año`}
                    loading={loading}
                    icon={<WorkspacePremiumIcon sx={{ color: '#00897b' }} />}
                    color="#00897b"
                    isString
                />
                <KPICard
                    title="2. Validación Habilidades"
                    value={monetizationStreams ? formatCurrency(monetizationStreams.certificationsApprovedRevenue) : undefined}
                    subtitle={`$${(PRICING.CERTIFICATION_SKILLS_VAL?.amount || 290000).toLocaleString('es-CO')} / cert.`}
                    loading={loading}
                    icon={<HowToRegIcon sx={{ color: '#9c27b0' }} />}
                    color="#9c27b0"
                    isString
                />
                <KPICard
                    title="3. Contratos & Anticipos"
                    value={monetizationStreams ? formatCurrency(monetizationStreams.contractEscrowVolume) : undefined}
                    subtitle="ePayco Upfront Deposits"
                    loading={loading}
                    icon={<AttachMoneyIcon sx={{ color: '#ff9800' }} />}
                    color="#ff9800"
                    isString
                />
                <KPICard
                    title="4. Comisión Plataforma (10%)"
                    value={monetizationStreams ? formatCurrency(monetizationStreams.platformFeeRevenue) : undefined}
                    subtitle="Retención por servicio"
                    loading={loading}
                    icon={<HandshakeIcon sx={{ color: '#4caf50' }} />}
                    color="#4caf50"
                    isString
                />
            </Box>

            {/* Funding Model & Distribution Charts */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: { xs: 2, sm: 3 },
                    mb: 4,
                    minWidth: 0,
                }}
            >
                {/* Funding Streams Bar Chart */}
                <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, minWidth: 0, overflow: 'hidden' }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Volumen por Fuente de Ingresos (COP)
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : (
                        <Box sx={{ width: '100%', height: { xs: 250, sm: 280 }, minWidth: 0, overflow: 'hidden' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={fundingStreamsData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" />
                                    <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 10 }} />
                                    <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {fundingStreamsData.map((entry, index) => (
                                            <Cell key={`funding-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    )}
                </Paper>

                {/* Contract Health Bar Chart */}
                <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, minWidth: 0, overflow: 'hidden' }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Salud de Contratos en Plataforma
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : (
                        <Box sx={{ width: '100%', height: { xs: 250, sm: 280 }, minWidth: 0, overflow: 'hidden' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={contractData} margin={{ top: 10, right: 15, left: 0, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {contractData.map((entry, index) => (
                                            <Cell key={`bar-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* ── 3. CLASIFICACIÓN DE USUARIOS (CATEGORÍA, CLASIFICACIÓN, GRADO) ────── */}
            <Typography variant="h6" fontWeight={700} sx={{ mt: { xs: 3, sm: 5 }, mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.05rem', sm: '1.25rem' }, flexWrap: 'wrap' }}>
                <CategoryIcon sx={{ color: '#00897b' }} /> Perfilamiento y Clasificación de la Comunidad (Propietarios vs. Comerciantes)
            </Typography>

            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 4, minWidth: 0, overflow: 'hidden' }} elevation={0} variant="outlined">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Desglose por Ejes de Clasificación
                    </Typography>

                    <Tabs
                        value={classificationTab}
                        onChange={(_, v) => setClassificationTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{ minHeight: 40, maxWidth: '100%' }}
                    >
                        <Tab label="Clasificación Escala" value="clasificacion" sx={{ fontWeight: 700, minHeight: 40 }} />
                        <Tab label="Categoría Rango" value="categoria" sx={{ fontWeight: 700, minHeight: 40 }} />
                        <Tab label="Grado Experiencia" value="grado" sx={{ fontWeight: 700, minHeight: 40 }} />
                    </Tabs>
                </Box>

                {loading ? (
                    <Skeleton variant="rectangular" height={300} />
                ) : activeClassificationList.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                        No hay datos de clasificación registrados.
                    </Typography>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={activeClassificationList} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="comerciantesCount" name="Comerciantes Calificados" fill="#00897b" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="propietariosCount" name="Propietarios Residentes" fill="#3f51b5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Paper>

            {/* ── 4. EMBUDO DE CONVERSIÓN Y DENSIDAD GEOGRÁFICA ─────────────────── */}
            <Typography variant="h6" fontWeight={700} sx={{ mt: { xs: 3, sm: 5 }, mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '1.05rem', sm: '1.25rem' }, flexWrap: 'wrap' }}>
                <TrendingUpIcon sx={{ color: '#00897b' }} /> Embudo de Conversión & Densidad Zonal
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: { xs: 2, sm: 3 },
                    minWidth: 0,
                }}
            >
                {/* Conversion Funnel */}
                <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, minWidth: 0, overflow: 'hidden' }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Embudo de Operación (Funnel)
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : (
                        <Box sx={{ width: '100%', height: { xs: 250, sm: 280 }, minWidth: 0, overflow: 'hidden' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={funnel} margin={{ left: 35, right: 20, top: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                                    <YAxis type="category" dataKey="stage" width={90} tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#00897b" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    )}
                </Paper>

                {/* Geographic Density */}
                <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, minWidth: 0, overflow: 'hidden' }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        Densidad Geográfica de Comerciantes (Bogotá & Zonas)
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : zones.length === 0 ? (
                        <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">No hay datos de ubicación disponibles.</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%', height: { xs: 250, sm: 280 }, minWidth: 0, overflow: 'hidden' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={zones} margin={{ top: 10, right: 15, left: 0, bottom: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="zone" tick={{ fontSize: 9 }} interval={0} angle={-25} textAnchor="end" />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    )}
                </Paper>

                {/* Social Growth & Meta Interceptor Live Control Tower */}
                <Paper sx={{ p: 3, borderRadius: 3, gridColumn: { xs: '1 / -1', lg: '1 / -1' } }} elevation={0} variant="outlined">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ p: 1, bgcolor: '#1877f214', borderRadius: 2, display: 'flex' }}>
                                <ShareIcon sx={{ color: '#1877f2' }} />
                            </Box>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Automatización Social & Meta Graph API v19.0+
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Monitor de interceptor de demanda, cuotas anti-baneo y despachos inteligentes
                                </Typography>
                            </Box>
                        </Box>
                        <Chip
                            icon={<ShieldIcon />}
                            label={socialStats?.breakerState === 'CLOSED' ? 'Circuito Seguro (<80% Cuota)' : 'Circuito Pausado'}
                            color={socialStats?.breakerState === 'CLOSED' ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>

                    {/* Social Sub-KPIs */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Total Intercepciones</Typography>
                            <Typography variant="h5" fontWeight={800} color="#0f172a">{socialStats?.totalInterceptions ?? 0}</Typography>
                            <Typography variant="caption" color="#64748b">
                                {socialStats && socialStats.totalInterceptions > 0
                                    ? `${socialStats.supplyInterceptions} Oferta (${Math.round((socialStats.supplyInterceptions / socialStats.totalInterceptions) * 100)}%) | ${socialStats.demandInterceptions} Demanda (${Math.round((socialStats.demandInterceptions / socialStats.totalInterceptions) * 100)}%)`
                                    : '0 Oferta (0%) | 0 Demanda (0%)'}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Comentarios Despachados</Typography>
                            <Typography variant="h5" fontWeight={800} color="#00897b">{socialStats?.dispatchedComments ?? 0}</Typography>
                            <Typography variant="caption" color="#64748b">
                                {socialStats && socialStats.dispatchedComments > 0
                                    ? 'Confirmados con Comment ID Meta'
                                    : 'Sin despachos activos'}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Consumo Cuota Meta API</Typography>
                            <Typography variant="h5" fontWeight={800} color={socialStats && socialStats.appUsage.callCountPercent >= 80 ? '#f44336' : '#1877f2'}>
                                {socialStats?.appUsage.callCountPercent ?? 0}%
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                                {socialStats?.appUsage.thresholdExceeded ? '⚠️ Umbral >80% Superado' : 'Umbral Seguro (<80%)'}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Simulaciones / Fallos</Typography>
                            <Typography variant="h5" fontWeight={800} color={socialStats && (socialStats.failedComments ?? 0) > 0 ? '#f44336' : '#9c27b0'}>
                                {socialStats?.simulatedComments ?? 0}
                                {socialStats && (socialStats.failedComments ?? 0) > 0 ? ` (${socialStats.failedComments} ⚠️)` : ''}
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                                {socialStats && (socialStats.failedComments ?? 0) > 0
                                    ? `${socialStats.failedComments} errores Meta API registrados`
                                    : 'Pruebas Seguras IDE'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Recent Events Table */}
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                        Registro de Intercepciones Recientes
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
                    ) : (socialStats?.recentEvents.length ?? 0) === 0 ? (
                        <Box sx={{ py: 4, px: 2, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                            <ShareIcon sx={{ fontSize: 36, color: '#94a3b8', mb: 1 }} />
                            <Typography variant="body2" fontWeight={600} color="#475569">
                                No hay eventos de intercepción registrados en Firestore
                            </Typography>
                            <Typography variant="caption" color="#94a3b8" display="block">
                                Los comentarios despachados y visitas atribuidas aparecerán aquí automáticamente en tiempo real.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ overflowX: 'auto' }}>
                            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                                <Box component="thead">
                                    <Box component="tr" sx={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                                        <Box component="th" sx={{ py: 1, px: 1.5 }}>Autor / Post</Box>
                                        <Box component="th" sx={{ py: 1, px: 1.5 }}>Grupo de Origen</Box>
                                        <Box component="th" sx={{ py: 1, px: 1.5 }}>Intención</Box>
                                        <Box component="th" sx={{ py: 1, px: 1.5 }}>Oficio</Box>
                                        <Box component="th" sx={{ py: 1, px: 1.5 }}>Copy ID</Box>
                                        <Box component="th" sx={{ py: 1, px: 1.5 }}>Fecha / Hora</Box>
                                        <Box component="th" sx={{ py: 1, px: 1.5 }}>Estado</Box>
                                    </Box>
                                </Box>
                                <Box component="tbody">
                                    {socialStats?.recentEvents.map((evt) => (
                                        <Box component="tr" key={evt.id} sx={{ borderBottom: '1px solid #f1f5f9', '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <Box component="td" sx={{ py: 1.2, px: 1.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{evt.authorName}</Box>
                                            <Box component="td" sx={{ py: 1.2, px: 1.5, color: '#334155', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {evt.groupName || 'Facebook Grupos'}
                                            </Box>
                                            <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                                                <Chip
                                                    label={evt.intent === 'DEMAND' ? 'DEMANDA' : evt.intent === 'SUPPLY' ? 'OFERTA' : evt.intent}
                                                    color={evt.intent === 'DEMAND' ? 'primary' : evt.intent === 'SUPPLY' ? 'secondary' : 'default'}
                                                    size="small"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                            </Box>
                                            <Box component="td" sx={{ py: 1.2, px: 1.5, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{evt.detectedTrade}</Box>
                                            <Box component="td" sx={{ py: 1.2, px: 1.5, fontFamily: 'monospace', fontSize: '0.75rem' }}>{evt.copyId}</Box>
                                            <Box component="td" sx={{ py: 1.2, px: 1.5, color: '#64748b', whiteSpace: 'nowrap' }}>
                                                {formatRelativeTime(evt.timestamp)}
                                            </Box>
                                            <Box component="td" sx={{ py: 1.2, px: 1.5 }}>
                                                <Chip
                                                    label={
                                                        evt.status === 'converted'
                                                            ? 'converted ⭐'
                                                            : evt.status === 'visited'
                                                            ? 'visited 👁️'
                                                            : evt.status === 'dispatched'
                                                            ? 'dispatched ✅'
                                                            : evt.status === 'failed'
                                                            ? `failed ⚠️${evt.errorCode ? ` (${evt.errorCode})` : ''}`
                                                            : evt.status === 'simulated'
                                                            ? 'simulated 🧪'
                                                            : evt.status
                                                    }
                                                    color={
                                                        evt.status === 'converted'
                                                            ? 'secondary'
                                                            : evt.status === 'visited'
                                                            ? 'info'
                                                            : evt.status === 'dispatched'
                                                            ? 'success'
                                                            : evt.status === 'failed'
                                                            ? 'error'
                                                            : evt.status === 'simulated'
                                                            ? 'secondary'
                                                            : 'default'
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                    title={evt.errorDetails || undefined}
                                                    sx={{ fontSize: '0.7rem', height: 20, fontWeight: 600 }}
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Component: KPI Card
// ─────────────────────────────────────────────────────────────────────────────

interface KPICardProps {
    title: string
    value: number | string | undefined
    subtitle?: string
    loading: boolean
    icon: React.ReactNode
    color: string
    chip?: React.ReactNode
    isString?: boolean
}

function KPICard({ title, value, subtitle, loading, icon, color, chip, isString }: KPICardProps) {
    return (
        <Paper
            sx={{
                p: { xs: 1.75, sm: 2.2, md: 2.5 },
                borderRadius: 3,
                borderLeft: `4px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, sm: 2 },
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                minWidth: 0,
                overflow: 'hidden',
            }}
            elevation={0}
            variant="outlined"
        >
            <Box sx={{ p: { xs: 1, sm: 1.2 }, bgcolor: `${color}14`, borderRadius: 2.5, display: 'flex', flexShrink: 0 }}>
                {icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    display="block"
                    sx={{
                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        lineHeight: 1.2,
                        mb: 0.3,
                        wordBreak: 'break-word',
                    }}
                >
                    {title}
                </Typography>
                {loading ? (
                    <Skeleton width={80} height={32} />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography
                            variant="h5"
                            fontWeight={800}
                            color="#0f172a"
                            sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }, lineHeight: 1.2 }}
                        >
                            {isString ? value : String(value ?? 0)}
                        </Typography>
                        {chip}
                    </Box>
                )}
                {subtitle && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, mt: 0.3, display: 'block', wordBreak: 'break-word' }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Paper>
    )
}

function formatRelativeTime(isoString?: string): string {
    if (!isoString) return '-'
    const date = new Date(isoString)
    const diffMs = Date.now() - date.getTime()
    if (diffMs < 0 || isNaN(diffMs)) return 'Ahora'
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHours = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMin < 1) return 'Hace un momento'
    if (diffMin < 60) return `Hace ${diffMin}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays}d`
    return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

