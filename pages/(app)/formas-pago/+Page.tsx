/**
 * Formas de Pago (Payment Methods) Page
 *
 * ePayco integration for Colombian marketplace payments.
 * Role-adaptive: Propietarios see payment methods + pending contracts.
 * Comerciantes see earnings summary and payout configuration.
 *
 * Features:
 * - Saved payment methods management (Cards tokenized via ePayco SDK, PSE preferences)
 * - Modal triggers for adding cards, PSE bank preferences, and Cash payment info
 * - Default payment method management and deletion
 */
import React, { useState, useEffect, useCallback } from 'react'
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
    IconButton,
    Tooltip,
} from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PaymentsIcon from '@mui/icons-material/Payments'
import AddIcon from '@mui/icons-material/Add'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { navigate } from 'vike/client/router'

// Store & Auth
import { useUserStore } from '@stores/userStore'
import { useAuth } from '@hooks/useAuth'

// Services
import { getContractsByClient, getContractsByProvider } from '@services/contracts'
import {
    getPaymentMethods,
    deletePaymentMethod,
    setDefaultPaymentMethod,
} from '@services/paymentService'
import type { ContractFirestoreDocument, PaymentMethodFirestoreDocument } from '@services/types'

// Modals
import {
    AddCardModal,
    AddPsePreferenceModal,
    CashPaymentInfoModal,
    ConfirmDeleteModal,
} from '@components/payment'

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
    {
        type: 'card',
        label: 'Tarjeta Débito o Crédito',
        sublabel: 'Visa, Mastercard, American Express (Tokenizado seguro)',
        actionLabel: 'Agregar',
    },
    {
        type: 'pse',
        label: 'PSE (Transferencia bancaria)',
        sublabel: 'Guarda tu banco habitual y datos de facturación',
        actionLabel: 'Agregar',
    },
    {
        type: 'cash',
        label: 'Efectivo (Efecty, Baloto, Corresponsal)',
        sublabel: 'Generación de PIN en tiempo real durante el checkout de contrato',
        actionLabel: '¿Cómo funciona?',
    },
]

