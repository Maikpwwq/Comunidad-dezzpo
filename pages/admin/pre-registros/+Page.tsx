/**
 * Admin Pre-Registros Workbench (`pages/admin/pre-registros/+Page.tsx`)
 *
 * Dedicated admin control tower for reviewing, validating, and moderating
 * candidate recommendations submitted by community members.
 *
 * Capabilities:
 * 1. KPI cards for queue status (Pendientes, Radar, Rechazadas, Duplicadas).
 * 2. Real Firestore queries via `getAdminPreRegistrations` and cheap counts via `getPreRegistrationCounts`.
 * 3. Search by name, phone, category, and R9 match filter toggle ("Posible coincidencia").
 * 4. Responsive table with contact shortcuts, categories chips, submitter info.
 * 5. Full detail & moderation dialog (`PreRegistrationDetailDialog`).
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Snackbar,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    FormControlLabel,
    Switch,
} from '@mui/material'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import RefreshIcon from '@mui/icons-material/Refresh'
import VisibilityIcon from '@mui/icons-material/Visibility'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

import type { PreRegistration, PreRegistrationStatus } from '@/features/preRegistration/types'
import {
    getAdminPreRegistrations,
    getPreRegistrationCounts,
} from '@services/preRegistration/preRegistrationService'
import { PreRegistrationDetailDialog } from '@/features/admin/components/PreRegistrationDetailDialog'
import { SearchInput, PaginationBar } from '@components/layout'
import { usePagination } from '@hooks/usePagination'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { formatPhoneDisplay } from '@services/utils/phoneUtils'

const TAB_STATUS_MAP: Record<number, PreRegistrationStatus> = {
    0: 'pendiente',
    1: 'aprobada',
    2: 'rechazada',
    3: 'duplicada',
}

export default function PreRegistrosAdminPage() {
    const [currentTab, setCurrentTab] = useState<number>(0)
    const [items, setItems] = useState<PreRegistration[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [hasPossibleMatchOnly, setHasPossibleMatchOnly] = useState<boolean>(false)

    // Counts
    const [counts, setCounts] = useState({
        pendientes: 0,
        aprobadas: 0,
        rechazadas: 0,
        duplicadas: 0,
    })

    // Detail dialog
    const [selectedItem, setSelectedItem] = useState<PreRegistration | null>(null)
    const [detailOpen, setDetailOpen] = useState<boolean>(false)

    // Feedback
    const [toastMsg, setToastMsg] = useState<string | null>(null)

    const fetchQueueData = useCallback(async () => {
        setLoading(true)
        const activeStatus = TAB_STATUS_MAP[currentTab] || 'pendiente'

        const [list, countData] = await Promise.all([
            getAdminPreRegistrations({
                status: activeStatus,
                hasPossibleMatchOnly,
            }),
            getPreRegistrationCounts(),
        ])

        setItems(list)
        setCounts(countData)
        setLoading(false)
    }, [currentTab, hasPossibleMatchOnly])

    useEffect(() => {
        fetchQueueData()
    }, [fetchQueueData])

    // Client-side search filtering
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return items
        const term = searchQuery.trim().toLowerCase()

        return items.filter((item) => {
            const cand = item.candidate || {}
            const dName = cand.displayName || ''
            const dPhone = cand.phoneE164 || ''
            const dEmail = cand.email || ''
            const dDesc = cand.description || ''
            const dAddress = cand.address || ''
            const dSkills = cand.skillIds || []

            const matchesName = dName.toLowerCase().includes(term)
            const matchesPhone = dPhone.includes(term)
            const matchesEmail = dEmail.toLowerCase().includes(term)
            const matchesDesc = dDesc.toLowerCase().includes(term)
            const matchesAddress = dAddress.toLowerCase().includes(term)
            const matchesSkills = dSkills.some((sId) => {
                const cat = ListadoCategorias.find((c) => c.key === Number(sId))
                return cat?.label.toLowerCase().includes(term)
            })

            return (
                matchesName ||
                matchesPhone ||
                matchesEmail ||
                matchesDesc ||
                matchesAddress ||
                matchesSkills
            )
        })
    }, [items, searchQuery])

    // Pagination
    const pagination = usePagination({
        items: filteredItems,
        pageSize: 12,
        resetKey: `${searchQuery}-${hasPossibleMatchOnly}-${currentTab}`,
    })

    const handleOpenDetail = (item: PreRegistration) => {
        setSelectedItem(item)
        setDetailOpen(true)
    }

    const handleModerationComplete = (outcomeMessage: string) => {
        setToastMsg(outcomeMessage)
        fetchQueueData()
    }

    return (
        <Box sx={{ pb: 4, width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PersonSearchIcon
                        sx={{ fontSize: { xs: 30, sm: 36 }, color: 'primary.main', flexShrink: 0 }}
                    />
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={800}
                            color="#0A2540"
                            sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                        >
                            Pre-Registros y Radar de Profesionales
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Mesa de verificación, moderación de recomendaciones y radar de atracción de talento.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchQueueData}
                    disabled={loading}
                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                >
                    Actualizar
                </Button>
            </Box>

            {/* KPI Metric Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                    <Card
                        elevation={0}
                        variant="outlined"
                        sx={{
                            borderRadius: 2.5,
                            borderLeft: '4px solid #ed6c02',
                            bgcolor: currentTab === 0 ? 'rgba(237, 108, 2, 0.04)' : 'background.paper',
                            cursor: 'pointer',
                        }}
                        onClick={() => setCurrentTab(0)}
                    >
                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                PENDIENTES
                            </Typography>
                            <Typography variant="h5" fontWeight={800} color="#ed6c02">
                                {counts.pendientes}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card
                        elevation={0}
                        variant="outlined"
                        sx={{
                            borderRadius: 2.5,
                            borderLeft: '4px solid #2e7d32',
                            bgcolor: currentTab === 1 ? 'rgba(46, 125, 50, 0.04)' : 'background.paper',
                            cursor: 'pointer',
                        }}
                        onClick={() => setCurrentTab(1)}
                    >
                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                RADAR APROBADO
                            </Typography>
                            <Typography variant="h5" fontWeight={800} color="#2e7d32">
                                {counts.aprobadas}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card
                        elevation={0}
                        variant="outlined"
                        sx={{
                            borderRadius: 2.5,
                            borderLeft: '4px solid #d32f2f',
                            bgcolor: currentTab === 2 ? 'rgba(211, 47, 47, 0.04)' : 'background.paper',
                            cursor: 'pointer',
                        }}
                        onClick={() => setCurrentTab(2)}
                    >
                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                RECHAZADAS
                            </Typography>
                            <Typography variant="h5" fontWeight={800} color="#d32f2f">
                                {counts.rechazadas}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                    <Card
                        elevation={0}
                        variant="outlined"
                        sx={{
                            borderRadius: 2.5,
                            borderLeft: '4px solid #0288d1',
                            bgcolor: currentTab === 3 ? 'rgba(2, 136, 209, 0.04)' : 'background.paper',
                            cursor: 'pointer',
                        }}
                        onClick={() => setCurrentTab(3)}
                    >
                        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                DUPLICADAS
                            </Typography>
                            <Typography variant="h5" fontWeight={800} color="#0288d1">
                                {counts.duplicadas}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filter Controls Bar */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2,
                    mb: 2.5,
                }}
            >
                <Box sx={{ width: { xs: '100%', md: 450 } }}>
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Buscar por nombre, teléfono, oficio..."
                    />
                </Box>

                <FormControlLabel
                    control={
                        <Switch
                            checked={hasPossibleMatchOnly}
                            onChange={(e) => setHasPossibleMatchOnly(e.target.checked)}
                            color="warning"
                        />
                    }
                    label={
                        <Typography variant="body2" fontWeight={600} color="text.secondary">
                            ⚠️ Solo posible coincidencia (R9)
                        </Typography>
                    }
                />
            </Box>

            {/* Navigation Tabs */}
            <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
                <Tabs
                    value={currentTab}
                    onChange={(_, val) => setCurrentTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{ px: { xs: 1, sm: 2 }, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab
                        icon={<PendingActionsIcon />}
                        iconPosition="start"
                        label={`Pendientes (${counts.pendientes})`}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                    />
                    <Tab
                        icon={<CheckCircleOutlineIcon />}
                        iconPosition="start"
                        label={`Radar Aprobadas (${counts.aprobadas})`}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                    />
                    <Tab
                        icon={<HighlightOffIcon />}
                        iconPosition="start"
                        label={`Rechazadas (${counts.rechazadas})`}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                    />
                    <Tab
                        icon={<ContentCopyIcon />}
                        iconPosition="start"
                        label={`Duplicadas (${counts.duplicadas})`}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                    />
                </Tabs>

                {/* Queue Data Table */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredItems.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                        <Typography variant="h6" color="text.secondary" fontWeight={600} gutterBottom>
                            No hay pre-registros en esta sección
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            {searchQuery
                                ? 'No se encontraron resultados para la búsqueda actual.'
                                : 'No existen registros con el estado seleccionado.'}
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="medium">
                            <TableHead sx={{ bgcolor: 'var(--table-header-bg, #f8f9fa)' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Profesional / Candidato</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Categorías</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Contacto Directo</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Recomendado Por</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Estado / Versión</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                                        Acción
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagination.pageItems.map((item) => {
                                    const cand = item.candidate || {}
                                    const phone = cand.phoneE164 || ''
                                    const cleanDigits = phone.replace(/\D/g, '')
                                    const skills = cand.skillIds || []

                                    return (
                                        <TableRow
                                            key={item.id}
                                            hover
                                            sx={{
                                                bgcolor: item.hasPossibleMatch
                                                    ? 'rgba(237, 108, 2, 0.04)'
                                                    : 'inherit',
                                            }}
                                        >
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {cand.displayName || 'Sin nombre'}
                                                    </Typography>
                                                    {item.hasPossibleMatch && (
                                                        <Tooltip title="Posible coincidencia con comerciante registrado (R9)">
                                                            <Chip
                                                                icon={<WarningAmberIcon sx={{ fontSize: '1rem !important' }} />}
                                                                label="Coincidencia"
                                                                size="small"
                                                                color="warning"
                                                                sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                                {cand.description && (
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {cand.description}
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Box display="flex" gap={0.5} flexWrap="wrap" maxWidth={220}>
                                                    {skills.map((sId) => {
                                                        const cat = ListadoCategorias.find(
                                                            (c) => c.key === Number(sId),
                                                        )
                                                        return (
                                                            <Chip
                                                                key={sId}
                                                                label={cat ? cat.label : `#${sId}`}
                                                                size="small"
                                                                sx={{ fontSize: '0.72rem', height: 22 }}
                                                            />
                                                        )
                                                    })}
                                                </Box>
                                            </TableCell>

                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {formatPhoneDisplay(phone)}
                                                    </Typography>
                                                    {cleanDigits && (
                                                        <Tooltip title="WhatsApp directo">
                                                            <IconButton
                                                                size="small"
                                                                href={`https://wa.me/${cleanDigits}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                sx={{ color: '#25D366', p: 0.5 }}
                                                            >
                                                                <WhatsAppIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                                {cand.email && (
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        {cand.email}
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    UID: {item.submittedBy.slice(0, 8)}...
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled" display="block">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <Chip
                                                        label={item.status}
                                                        size="small"
                                                        color={
                                                            item.status === 'pendiente'
                                                                ? 'warning'
                                                                : item.status === 'aprobada'
                                                                ? 'success'
                                                                : 'default'
                                                        }
                                                        sx={{ fontWeight: 700, fontSize: '0.72rem', height: 22 }}
                                                    />
                                                    <Typography variant="caption" color="text.disabled">
                                                        v{item.version}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => handleOpenDetail(item)}
                                                    sx={{
                                                        textTransform: 'none',
                                                        borderRadius: 2,
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    Revisar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Pagination Controls */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <PaginationBar
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalItems}
                        onPageChange={pagination.goToPage}
                        itemLabel="candidatos"
                    />
                </Box>
            </Paper>

            {/* Moderation Detail Dialog */}
            <PreRegistrationDetailDialog
                open={detailOpen}
                item={selectedItem}
                onClose={() => setDetailOpen(false)}
                onModerationComplete={handleModerationComplete}
            />

            {/* Notification Toast */}
            <Snackbar
                open={Boolean(toastMsg)}
                autoHideDuration={4000}
                onClose={() => setToastMsg(null)}
                message={toastMsg}
            />
        </Box>
    )
}
