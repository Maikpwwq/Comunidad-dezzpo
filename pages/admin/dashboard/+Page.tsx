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
    Divider,
    Grid,
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
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts'

import {
    getAdminStats,
    getContractStats,
    getFunnelMetrics,
    getGeographicDensity,
    getPlatformRevenueStats,
    getCertificationDashboardStats,
    getReferralDashboardStats,
    getUserClassificationBreakdown,
    getMultiStreamMonetization,
    type AdminStats,
    type ContractStats,
    type FunnelMetric,
    type ZoneDensity,
    type RevenueStats,
    type CertificationDashboardStats,
    type ReferralDashboardStats,
    type UserClassificationBreakdown,
    type MultiStreamMonetizationStats,
} from '@services/admin'

import { PRICING } from '@config/pricing.config'

const PALETTE = ['#00897b', '#3f51b5', '#ff9800', '#f50057', '#9c27b0', '#4caf50', '#00bcd4', '#795548']

function formatCurrency(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export default function Page() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [contracts, setContracts] = useState<ContractStats | null>(null)
    const [funnel, setFunnel] = useState<FunnelMetric[]>([])
    const [zones, setZones] = useState<ZoneDensity[]>([])
    const [revenue, setRevenue] = useState<RevenueStats | null>(null)
    const [certifications, setCertifications] = useState<CertificationDashboardStats | null>(null)
    const [referrals, setReferrals] = useState<ReferralDashboardStats | null>(null)
    const [classificationBreakdown, setClassificationBreakdown] = useState<UserClassificationBreakdown | null>(null)
    const [monetizationStreams, setMonetizationStreams] = useState<MultiStreamMonetizationStats | null>(null)
    const [loading, setLoading] = useState(true)

    // Filter tab for User Classification breakdown (categories, classifications, grades)
    const [classificationTab, setClassificationTab] = useState<'clasificacion' | 'categoria' | 'grado'>('clasificacion')

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const [s, c, f, z, r, cert, ref, cls, mon] = await Promise.all([
                    getAdminStats(),
                    getContractStats(),
                    getFunnelMetrics(),
                    getGeographicDensity(),
                    getPlatformRevenueStats(),
                    getCertificationDashboardStats(),
                    getReferralDashboardStats(),
                    getUserClassificationBreakdown(),
                    getMultiStreamMonetization(),
                ])
                setStats(s)
                setContracts(c)
                setFunnel(f)
                setZones(z)
                setRevenue(r)
                setCertifications(cert)
                setReferrals(ref)
                setClassificationBreakdown(cls)
                setMonetizationStreams(mon)
            } catch (err) {
                console.error('Error loading admin dashboard data:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const userDistribution = stats
        ? [
            { name: 'Propietarios', value: stats.totalPropietarios },
            { name: 'Comerciantes Calificados', value: stats.totalComerciantes },
        ]
        : []

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
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} color="#0f172a" gutterBottom>
                    Centro de Control Ejecutivo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitoreo en tiempo real del modelo de negocios, desempeño de la comunidad, conversiones y flujo de caja.
                </Typography>
            </Box>

            {/* ── 1. GLOBAL PILLAR KPIS ────────────────────────────────────────────── */}
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: 'var(--brand-teal, #00897b)' }} /> Métricas Principales de la Comunidad
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2.5,
                    mb: 4,
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
            <Typography variant="h6" fontWeight={700} sx={{ mt: 5, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon sx={{ color: '#00897b' }} /> Modelo de Negocio y Fuentes de Financiación
            </Typography>

            {/* Funding Sources KPI Cards */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2.5,
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
                    gap: 3,
                    mb: 4,
                }}
            >
                {/* Funding Streams Bar Chart */}
                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Volumen por Fuente de Ingresos (COP)
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={fundingStreamsData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-10} textAnchor="end" />
                                <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                                <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {fundingStreamsData.map((entry, index) => (
                                        <Cell key={`funding-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>

                {/* Contract Health Bar Chart */}
                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Salud de Contratos en Plataforma
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={contractData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {contractData.map((entry, index) => (
                                        <Cell key={`bar-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>
            </Box>

            {/* ── 3. CLASIFICACIÓN DE USUARIOS (CATEGORÍA, CLASIFICACIÓN, GRADO) ────── */}
            <Typography variant="h6" fontWeight={700} sx={{ mt: 5, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CategoryIcon sx={{ color: '#00897b' }} /> Perfilamiento y Clasificación de la Comunidad (Propietarios vs. Comerciantes)
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }} elevation={0} variant="outlined">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Desglose por Ejes de Clasificación
                    </Typography>

                    <Tabs
                        value={classificationTab}
                        onChange={(_, v) => setClassificationTab(v)}
                        sx={{ minHeight: 40 }}
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
            <Typography variant="h6" fontWeight={700} sx={{ mt: 5, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ color: '#00897b' }} /> Embudo de Conversión & Densidad Zonal
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                }}
            >
                {/* Conversion Funnel */}
                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Embudo de Operación (Funnel)
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart layout="vertical" data={funnel} margin={{ left: 50, right: 30, top: 10, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis type="category" dataKey="stage" width={100} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#00897b" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </Paper>

                {/* Geographic Density */}
                <Paper sx={{ p: 3, borderRadius: 3 }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Densidad Geográfica de Comerciantes (Bogotá & Zonas)
                    </Typography>
                    {loading ? (
                        <Skeleton variant="rectangular" height={280} />
                    ) : zones.length === 0 ? (
                        <Box sx={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="text.secondary">No hay datos de ubicación disponibles.</Typography>
                        </Box>
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={zones} margin={{ top: 10, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="zone" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
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
                p: 2.5,
                borderRadius: 3,
                borderLeft: `4px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
            elevation={0}
            variant="outlined"
        >
            <Box sx={{ p: 1.2, bgcolor: `${color}14`, borderRadius: 2.5, display: 'flex' }}>
                {icon}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" noWrap>
                    {title}
                </Typography>
                {loading ? (
                    <Skeleton width={80} height={32} />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" fontWeight={800} color="#0f172a">
                            {isString ? value : String(value ?? 0)}
                        </Typography>
                        {chip}
                    </Box>
                )}
                {subtitle && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.2, display: 'block' }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Paper>
    )
}
