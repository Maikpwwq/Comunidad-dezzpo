/**
 * Admin Dashboard — KPI Command Center
 *
 * High-density data dashboard with KPI cards and charts.
 * Shows user distribution, contract health, and revenue potential.
 */
import { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    Skeleton,
    Chip,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
    getAdminStats,
    getContractStats,
    type AdminStats,
    type ContractStats,
} from '@services/admin'

const COLORS = ['#3f51b5', '#f50057', '#ff9800', '#4caf50']

function formatCurrency(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export default function Page() {
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [contracts, setContracts] = useState<ContractStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const [s, c] = await Promise.all([getAdminStats(), getContractStats()])
            setStats(s)
            setContracts(c)
            setLoading(false)
        }
        load()
    }, [])

    const userDistribution = stats
        ? [
            { name: 'Propietarios', value: stats.totalPropietarios },
            { name: 'Comerciantes', value: stats.totalComerciantes },
        ]
        : []

    const contractData = contracts
        ? [
            { name: 'Activos', value: contracts.active, fill: '#3f51b5' },
            { name: 'Completados', value: contracts.completed, fill: '#4caf50' },
            { name: 'Disputados', value: contracts.disputed, fill: '#f44336' },
        ]
        : []

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Dashboard
            </Typography>

            {/* KPI Cards Row */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 2,
                    mb: 4,
                }}
            >
                <KPICard
                    title="Total Usuarios"
                    value={stats?.totalUsers}
                    loading={loading}
                    icon={<PeopleIcon sx={{ color: '#3f51b5' }} />}
                    color="#3f51b5"
                />
                <KPICard
                    title="Nuevos (30d)"
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
                    title="Potencial Ingresos"
                    value={stats ? formatCurrency(stats.revenuePotential) : undefined}
                    loading={loading}
                    icon={<AttachMoneyIcon sx={{ color: '#ff9800' }} />}
                    color="#ff9800"
                    isString
                />
                <KPICard
                    title="Contratos Activos"
                    value={contracts?.active}
                    loading={loading}
                    icon={<TrendingUpIcon sx={{ color: '#f50057' }} />}
                    color="#f50057"
                />
            </Box>

            {/* Charts Row */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 3,
                }}
            >
                {/* User Distribution Pie Chart */}
                <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Distribución de Usuarios
                    </Typography>
                    {loading ? (
                        <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
                    ) : (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={userDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {userDistribution.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </Paper>

                {/* Contract Health Bar Chart */}
                <Paper sx={{ p: 3, borderRadius: 2 }} elevation={0} variant="outlined">
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Salud de Contratos
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
        </Box>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI Card Component
// ─────────────────────────────────────────────────────────────────────────────

interface KPICardProps {
    title: string
    value: number | string | undefined
    loading: boolean
    icon: React.ReactNode
    color: string
    chip?: React.ReactNode
    isString?: boolean
}

function KPICard({ title, value, loading, icon, color, chip, isString }: KPICardProps) {
    return (
        <Paper
            sx={{
                p: 2.5,
                borderRadius: 2,
                borderLeft: `4px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}
            elevation={0}
            variant="outlined"
        >
            <Box sx={{ p: 1, bgcolor: `${color}14`, borderRadius: 2, display: 'flex' }}>
                {icon}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {title}
                </Typography>
                {loading ? (
                    <Skeleton width={60} height={32} />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" fontWeight={700}>
                            {isString ? value : String(value ?? 0)}
                        </Typography>
                        {chip}
                    </Box>
                )}
            </Box>
        </Paper>
    )
}
