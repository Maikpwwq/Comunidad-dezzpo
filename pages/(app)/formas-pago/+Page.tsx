/**
 * Formas de Pago (Payment Methods) Page
 *
 * ePayco integration scaffold for Colombian marketplace payments.
 * Role-adaptive: Propietarios see payment methods + pending contracts.
 * Comerciantes see earnings summary and payout configuration.
 *
 * Integration: ePayco Standard Checkout + Split Payments
 */
import React, { useState, useEffect } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import {
    Typography,
    Paper,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Divider,
    Snackbar,
    Box,
    Stack,
} from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PaymentsIcon from '@mui/icons-material/Payments'
import AddIcon from '@mui/icons-material/Add'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { navigate } from 'vike/client/router'

// Store & Auth
import { useUserStore } from '@stores/userStore'
import { useAuth } from '@hooks/useAuth'

// Services
import { getContractsByClient, getContractsByProvider } from '@services/contracts'
import type { ContractFirestoreDocument } from '@services/types'

// Environment
const EPAYCO_PUBLIC_KEY = import.meta.env.VITE_APP_EPAYCO_PUBLIC_KEY || ''

// Payment method type icons
const methodIcons: Record<string, React.ReactNode> = {
    'card': <CreditCardIcon fontSize="small" />,
    'pse': <AccountBalanceIcon fontSize="small" />,
    'cash': <PaymentsIcon fontSize="small" />,
}

// Supported payment methods in Colombia
const availableMethodTypes = [
    { type: 'card', label: 'Tarjeta Débito o Crédito', sublabel: 'Visa, Mastercard, American Express' },
    { type: 'pse', label: 'PSE (Transferencia bancaria)', sublabel: 'Todos los bancos en Colombia' },
    { type: 'cash', label: 'Efectivo', sublabel: 'Efecty, Baloto, puntos de corresponsal' },
]

// Status labels
const statusLabels: Record<string, { label: string; color: 'warning' | 'success' | 'info' | 'error' }> = {
    pending_payment: { label: 'Pendiente', color: 'warning' },
    active: { label: 'Activo', color: 'success' },
    completed: { label: 'Completado', color: 'info' },
    disputed: { label: 'Disputa', color: 'error' },
}

