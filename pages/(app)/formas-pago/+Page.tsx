/**
 * Formas de Pago (Payment Methods) Page
 *
 * ePayco integration scaffold for Colombian marketplace payments.
 * Uses ePayco.js tokenizer for PCI-compliant card tokenization.
 *
 * WHY ePayco over MercadoPago:
 * - Native Split Payments API for marketplace commission distribution
 * - Lower base commission: ~2.99% + $900 COP vs MercadoPago's ~3.49% + $900 COP
 * - Colombian company with deep local payment method support (PSE, Nequi, Daviplata, Efecty)
 * - Built-in anti-fraud module (ePayco Control)
 * - Simpler split payment activation (no OAuth per seller)
 *
 * Integration flow:
 * 1. Load ePayco.js script from CDN
 * 2. Initialize with public key: ePayco.checkout.configure({ key: VITE_EPAYCO_PUBLIC_KEY })
 * 3. Tokenize card: ePayco.token.create(cardInfo) → returns token
 * 4. Store token in Firestore: users/{uid}/paymentMethods subcollection
 * 5. On payment: use token + ePayco Split Payments API server-side
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
} from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import PaymentsIcon from '@mui/icons-material/Payments'
import AddIcon from '@mui/icons-material/Add'

// Store
import { useUserStore } from '@stores/userStore'

// Environment
const EPAYCO_PUBLIC_KEY = import.meta.env.VITE_EPAYCO_PUBLIC_KEY || ''
// Note: VITE_EPAYCO_TEST env var will be consumed when ePayco integration is complete

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

interface SavedPaymentMethod {
    id: string
    type: string
    last4?: string
    brand?: string
    addedAt: string
}

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const [savedMethods, _setSavedMethods] = useState<SavedPaymentMethod[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // Check if ePayco is configured
    const isEpaycoConfigured = !!EPAYCO_PUBLIC_KEY

    useEffect(() => {
        // TODO: Fetch saved payment methods from users/{uid}/paymentMethods subcollection
        // For now, show empty state
        setIsLoading(false)
    }, [currentUserId])

    const handleAddMethod = (type: string) => {
        if (!isEpaycoConfigured) {
            setSnackMessage('ePayco no está configurado. Agrega VITE_EPAYCO_PUBLIC_KEY al .env')
            setSnackOpen(true)
            return
        }

        // TODO: Integration point for ePayco tokenizer
        // 1. Load ePayco.js: <script src="https://checkout.epayco.co/checkout.js" />
        // 2. Call: var handler = ePayco.checkout.configure({ key: EPAYCO_PUBLIC_KEY, test: EPAYCO_TEST_MODE })
        // 3. For card tokenization: handler.open({ ... cardData })
        // 4. On success callback: save token to Firestore subcollection

        setSnackMessage(`Integración de ${type} próximamente con ePayco`)
        setSnackOpen(true)
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

    return (
        <Container fluid className="p-0">
            <div className="p-4" style={{ maxWidth: 900, margin: '0 auto' }}>
                <h1 className="type-hero-title">Formas de Pago</h1>

                {!isEpaycoConfigured && (
                    <Alert variant="info" className="mt-3">
                        <strong>Modo desarrollo:</strong> Configura las variables de entorno de ePayco
                        (<code>VITE_EPAYCO_PUBLIC_KEY</code>, <code>VITE_EPAYCO_PRIVATE_KEY</code>)
                        para habilitar la integración de pagos.
                    </Alert>
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

                {/* Payment History */}
                <Paper elevation={1} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Historial de Pagos
                    </Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Concepto</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                        No hay transacciones registradas.
                                    </Typography>
                                </TableCell>
                            </TableRow>
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
