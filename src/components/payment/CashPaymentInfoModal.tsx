/**
 * CashPaymentInfoModal Component
 *
 * Informational modal explaining how Cash payments (Efecty, Baloto, Corresponsal) work.
 * Physical cash payments require no pre-registration or saved credentials.
 */

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Stack,
    Divider,
} from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

interface CashPaymentInfoModalProps {
    open: boolean
    onClose: () => void
}

export default function CashPaymentInfoModal({ open, onClose }: CashPaymentInfoModalProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentsIcon sx={{ color: 'var(--primary-green-text-color)' }} />
                Pago en Efectivo (Efecty, Baloto, Corresponsales)
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ mb: 3, textAlign: 'center', p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        ¡No requiere registro ni tarjetas!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Los pagos en efectivo se habilitan automáticamente en el momento exacto en que vas a pagar un contrato.
                    </Typography>
                </Box>

                <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <CheckCircleOutlineIcon sx={{ color: 'var(--primary-green-text-color)', mt: 0.3 }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">1. Selecciona Efectivo al Pagar</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Cuando tengas un contrato en estado "Pendiente de Pago", haz clic en PAGAR y elige la opción de Efectivo en la pasarela ePayco.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <PointOfSaleIcon sx={{ color: 'var(--primary-blue-light-color)', mt: 0.3 }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">2. Obtén tu PIN o Convenio de Pago</Typography>
                            <Typography variant="body2" color="text.secondary">
                                ePayco generará un código de referencia y número de convenio único para realizar tu pago en puntos físicos Efecty, Baloto, SuRed o Bancos.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <AccessTimeIcon sx={{ color: '#ff9800', mt: 0.3 }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">3. Vigencia del Pago</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tendrás hasta 48 horas para dirigirte a tu punto más cercano y realizar el depósito. Una vez cancelado, tu contrato se activa automáticamente.
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        bgcolor: 'var(--primary-green-text-color)',
                        color: 'white',
                        '&:hover': { bgcolor: 'var(--secondary-green-text-color)' },
                    }}
                >
                    Entendido
                </Button>
            </DialogActions>
        </Dialog>
    )
}
