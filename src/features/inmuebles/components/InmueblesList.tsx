import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Snackbar,
    Skeleton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useUserStore } from '@stores/userStore'
import {
    getInmuebles,
    createInmueble,
    updateInmueble,
    deleteInmueble,
    setPreferidaInmueble,
    type Inmueble,
    type CreateInmuebleInput
} from '@services/inmuebles'
import { InmuebleCard } from './InmuebleCard'
import { InmuebleFormModal } from './InmuebleFormModal'

export const InmueblesList: React.FC = () => {
    const userId = useUserStore((state) => state.userId)
    const isAuth = useUserStore((state) => state.isAuth)

    const [inmuebles, setInmuebles] = useState<Inmueble[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

    const [openModal, setOpenModal] = useState(false)
    const [editingInmueble, setEditingInmueble] = useState<Inmueble | null>(null)

    // Deletion dialog state
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
    const [deleteGuardError, setDeleteGuardError] = useState<string | null>(null)

    // Toast state
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('success')

    const loadInmuebles = useCallback(async () => {
        if (!userId) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const res = await getInmuebles(userId)
            if (res.success && res.data) {
                setInmuebles(res.data)
            } else if (res.error) {
                setToastMessage(res.error.message || 'Error al cargar los inmuebles')
                setToastSeverity('error')
            }
        } catch (err: any) {
            setToastMessage('Ocurrió un error inesperado al consultar inmuebles')
            setToastSeverity('error')
        } finally {
            setIsLoading(false)
        }
    }, [userId])

    useEffect(() => {
        if (isAuth && userId) {
            loadInmuebles()
        }
    }, [isAuth, userId, loadInmuebles])

    const handleOpenAddModal = () => {
        setEditingInmueble(null)
        setOpenModal(true)
    }

    const handleOpenEditModal = (inmueble: Inmueble) => {
        setEditingInmueble(inmueble)
        setOpenModal(true)
    }

    const handleSave = async (data: CreateInmuebleInput): Promise<boolean> => {
        if (!userId) return false

        try {
            if (editingInmueble) {
                const res = await updateInmueble(userId, editingInmueble.id, data)
                if (res.success) {
                    setToastMessage('Inmueble actualizado correctamente.')
                    setToastSeverity('success')
                    await loadInmuebles()
                    return true
                } else {
                    setToastMessage(res.error?.message || 'Error al actualizar inmueble.')
                    setToastSeverity('error')
                    return false
                }
            } else {
                const res = await createInmueble(userId, data)
                if (res.success) {
                    setToastMessage('Nuevo inmueble registrado con éxito.')
                    setToastSeverity('success')
                    await loadInmuebles()
                    return true
                } else {
                    setToastMessage(res.error?.message || 'Error al registrar inmueble.')
                    setToastSeverity('error')
                    return false
                }
            }
        } catch (err: any) {
            setToastMessage(err.message || 'Error al procesar la solicitud.')
            setToastSeverity('error')
            return false
        }
    }

    const handleSetPreferida = async (id: string) => {
        if (!userId) return
        setActionLoadingId(id)
        try {
            const res = await setPreferidaInmueble(userId, id)
            if (res.success) {
                setToastMessage('Propiedad establecida como preferida.')
                setToastSeverity('success')
                await loadInmuebles()
            } else {
                setToastMessage(res.error?.message || 'No se pudo actualizar la propiedad preferida.')
                setToastSeverity('error')
            }
        } finally {
            setActionLoadingId(null)
        }
    }

    const handlePromptDelete = (id: string) => {
        const target = inmuebles.find(i => i.id === id)
        if (target && target.isPreferida && inmuebles.length > 1) {
            setDeleteGuardError('No puedes eliminar la propiedad preferida mientras existan otras propiedades en tu lista. Designa primero otra propiedad como preferida.')
        } else {
            setDeleteGuardError(null)
        }
        setDeleteTargetId(id)
    }

    const handleConfirmDelete = async () => {
        if (!userId || !deleteTargetId) return

        setActionLoadingId(deleteTargetId)
        try {
            const res = await deleteInmueble(userId, deleteTargetId)
            if (res.success) {
                setToastMessage('Inmueble eliminado correctamente.')
                setToastSeverity('success')
                setDeleteTargetId(null)
                await loadInmuebles()
            } else {
                setToastMessage(res.error?.message || 'Error al eliminar el inmueble.')
                setToastSeverity('error')
            }
        } finally {
            setActionLoadingId(null)
        }
    }

    return (
        <Box sx={{ width: '100%', py: 1 }}>
            {/* Header section */}
            <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={4}>
                <Box>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                bgcolor: '#f0fdfa',
                                color: '#0f766e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <HomeWorkIcon fontSize="medium" />
                        </Box>
                        <Typography variant="h4" fontWeight={800} color="#0f172a">
                            Mis Inmuebles
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Gestiona los inmuebles y edificaciones donde requieres o administras servicios técnicos.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddHomeWorkIcon />}
                    onClick={handleOpenAddModal}
                    sx={{
                        bgcolor: '#0f766e',
                        '&:hover': { bgcolor: '#0d9488' },
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 2.5,
                        px: 3,
                        py: 1.2,
                        boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)'
                    }}
                >
                    Registrar Inmueble
                </Button>
            </Box>

            {/* Main content grid */}
            {isLoading ? (
                <Grid container spacing={3}>
                    {[1, 2, 3].map((n) => (
                        <Grid item xs={12} md={6} key={n}>
                            <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : inmuebles.length > 0 ? (
                <Grid container spacing={3}>
                    {inmuebles.map((inmueble) => (
                        <Grid item xs={12} md={6} key={inmueble.id}>
                            <InmuebleCard
                                inmueble={inmueble}
                                onSetPreferida={handleSetPreferida}
                                onEdit={handleOpenEditModal}
                                onDelete={handlePromptDelete}
                                isActionLoading={actionLoadingId === inmueble.id}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 4,
                        bgcolor: '#f8fafc',
                        border: '2px dashed #cbd5e1'
                    }}
                >
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            bgcolor: '#e0f2fe',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                        }}
                    >
                        <HomeWorkIcon sx={{ fontSize: 36 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1}>
                        Aún no tienes inmuebles registrados
                    </Typography>
                    <Typography variant="body2" color="text.secondary" maxWidth={480} mx="auto" mb={3}>
                        Registra tus casas, apartamentos o edificaciones para seleccionar fácilmente el lugar exacto al publicar requerimientos o solicitar cotizaciones.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddHomeWorkIcon />}
                        onClick={handleOpenAddModal}
                        sx={{
                            bgcolor: '#0f766e',
                            '&:hover': { bgcolor: '#0d9488' },
                            fontWeight: 700,
                            textTransform: 'none',
                            borderRadius: 2.5,
                            px: 3,
                            py: 1
                        }}
                    >
                        Registrar mi primer inmueble
                    </Button>
                </Paper>
            )}

            {/* Modal for adding/editing inmueble */}
            <InmuebleFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSave={handleSave}
                initialData={editingInmueble}
                isFirstProperty={inmuebles.length === 0}
            />

            {/* Deletion guard confirmation dialog */}
            <Dialog open={Boolean(deleteTargetId)} onClose={() => setDeleteTargetId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle display="flex" alignItems="center" gap={1} color="#ef4444" fontWeight={700}>
                    <WarningAmberIcon /> Eliminar Inmueble
                </DialogTitle>
                <DialogContent>
                    {deleteGuardError ? (
                        <Alert severity="warning" sx={{ borderRadius: 2 }}>
                            {deleteGuardError}
                        </Alert>
                    ) : (
                        <Typography variant="body2" color="#334155">
                            ¿Estás seguro de que deseas eliminar este inmueble? Esta acción no se puede deshacer.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteTargetId(null)} variant="outlined" color="inherit" sx={{ textTransform: 'none', borderRadius: 2 }}>
                        {deleteGuardError ? 'Entendido' : 'Cancelar'}
                    </Button>
                    {!deleteGuardError && (
                        <Button
                            onClick={handleConfirmDelete}
                            variant="contained"
                            color="error"
                            disabled={actionLoadingId === deleteTargetId}
                            sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
                        >
                            Confirmar Eliminación
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Toast notification */}
            <Snackbar
                open={Boolean(toastMessage)}
                autoHideDuration={4000}
                onClose={() => setToastMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setToastMessage(null)} severity={toastSeverity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}
