import { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Drawer,
    Divider,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { getAllDrafts, getQuotesForDraftAdmin, type AdminDraftRow } from '@services/admin'
import { ChatAuditorModal } from '@features/admin/components/ChatAuditorModal'

const BRAND = {
    teal: 'var(--brand-teal)',
    tealDark: 'var(--brand-teal-dark)',
    surface: 'var(--admin-surface)',
}

export default function RequerimientosPage() {
    const [drafts, setDrafts] = useState<AdminDraftRow[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDraft, setSelectedDraft] = useState<AdminDraftRow | null>(null)
    const [quotes, setQuotes] = useState<any[]>([])
    const [quotesLoading, setQuotesLoading] = useState(false)
    const [auditorChannel, setAuditorChannel] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            const data = await getAllDrafts()
            setDrafts(data)
            setLoading(false)
        }
        load()
    }, [])

    const handleRowClick = useCallback(async (params: { row: AdminDraftRow }) => {
        setSelectedDraft(params.row)
        setQuotesLoading(true)
        try {
            const data = await getQuotesForDraftAdmin(params.row.id)
            setQuotes(data)
        } catch (error) {
            console.error('Failed to load quotes:', error)
            setQuotes([])
        } finally {
            setQuotesLoading(false)
        }
    }, [])

    const handleAuditChat = useCallback((channelUrl?: string) => {
        if (channelUrl) setAuditorChannel(channelUrl)
    }, [])

    const columns: GridColDef<AdminDraftRow>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {params.value?.slice(0, 10)}…
                </Typography>
            ),
        },
        { field: 'name', headerName: 'Título del Requerimiento', flex: 1, minWidth: 200 },
        { field: 'category', headerName: 'Categoría', width: 140 },
        {
            field: 'status',
            headerName: 'Estado',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'open' ? 'Abierto' : 'Cerrado'}
                    size="small"
                    sx={{
                        bgcolor: params.value === 'open' ? 'var(--status-active-bg)' : 'var(--status-pending-bg)',
                        color: params.value === 'open' ? 'var(--status-active-color)' : 'var(--status-pending-color)',
                        fontWeight: 600
                    }}
                />
            ),
        },
        {
            field: 'budget',
            headerName: 'Presupuesto',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={600}>
                    ${Number(params.value).toLocaleString()}
                </Typography>
            )
        },
        {
            field: 'channelUrl',
            headerName: 'Auditar',
            width: 80,
            renderCell: (params) => {
                if (!params.value || params.value === '') return null
                return (
                    <Tooltip title="Auditar Canal (Sendbird)">
                        <IconButton 
                            size="small" 
                            onClick={(e) => {
                                e.stopPropagation()
                                handleAuditChat(params.value)
                            }}
                            sx={{ color: BRAND.teal }}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )
            }
        }
    ]

    const [mobilePage, setMobilePage] = useState(0)
    const MOBILE_PAGE_SIZE = 10

    const paginatedDrafts = drafts.slice(
        mobilePage * MOBILE_PAGE_SIZE,
        (mobilePage + 1) * MOBILE_PAGE_SIZE
    )

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' } }}
                    gutterBottom
                >
                    Supervisión de Requerimientos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitoreo de solicitudes publicadas por propietarios y cotizaciones enviadas por contratistas.
                </Typography>
            </Box>

            {/* MOBILE CARD LIST (< md) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                {loading ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <CircularProgress size={36} sx={{ color: BRAND.teal }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                            Cargando requerimientos...
                        </Typography>
                    </Box>
                ) : drafts.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">
                            No hay requerimientos registrados.
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        {paginatedDrafts.map((d) => (
                            <Paper
                                key={d.id}
                                onClick={() => handleRowClick({ row: d })}
                                sx={{
                                    p: 2,
                                    borderRadius: 2.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 'none',
                                    cursor: 'pointer',
                                    '&:hover': { borderColor: BRAND.teal },
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '0.95rem', minWidth: 0, mr: 1 }}>
                                        {d.name}
                                    </Typography>
                                    <Chip
                                        label={d.status === 'open' ? 'Abierto' : 'Cerrado'}
                                        size="small"
                                        sx={{
                                            bgcolor: d.status === 'open' ? 'var(--status-active-bg)' : 'var(--status-pending-bg)',
                                            color: d.status === 'open' ? 'var(--status-active-color)' : 'var(--status-pending-color)',
                                            fontWeight: 700,
                                            height: 22,
                                            fontSize: '0.7rem',
                                            flexShrink: 0,
                                        }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                                    <Chip label={d.category} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', alignSelf: 'center', ml: 0.5 }}>
                                        ID: {d.id?.slice(0, 8)}…
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Presupuesto
                                        </Typography>
                                        <Typography variant="subtitle2" fontWeight={800} color={BRAND.tealDark}>
                                            ${Number(d.budget || 0).toLocaleString()}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {d.channelUrl ? (
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleAuditChat(d.channelUrl)
                                                }}
                                                sx={{ color: BRAND.teal }}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        ) : null}
                                        <Typography variant="caption" color="primary" fontWeight={700}>
                                            Ver detalle ›
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}

                        {/* Mobile Pagination */}
                        {drafts.length > MOBILE_PAGE_SIZE && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {mobilePage * MOBILE_PAGE_SIZE + 1}–
                                    {Math.min((mobilePage + 1) * MOBILE_PAGE_SIZE, drafts.length)} de {drafts.length}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip
                                        label="Anterior"
                                        size="small"
                                        onClick={() => setMobilePage((p) => Math.max(0, p - 1))}
                                        disabled={mobilePage === 0}
                                        clickable={mobilePage > 0}
                                        variant="outlined"
                                    />
                                    <Chip
                                        label="Siguiente"
                                        size="small"
                                        onClick={() =>
                                            setMobilePage((p) =>
                                                (p + 1) * MOBILE_PAGE_SIZE < drafts.length ? p + 1 : p
                                            )
                                        }
                                        disabled={(mobilePage + 1) * MOBILE_PAGE_SIZE >= drafts.length}
                                        clickable={(mobilePage + 1) * MOBILE_PAGE_SIZE < drafts.length}
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        )}
                    </>
                )}
            </Box>

            {/* DESKTOP DATAGRID (>= md) */}
            <Paper
                sx={{
                    display: { xs: 'none', md: 'block' },
                    height: 600,
                    borderRadius: 2,
                    mt: 2,
                }}
                elevation={0}
                variant="outlined"
            >
                <DataGrid
                    rows={drafts}
                    columns={columns}
                    getRowId={(row) => row.id}
                    loading={loading}
                    onRowClick={handleRowClick}
                    pageSizeOptions={[15, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer',
                            bgcolor: 'rgba(0,137,123,0.04)',
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </Paper>

            {/* Master-Detail Side Drawer */}
            <Drawer 
                anchor="right" 
                open={!!selectedDraft} 
                onClose={() => setSelectedDraft(null)}
                PaperProps={{
                    sx: { width: { xs: '100vw', sm: 420 }, maxWidth: '100vw', p: { xs: 2, sm: 3 }, bgcolor: BRAND.surface }
                }}
            >
                {selectedDraft && (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight={700} color={BRAND.tealDark}>
                                Detalle del Requerimiento
                            </Typography>
                            <IconButton onClick={() => setSelectedDraft(null)} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        
                        <Typography variant="subtitle1" fontWeight={600}>{selectedDraft.name}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>ID: {selectedDraft.id}</Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                            <Chip label={selectedDraft.category} size="small" />
                            <Chip 
                                label={selectedDraft.status === 'open' ? 'Abierto' : 'Cerrado'} 
                                size="small" 
                                sx={{ bgcolor: selectedDraft.status === 'open' ? 'var(--status-active-bg)' : 'var(--status-pending-bg)' }} 
                            />
                        </Box>
                        
                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle2" fontWeight={700} color={BRAND.tealDark} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ReceiptIcon fontSize="small" />
                            Cotizaciones Asociadas
                        </Typography>

                        {quotesLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress size={30} />
                            </Box>
                        ) : quotes.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center', p: 2 }}>
                                No hay cotizaciones registradas para este requerimiento.
                            </Typography>
                        ) : (
                            <List disablePadding>
                                {quotes.map((q) => (
                                    <Paper key={q.id} variant="outlined" sx={{ mb: 1, borderRadius: 2 }}>
                                        <ListItem>
                                            <ListItemText 
                                                primary={`Cotización: $${Number(q.quotationPrice || 0).toLocaleString()}`}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="caption" sx={{ display: 'block' }}>
                                                            Estado: {q.quotationStatus || '—'}
                                                        </Typography>
                                                        <Typography component="span" variant="body2" sx={{ opacity: 0.8 }}>
                                                            {q.quotationDescription || 'Sin descripción'}
                                                        </Typography>
                                                    </>
                                                }
                                                primaryTypographyProps={{ fontWeight: 600, color: BRAND.tealDark }}
                                            />
                                        </ListItem>
                                    </Paper>
                                ))}
                            </List>
                        )}
                    </Box>
                )}
            </Drawer>

            <ChatAuditorModal 
                open={!!auditorChannel}
                channelUrl={auditorChannel}
                onClose={() => setAuditorChannel(null)}
                title="Auditoría de Hilo Comercial (Solo Lectura)"
            />
        </Box>
    )
}