interface SavedPaymentMethod {
    id: string
    type: string
    last4?: string
    brand?: string
    addedAt: string
}

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const { currentUser } = useAuth()
    const userRole = currentUser?.role // 1=propietario, 2=comerciante

    const [savedMethods, _setSavedMethods] = useState<SavedPaymentMethod[]>([])
    const [contracts, setContracts] = useState<ContractFirestoreDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    const isEpaycoConfigured = !!EPAYCO_PUBLIC_KEY
    const isPropietario = userRole === 1
    const isComerciante = userRole === 2

    // Fetch contracts based on role
    useEffect(() => {
        const fetchData = async () => {
            if (!currentUserId) {
                setIsLoading(false)
                return
            }
            try {
                let data: ContractFirestoreDocument[] = []
                if (isPropietario) {
                    data = await getContractsByClient(currentUserId)
                } else if (isComerciante) {
                    data = await getContractsByProvider(currentUserId)
                }
                setContracts(data)
            } catch (err) {
                console.error('Error fetching contracts:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [currentUserId, isPropietario, isComerciante])

    const handleAddMethod = (type: string) => {
        if (!isEpaycoConfigured) {
            setSnackMessage('ePayco no está configurado. Agrega VITE_EPAYCO_PUBLIC_KEY al .env')
            setSnackOpen(true)
            return
        }
        setSnackMessage(`Integración de ${type} próximamente con ePayco`)
        setSnackOpen(true)
    }

    const handlePayContract = (contractId: string) => {
        navigate(`/app/contratacion?contractId=${contractId}`)
    }

    if (!currentUserId) {
        return (
            <Container fluid className="p-4">
                <Alert variant="warning">Debes iniciar sesión para gestionar tus métodos de pago.</Alert>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
            </Container>
        )
    }

    const pendingContracts = contracts.filter(c => c.status === 'pending_payment')
    const paidContracts = contracts.filter(c => c.status !== 'pending_payment')

    // Earnings calculation for comerciantes
    const totalEarnings = isComerciante
        ? contracts.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.agreedAmount, 0)
        : 0

    return (
        <Container fluid className="p-0">
            <div className="p-4" style={{ maxWidth: 900, margin: '0 auto' }}>
                <h1 className="type-hero-title">
                    {isPropietario ? 'Formas de Pago' : 'Gestión Financiera'}
                </h1>

                {!isEpaycoConfigured && (
                    <Alert variant="info" className="mt-3">
                        <strong>Modo desarrollo:</strong> Configura las variables de entorno de ePayco
                        (<code>VITE_EPAYCO_PUBLIC_KEY</code>, <code>VITE_EPAYCO_PRIVATE_KEY</code>)
                        para habilitar la integración de pagos.
                    </Alert>
                )}

                {/* Comerciante: Earnings Summary */}
                {isComerciante && (
                    <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: 'var(--background-light-gray-color)' }}>
                        <Typography variant="h6" gutterBottom>Resumen de Ingresos</Typography>
                        <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Total Acumulado</Typography>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--primary-green-text-color)' }}>
                                    ${totalEarnings.toLocaleString('es-CO')} COP
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Contratos Activos</Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {contracts.filter(c => c.status === 'active').length}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                )}

                {/* Propietario: Pending Payments */}
                {isPropietario && pendingContracts.length > 0 && (
                    <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: 2, border: '2px solid var(--primary-green-text-color)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <ReceiptLongIcon sx={{ color: 'var(--primary-green-text-color)' }} />
                            <Typography variant="h6">Pagos Pendientes</Typography>
                            <Chip label={pendingContracts.length} size="small" color="warning" />
                        </Box>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: 'var(--background-light-gray-color)' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acción</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingContracts.map((c) => (
                                    <TableRow key={c.contractId} hover>
                                        <TableCell>{c.objectDescription || c.draftId}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight={600} color="success.main">
                                                ${c.agreedAmount.toLocaleString('es-CO')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handlePayContract(c.contractId!)}
                                                sx={{
                                                    bgcolor: 'var(--primary-green-text-color)',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'var(--secondary-green-text-color)' },
                                                }}
                                            >
                                                PAGAR
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}

                {/* Saved Payment Methods */}
                <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Métodos Guardados
                    </Typography>
                    {savedMethods.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            No tienes métodos de pago guardados.
                        </Typography>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Detalles</TableCell>
                                    <TableCell>Agregado</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {savedMethods.map((method) => (
                                    <TableRow key={method.id}>
                                        <TableCell>
                                            <Chip
                                                icon={methodIcons[method.type] as any}
                                                label={method.brand || method.type}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {method.last4 ? `•••• ${method.last4}` : '—'}
                                        </TableCell>
                                        <TableCell>{method.addedAt}</TableCell>
                                        <TableCell>
                                            <Button size="small" color="error">Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Paper>

                {/* Add Payment Method */}
                <Paper elevation={1} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Agregar Método de Pago
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {availableMethodTypes.map((method) => (
                            <div
                                key={method.type}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {methodIcons[method.type]}
                                    <div>
                                        <Typography variant="body1" fontWeight={500}>
                                            {method.label}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {method.sublabel}
                                        </Typography>
                                    </div>
                                </div>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddMethod(method.type)}
                                    disabled={!isEpaycoConfigured}
                                >
                                    Agregar
                                </Button>
                            </div>
                        ))}
                    </div>
                </Paper>

                {/* Contract / Payment History */}
                <Paper elevation={1} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {isPropietario ? 'Historial de Pagos' : 'Historial de Contratos'}
                    </Typography>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'var(--background-light-gray-color)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Concepto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Monto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paidContracts.length > 0 ? (
                                paidContracts.map((c) => {
                                    const info = statusLabels[c.status] || { label: c.status, color: 'info' as const }
                                    return (
                                        <TableRow key={c.contractId} hover>
                                            <TableCell>{new Date(c.createdAt).toLocaleDateString('es-CO')}</TableCell>
                                            <TableCell>{c.objectDescription || c.draftId}</TableCell>
                                            <TableCell>${c.agreedAmount.toLocaleString('es-CO')}</TableCell>
                                            <TableCell>
                                                <Chip label={info.label} color={info.color} size="small" />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                            No hay transacciones registradas.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                <Snackbar
                    open={snackOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackOpen(false)}
                    message={snackMessage}
                />
            </div>
        </Container>
    )
}
