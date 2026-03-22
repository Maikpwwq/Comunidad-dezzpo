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

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Supervisión de Requerimientos
            </Typography>

            <Paper sx={{ height: 600, borderRadius: 2, mt: 3 }} elevation={0} variant="outlined">
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
                    sx: { width: { xs: '100%', sm: 400 }, p: 3, bgcolor: BRAND.surface }
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
