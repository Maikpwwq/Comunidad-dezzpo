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

    return (
        <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Supervisión de Contratos
            </Typography>

            <Paper sx={{ height: 600, borderRadius: 2, mt: 3 }} elevation={0} variant="outlined">
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