// Status labels
const statusLabels: Record<string, { label: string; color: 'warning' | 'success' | 'info' | 'error' }> = {
    pending_payment: { label: 'Pendiente', color: 'warning' },
    active: { label: 'Activo', color: 'success' },
    completed: { label: 'Completado', color: 'info' },
    disputed: { label: 'Disputa', color: 'error' },
}

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const { currentUser } = useAuth()
    const userRole = currentUser?.role // 1=propietario, 2=comerciante

    const [savedMethods, setSavedMethods] = useState<PaymentMethodFirestoreDocument[]>([])
    const [contracts, setContracts] = useState<ContractFirestoreDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // Modal Visibility States
    const [cardModalOpen, setCardModalOpen] = useState(false)
    const [pseModalOpen, setPseModalOpen] = useState(false)
    const [cashModalOpen, setCashModalOpen] = useState(false)
    
    // Deletion Modal State
    const [deleteTarget, setDeleteTarget] = useState<PaymentMethodFirestoreDocument | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const isEpaycoConfigured = !!EPAYCO_PUBLIC_KEY
    const isPropietario = userRole === 1
    const isComerciante = userRole === 2

    // Fetch contracts & payment methods
    const fetchData = useCallback(async () => {
        if (!currentUserId) {
            setIsLoading(false)
            return
        }
        try {
            let contractsData: ContractFirestoreDocument[] = []
            if (isPropietario) {
                contractsData = await getContractsByClient(currentUserId)
            } else if (isComerciante) {
                contractsData = await getContractsByProvider(currentUserId)
            }
            setContracts(contractsData)

            const methodsData = await getPaymentMethods(currentUserId)
            setSavedMethods(methodsData)
        } catch (err) {
            console.error('Error fetching financial data:', err)
        } finally {
            setIsLoading(false)
        }
    }, [currentUserId, isPropietario, isComerciante])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Open appropriate modal per method type
    const handleAddMethod = (type: string) => {
        if (type === 'card') {
            if (!isEpaycoConfigured) {
                setSnackMessage('ePayco no está configurado. Agrega VITE_APP_EPAYCO_PUBLIC_KEY al .env')
                setSnackOpen(true)
                return
            }
            setCardModalOpen(true)
        } else if (type === 'pse') {
            setPseModalOpen(true)
        } else if (type === 'cash') {
            setCashModalOpen(true)
        }
    }

    // Modal Success Handlers
    const handleCardAdded = (newMethod: PaymentMethodFirestoreDocument) => {
        setSavedMethods(prev => [newMethod, ...prev.map(m => newMethod.isDefault ? { ...m, isDefault: false } : m)])
        setSnackMessage('Tarjeta guardada exitosamente.')
        setSnackOpen(true)
    }

    const handlePseAdded = (newMethod: PaymentMethodFirestoreDocument) => {
        setSavedMethods(prev => [newMethod, ...prev.map(m => newMethod.isDefault ? { ...m, isDefault: false } : m)])
        setSnackMessage('Preferencia de banco PSE guardada.')
        setSnackOpen(true)
    }

    // Default payment method toggle
    const handleSetDefault = async (methodId: string) => {
        if (!currentUserId) return
        try {
            const success = await setDefaultPaymentMethod(currentUserId, methodId)
            if (success) {
                setSavedMethods(prev => prev.map(m => ({
                    ...m,
                    isDefault: m.id === methodId
                })))
                setSnackMessage('Método principal actualizado.')
                setSnackOpen(true)
            }
        } catch (err) {
            console.error('Error setting default payment method:', err)
        }
    }

    // Delete payment method execution
    const handleConfirmDelete = async () => {
        if (!currentUserId || !deleteTarget) return
        setIsDeleting(true)
        try {
            const success = await deletePaymentMethod(currentUserId, deleteTarget.id)
            if (success) {
                setSavedMethods(prev => prev.filter(m => m.id !== deleteTarget.id))
                setSnackMessage('Método de pago eliminado.')
                setSnackOpen(true)
            }
        } catch (err) {
            console.error('Error deleting payment method:', err)
        } finally {
            setIsDeleting(false)
            setDeleteTarget(null)
        }
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
                        (<code>VITE_APP_EPAYCO_PUBLIC_KEY</code>, <code>VITE_APP_EPAYCO_PRIVATE_KEY</code>)
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

                {/* Saved Payment Methods Section */}
                <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Métodos Guardados
                    </Typography>
                    {savedMethods.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            No tienes métodos de pago guardados o preferencias registradas. Agrega uno a continuación.
                        </Typography>
                    ) : (
                        <Table size="small">
                            <TableHead sx={{ bgcolor: 'var(--background-light-gray-color)' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Detalles / Titular</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Registrado</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {savedMethods.map((method) => (
                                    <TableRow key={method.id} hover>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Chip
                                                    icon={methodIcons[method.type] as any}
                                                    label={method.type === 'card' ? (method.brand || 'Tarjeta') : 'PSE'}
                                                    size="small"
                                                    variant="outlined"
                                                    color={method.type === 'card' ? 'primary' : 'secondary'}
                                                />
                                                {method.isDefault && (
                                                    <Chip
                                                        label="Principal"
                                                        size="small"
                                                        color="success"
                                                        sx={{ fontWeight: 'bold', height: 20, fontSize: '0.7rem' }}
                                                    />
                                                )}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {method.type === 'card' ? (
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        •••• {method.last4 || '****'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Vence: {method.expMonth}/{method.expYear} — {method.cardholderName || 'Titular'}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {method.bankName || 'Banco PSE'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {method.personType === 'J' ? 'Persona Jurídica' : 'Persona Natural'} ({method.docType} {method.docNumberMasked})
                                                    </Typography>
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(method.createdAt).toLocaleDateString('es-CO')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                {!method.isDefault && (
                                                    <Tooltip title="Establecer como principal">
                                                        <IconButton
                                                            size="small"
                                                            color="warning"
                                                            onClick={() => handleSetDefault(method.id)}
                                                        >
                                                            <StarBorderIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {method.isDefault && (
                                                    <Tooltip title="Método principal">
                                                        <IconButton size="small" color="warning" disabled>
                                                            <StarIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Eliminar método">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => setDeleteTarget(method)}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Paper>

                {/* Add Payment Method Section */}
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
                                    padding: '0.75rem 1rem',
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
                                    variant={method.type === 'cash' ? 'outlined' : 'contained'}
                                    startIcon={method.type === 'cash' ? <HelpOutlineIcon /> : <AddIcon />}
                                    onClick={() => handleAddMethod(method.type)}
                                    sx={method.type !== 'cash' ? {
                                        bgcolor: 'var(--primary-green-text-color)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'var(--secondary-green-text-color)' },
                                    } : {}}
                                >
                                    {method.actionLabel}
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

                {/* Modals */}
                <AddCardModal
                    open={cardModalOpen}
                    userId={currentUserId}
                    onClose={() => setCardModalOpen(false)}
                    onSuccess={handleCardAdded}
                />

                <AddPsePreferenceModal
                    open={pseModalOpen}
                    userId={currentUserId}
                    onClose={() => setPseModalOpen(false)}
                    onSuccess={handlePseAdded}
                />

                <CashPaymentInfoModal
                    open={cashModalOpen}
                    onClose={() => setCashModalOpen(false)}
                />

                <ConfirmDeleteModal
                    open={!!deleteTarget}
                    methodDetails={
                        deleteTarget?.type === 'card'
                            ? `Tarjeta ${deleteTarget.brand} •••• ${deleteTarget.last4}`
                            : `Preferencia PSE ${deleteTarget?.bankName}`
                    }
                    isDeleting={isDeleting}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleConfirmDelete}
                />

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
