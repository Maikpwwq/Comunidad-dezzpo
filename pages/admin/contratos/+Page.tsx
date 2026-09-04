import { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { getAllContracts, type AdminContractRow } from '@services/admin'
import { ChatAuditorModal } from '@features/admin/components/ChatAuditorModal'

const BRAND = {
    teal: 'var(--brand-teal)',
    tealDark: 'var(--brand-teal-dark)',
    surface: 'var(--admin-surface)',
}

const statusChipSx = (status: string) => {
    switch (status) {
        case 'active':
            return { bgcolor: 'var(--status-active-bg)', color: 'var(--status-active-color)', fontWeight: 600 }
        case 'pending_payment':
            return { bgcolor: 'var(--status-pending-bg)', color: 'var(--status-pending-color)', fontWeight: 600 }
        case 'completed':
            return { bgcolor: 'var(--status-completed-bg)', color: 'var(--status-completed-color)', fontWeight: 600 }
        case 'disputed':
            return { bgcolor: 'var(--status-disputed-bg)', color: 'var(--status-disputed-color)', fontWeight: 600 }
        default:
            return { bgcolor: '#F5F5F5', color: '#616161', fontWeight: 600 }
    }
}

export default function ContratosPage() {
    const [contracts, setContracts] = useState<AdminContractRow[]>([])
    const [loading, setLoading] = useState(true)
    const [auditorChannel, setAuditorChannel] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            const data = await getAllContracts()
            setContracts(data)
            setLoading(false)
        }
        load()
    }, [])

    const handleAuditChat = useCallback((channelUrl?: string) => {
        if (channelUrl) setAuditorChannel(channelUrl)
    }, [])

    const columns: GridColDef<AdminContractRow>[] = [
        {
            field: 'id',
            headerName: 'ID Contrato',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {params.value?.slice(0, 10)}…
                </Typography>
            ),
        },
        { field: 'createdAt', headerName: 'Fecha Creado', width: 130 },
        {
            field: 'status',
            headerName: 'Estado',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={
                        params.value === 'active' ? 'En Ejecución' :
                        params.value === 'pending_payment' ? 'Pte. Pago' :
                        params.value === 'completed' ? 'Finalizado' :
                        params.value === 'disputed' ? 'Disputa/Conflictivo' : params.value
                    }
                    size="small"
                    sx={statusChipSx(params.value)}
                />
            ),
        },
        {
            field: 'agreedAmount',
            headerName: 'Acordado ($)',
            width: 140,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={600}>
                    ${Number(params.value).toLocaleString()}
                </Typography>
            )
        },
        {
            field: 'clientId',
            headerName: 'Cliente (Propietario)',
            flex: 1,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7 }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'providerId',
            headerName: 'Proveedor (Comerciante)',
            flex: 1,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.7 }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'channelUrl',
            headerName: 'Auditar',
            width: 80,
            renderCell: (params) => {
                if (!params.value || params.value === '') return null
                return (
                    <Tooltip title="Auditar Chat Moderado">
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

    const paginatedContracts = contracts.slice(
        mobilePage * MOBILE_PAGE_SIZE,
        (mobilePage + 1) * MOBILE_PAGE_SIZE
    )

    return (
        <Box sx={{ pb: 4, maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' } }}
                    gutterBottom
                >
                    Supervisión de Contratos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Auditoría en tiempo real de transacciones, estados de ejecución y canales de chat asociados.
                </Typography>
            </Box>

            {/* MOBILE CARD LIST (< md) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                {loading ? (
                    <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Cargando contratos...
                        </Typography>
                    </Box>
                ) : contracts.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2.5, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">
                            No hay contratos registrados.
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        {paginatedContracts.map((c) => (
                            <Paper
                                key={c.id}
                                sx={{
                                    p: 2,
                                    borderRadius: 2.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 'none',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                                            ID: {c.id?.slice(0, 10)}…
                                        </Typography>
                                        <Typography variant="h6" fontWeight={800} color="#0f766e" sx={{ fontSize: '1.1rem' }}>
                                            ${Number(c.agreedAmount || 0).toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={
                                            c.status === 'active' ? 'En Ejecución' :
                                            c.status === 'pending_payment' ? 'Pte. Pago' :
                                            c.status === 'completed' ? 'Finalizado' :
                                            c.status === 'disputed' ? 'Disputa' : c.status
                                        }
                                        size="small"
                                        sx={statusChipSx(c.status)}
                                    />
                                </Box>

                                <Box sx={{ p: 1.2, bgcolor: 'background.default', borderRadius: 2, mb: 1.5, fontSize: '0.75rem' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="text.secondary">Cliente:</Typography>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            {c.clientId ? `${c.clientId.slice(0, 12)}…` : '—'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="caption" color="text.secondary">Proveedor:</Typography>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            {c.providerId ? `${c.providerId.slice(0, 12)}…` : '—'}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {c.createdAt || ''}
                                    </Typography>

                                    {c.channelUrl ? (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleAuditChat(c.channelUrl)}
                                            sx={{
                                                bgcolor: 'rgba(15, 118, 110, 0.08)',
                                                color: '#0f766e',
                                                borderRadius: 2,
                                                px: 1.5,
                                                gap: 0.5,
                                                '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.15)' },
                                            }}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                            <Typography variant="caption" fontWeight={700}>
                                                Auditar
                                            </Typography>
                                        </IconButton>
                                    ) : null}
                                </Box>
                            </Paper>
                        ))}

                        {/* Mobile Pagination */}
                        {contracts.length > MOBILE_PAGE_SIZE && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {mobilePage * MOBILE_PAGE_SIZE + 1}–
                                    {Math.min((mobilePage + 1) * MOBILE_PAGE_SIZE, contracts.length)} de {contracts.length}
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
                                                (p + 1) * MOBILE_PAGE_SIZE < contracts.length ? p + 1 : p
                                            )
                                        }
                                        disabled={(mobilePage + 1) * MOBILE_PAGE_SIZE >= contracts.length}
                                        clickable={(mobilePage + 1) * MOBILE_PAGE_SIZE < contracts.length}
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
                    rows={contracts}
                    columns={columns}
                    getRowId={(row) => row.id}
                    loading={loading}
                    pageSizeOptions={[15, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-row:hover': {
                            bgcolor: 'rgba(0,137,123,0.04)',
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </Paper>

            <ChatAuditorModal 
                open={!!auditorChannel}
                channelUrl={auditorChannel}
                onClose={() => setAuditorChannel(null)}
                title="Auditoría de Historial de Contrato (Solo Lectura)"
            />
        </Box>
    )
}
