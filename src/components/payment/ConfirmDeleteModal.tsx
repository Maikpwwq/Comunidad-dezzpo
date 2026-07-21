/**
 * ConfirmDeleteModal Component
 *
 * Confirmation dialog before deleting a saved payment method.
 */

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

interface ConfirmDeleteModalProps {
    open: boolean
    methodDetails: string
    isDeleting: boolean
    onClose: () => void
    onConfirm: () => void
}

export default function ConfirmDeleteModal({
    open,
    methodDetails,
    isDeleting,
    onClose,
    onConfirm,
}: ConfirmDeleteModalProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <WarningAmberIcon />
                Eliminar Método de Pago
            </DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">
                    ¿Estás seguro de que deseas eliminar <strong>{methodDetails}</strong>?
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Esta acción no se puede deshacer.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={isDeleting}>
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disabled={isDeleting}
                    startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
