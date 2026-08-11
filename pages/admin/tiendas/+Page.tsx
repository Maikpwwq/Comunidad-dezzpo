import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Paper,
    Button,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material'
import StorefrontIcon from '@mui/icons-material/Storefront'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import {
    getTiendas,
    createTienda,
    updateTienda,
    deleteTienda,
    approveTienda,
    rejectTienda,
    type TiendaDocument,
    type CreateTiendaInput,
} from '@services/tiendas'
import { ListadoCategoriasTiendas } from '@assets/data/ListadoCategoriasTiendas'
import { TiendaFormModal, SedeDetailModal } from '@features/tiendas'

export default function Page() {
    const [currentTab, setCurrentTab] = useState<number>(0)
    const [approvedTiendas, setApprovedTiendas] = useState<TiendaDocument[]>([])
    const [pendingTiendas, setPendingTiendas] = useState<TiendaDocument[]>([])
    const [loading, setLoading] = useState(true)

    // Form Modal
    const [formOpen, setFormOpen] = useState(false)
    const [selectedTienda, setSelectedTienda] = useState<TiendaDocument | null>(null)

    // Detail Modal
    const [detailOpen, setDetailOpen] = useState(false)
    const [detailTienda, setDetailTienda] = useState<TiendaDocument | null>(null)

    // Snackbar
    const [toastMsg, setToastMsg] = useState<string | null>(null)

    const loadAllTiendas = async () => {
        setLoading(true)
        const approvedRes = await getTiendas({ estado: 'aprobado' })
        if (approvedRes.success && approvedRes.data) {
            setApprovedTiendas(approvedRes.data)
        }

        const pendingRes = await getTiendas({ estado: 'pendiente' })
        if (pendingRes.success && pendingRes.data) {
            setPendingTiendas(pendingRes.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadAllTiendas()
    }, [])

    const handleSaveTienda = async (input: CreateTiendaInput): Promise<boolean> => {
        if (selectedTienda) {
            const res = await updateTienda(selectedTienda.id, input)
            if (res.success) {
                setToastMsg('Tienda actualizada exitosamente')
                loadAllTiendas()
                return true
            }
        } else {
            const res = await createTienda(input, 'admin')
            if (res.success) {
                setToastMsg('Nueva tienda registrada e ingresada al sistema')
                loadAllTiendas()
                return true
            }
        }
        return false
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta tienda de forma permanente?')) return
        const res = await deleteTienda(id)
        if (res.success) {
            setToastMsg('Tienda eliminada del sistema')
            loadAllTiendas()
        }
    }

    const handleApprove = async (id: string) => {
        const res = await approveTienda(id)
        if (res.success) {
            setToastMsg('Sugerencia aprobada y publicada en el directorio público')
            loadAllTiendas()
        }
    }

    const handleReject = async (id: string) => {
        const res = await rejectTienda(id)
        if (res.success) {
            setToastMsg('Sugerencia rechazada')
            loadAllTiendas()
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <StorefrontIcon sx={{ fontSize: 36, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h5" fontWeight={800} color="#0A2540">
                            Gestión de Tiendas y Proveedores
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Panel de administración, moderación y control de sedes de insumos y servicios técnicos.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    className="btn-primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedTienda(null)
                        setFormOpen(true)
                    }}
                    sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
                >
                    Nueva Tienda
                </Button>
            </Box>

            {/* Navigation Tabs */}
            <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={(_, val) => setCurrentTab(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab
                        label={`Tiendas Aprobadas (${approvedTiendas.length})`}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                    />
                    <Tab
                        icon={pendingTiendas.length > 0 ? <PendingActionsIcon color="warning" /> : undefined}
                        iconPosition="start"
                        label={`Cola de Moderación (${pendingTiendas.length})`}
                        sx={{ textTransform: 'none', fontWeight: 700 }}
                    />
                </Tabs>

                {/* Tab 0: Approved Tiendas */}
                {currentTab === 0 && (
                    <Box sx={{ p: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : approvedTiendas.length > 0 ? (
                            <TableContainer>
                                <Table size="medium">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 700 }}>Negocio / Nombre</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Categorías</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Sedes</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Contacto Principal</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Origen</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {approvedTiendas.map((tienda) => (
                                            <TableRow key={tienda.id} hover>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={700} color="#0A2540">
                                                        {tienda.nombre}
                                                    </Typography>
                                                    {tienda.descripcion && (
                                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 220, display: 'block' }}>
                                                            {tienda.descripcion}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {tienda.categorias.map((catKey) => {
                                                            const catObj = ListadoCategoriasTiendas.find((c) => c.key === catKey)
                                                            return (
                                                                <Chip
                                                                    key={catKey}
                                                                    label={catObj ? catObj.label : catKey}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            )
                                                        })}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${tienda.sedes.length} sedes`}
                                                        size="small"
                                                        color="info"
                                                        variant="outlined"
                                                        onClick={() => {
                                                            setDetailTienda(tienda)
                                                            setDetailOpen(true)
                                                        }}
                                                        sx={{ cursor: 'pointer', fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">{tienda.telefonoPrincipal || '—'}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={tienda.origen === 'equipo_dezzpo' ? 'Dezzpo' : 'Usuario'}
                                                        size="small"
                                                        color={tienda.origen === 'equipo_dezzpo' ? 'primary' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Ver sedes">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                setDetailTienda(tienda)
                                                                setDetailOpen(true)
                                                            }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Editar tienda">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => {
                                                                setSelectedTienda(tienda)
                                                                setFormOpen(true)
                                                            }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(tienda.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No hay tiendas registradas o aprobadas aún.</Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Tab 1: Moderation Queue */}
                {currentTab === 1 && (
                    <Box sx={{ p: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                <CircularProgress />
                            </Box>
                        ) : pendingTiendas.length > 0 ? (
                            <TableContainer>
                                <Table size="medium">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#fff7ed' }}>
                                            <TableCell sx={{ fontWeight: 700 }}>Negocio Sugerido</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Categorías</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Sedes Registradas</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Fecha Sugerencia</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones de Moderación</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pendingTiendas.map((tienda) => (
                                            <TableRow key={tienda.id} hover>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {tienda.nombre}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {tienda.descripcion || 'Sin descripción'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {tienda.categorias.map((catKey) => {
                                                            const catObj = ListadoCategoriasTiendas.find((c) => c.key === catKey)
                                                            return (
                                                                <Chip key={catKey} label={catObj ? catObj.label : catKey} size="small" />
                                                            )
                                                        })}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${tienda.sedes.length} sedes`}
                                                        size="small"
                                                        color="warning"
                                                        onClick={() => {
                                                            setDetailTienda(tienda)
                                                            setDetailOpen(true)
                                                        }}
                                                        sx={{ cursor: 'pointer' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="caption">{new Date(tienda.createdAt).toLocaleDateString()}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        startIcon={<CheckCircleIcon />}
                                                        onClick={() => handleApprove(tienda.id)}
                                                        sx={{ textTransform: 'none', mr: 1, borderRadius: 2 }}
                                                    >
                                                        Aprobar
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<CancelIcon />}
                                                        onClick={() => handleReject(tienda.id)}
                                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                                    >
                                                        Rechazar
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="text.secondary">No hay sugerencias de tiendas pendientes en la cola.</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Form Modal */}
            <TiendaFormModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSave={handleSaveTienda}
                initialData={selectedTienda}
                isAdminMode={true}
            />

            {/* Sede Detail Modal */}
            <SedeDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                tienda={detailTienda}
            />

            {/* Toast Feedback */}
            <Snackbar
                open={Boolean(toastMsg)}
                autoHideDuration={4000}
                onClose={() => setToastMsg(null)}
                message={toastMsg}
            />
        </Box>
    )
}
