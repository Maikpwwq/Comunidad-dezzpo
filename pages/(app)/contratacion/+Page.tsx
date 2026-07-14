/**
 * Contratación — ePayco Checkout Page
 *
 * Payment gateway for Dezzpo contracts.
 * Reads contractId from URL, fetches contract summary,
 * and triggers ePayco Standard Checkout with server-signed payload.
 *
 * Flow:
 * 1. Read contractId from ?contractId=XYZ
 * 2. Fetch contract via getContract(contractId)
 * 3. Display contract summary (service, provider, amount)
 * 4. "PAGAR" calls /api/v1/payment/signature for server-side sig
 * 5. Opens ePayco Standard Checkout with signed payload
 */
import { useState, useEffect, useCallback } from 'react'
import { Container, Spinner, Alert } from 'react-bootstrap'
import {
    Typography,
    Paper,
    Button,
    Divider,
    Snackbar,
    Box,
    Chip,
    Stack,
} from '@mui/material'
import PaymentIcon from '@mui/icons-material/Payment'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PersonIcon from '@mui/icons-material/Person'
import DescriptionIcon from '@mui/icons-material/Description'
import SecurityIcon from '@mui/icons-material/Security'
import { navigate } from 'vike/client/router'

// Services
import { getContract } from '@services/contracts'
import { useUserStore } from '@stores/userStore'
import type { ContractFirestoreDocument } from '@services/types'

// ePayco public key for SDK loading
const EPAYCO_PUBLIC_KEY = import.meta.env.VITE_APP_EPAYCO_PUBLIC_KEY || ''

// Status labels in Spanish
const statusLabels: Record<string, { label: string; color: 'warning' | 'success' | 'info' | 'error' }> = {
    pending_payment: { label: 'Pendiente de Pago', color: 'warning' },
    active: { label: 'Activo', color: 'success' },
    completed: { label: 'Completado', color: 'info' },
    disputed: { label: 'En Disputa', color: 'error' },
}

export default function Page() {
    const currentUserId = useUserStore((state) => state.userId)
    const userEmail = useUserStore((state) => state.email)
    const userName = useUserStore((state) => state.displayName)

    const [contractId, setContractId] = useState<string | null>(null)
    const [contract, setContract] = useState<ContractFirestoreDocument | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPaying, setIsPaying] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // Parse contractId from URL
    useEffect(() => {
        if (typeof window === 'undefined') return
        const params = new URLSearchParams(window.location.search)
        setContractId(params.get('contractId'))
    }, [])

    // Fetch contract data
    useEffect(() => {
        const fetchContract = async () => {
            if (!contractId) {
                setIsLoading(false)
                return
            }
            try {
                const data = await getContract(contractId)
                if (data) {
                    setContract(data)
                } else {
                    setError('Contrato no encontrado')
                }
            } catch (err) {
                console.error('Error fetching contract:', err)
                setError('Error al cargar el contrato')
            } finally {
                setIsLoading(false)
            }
        }
        fetchContract()
    }, [contractId])

    // Load ePayco SDK
    useEffect(() => {
        if (typeof window === 'undefined' || !EPAYCO_PUBLIC_KEY) return
        if (document.getElementById('epayco-sdk')) return

        const script = document.createElement('script')
        script.id = 'epayco-sdk'
        script.src = 'https://checkout.epayco.co/checkout.js'
        script.setAttribute('data-epayco-key', EPAYCO_PUBLIC_KEY)
        document.head.appendChild(script)
    }, [])

    // Handle payment with ePayco
    const handlePay = useCallback(async () => {
        if (!contract || !contractId) return

        const chargeAmount = contract.paymentStage === 'deposit' && contract.depositAmount ? contract.depositAmount : contract.agreedAmount

        setIsPaying(true)
        try {
            // 1. Get server-signed payload
            const response = await fetch('/api/v1/payment/signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractId,
                    amount: chargeAmount,
                    description: contract.objectDescription || 'Servicio Comunidad Dezzpo',
                    buyerEmail: userEmail || '',
                    buyerName: userName || '',
                    paymentStage: contract.paymentStage || 'full_payment',
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error generando firma de pago')
            }

            const { payload } = await response.json()

            // 2. Open ePayco Standard Checkout
            const ePayco = (window as any).ePayco
            if (!ePayco) {
                throw new Error('ePayco SDK no cargado. Recarga la página.')
            }

            const handler = ePayco.checkout.configure({
                key: payload.key,
                test: payload.test,
            })

            // Track payment initiation event
            import('@utils/analytics').then(({ trackCreateContract }) => {
                trackCreateContract(contractId, chargeAmount, contract.providerId)
            })

            handler.open({
                name: payload.name,
                description: payload.description,
                invoice: payload.invoice,
                currency: payload.currency,
                amount: payload.amount,
                tax_base: payload.tax_base,
                tax: payload.tax,
                country: payload.country,
                lang: payload.lang,
                external: payload.external,
                response: payload.response,
                confirmation: payload.confirmation,
                email_billing: payload.email_billing,
                name_billing: payload.name_billing,
            })
        } catch (err: any) {
            console.error('Payment error:', err)
            setSnackMessage(err.message || 'Error al procesar el pago')
            setSnackOpen(true)
        } finally {
            setIsPaying(false)
        }
    }, [contract, contractId, userEmail, userName])

    // ── Render ────────────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <Container fluid className="p-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Cargando datos del contrato...</p>
            </Container>
        )
    }

    if (error || !contractId) {
        return (
            <Container fluid className="p-4">
                <Alert variant="danger">{error || 'Falta el ID del contrato'}</Alert>
                <Button
                    className="btn-round btn-low mt-3"
                    onClick={() => navigate('/app/requerimientos')}
                >
                    Ir a requerimientos
                </Button>
            </Container>
        )
    }

    if (!contract) return null

    const statusInfo = statusLabels[contract.status] || { label: contract.status, color: 'info' as const }
    const isPendingPayment = contract.status === 'pending_payment'
    const isOwner = currentUserId === contract.clientId

    return (
        <Container fluid className="p-0">
            <div className="p-4" style={{ maxWidth: 800, margin: '0 auto' }}>
                <h1 className="type-hero-title">Contrato de Servicios</h1>

                {/* Contract Summary */}
                <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ReceiptLongIcon /> Resumen del Contrato
                        </Typography>
                        <Chip
                            label={statusInfo.label}
                            color={statusInfo.color}
                            size="small"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={2.5}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <DescriptionIcon sx={{ color: 'var(--primary-green-text-color)', mt: 0.3 }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Descripción del servicio</Typography>
                                <Typography variant="body1">{contract.objectDescription || 'Sin descripción'}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <PersonIcon sx={{ color: 'var(--primary-blue-light-color)', mt: 0.3 }} />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Proveedor (Comerciante)</Typography>
                                <Typography variant="body1">{contract.providerId}</Typography>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ textAlign: 'center', py: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Monto Acordado
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: 'var(--primary-green-text-color)' }}>
                                ${contract.agreedAmount.toLocaleString('es-CO')} COP
                            </Typography>
                            {contract.paymentStage === 'deposit' && contract.depositAmount && (
                                <Typography variant="subtitle1" color="warning.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                                    (Pago actual: Anticipo de ${contract.depositAmount.toLocaleString('es-CO')} COP)
                                </Typography>
                            )}
                        </Box>
                    </Stack>
                </Paper>

                {/* Payment Action */}
                {isPendingPayment && isOwner && (
                    <Paper elevation={1} sx={{ p: 3, mt: 2, borderRadius: 2, bgcolor: 'var(--background-light-gray-color)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <SecurityIcon sx={{ color: 'var(--primary-green-text-color)' }} />
                            <Typography variant="body2" color="text.secondary">
                                Pago procesado de forma segura por ePayco. Tu información financiera está protegida.
                            </Typography>
                        </Box>

                        {!EPAYCO_PUBLIC_KEY && (
                            <Alert variant="warning" className="mb-3">
                                ePayco no está configurado. Contacta al administrador.
                            </Alert>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<PaymentIcon />}
                            onClick={handlePay}
                            disabled={isPaying || !EPAYCO_PUBLIC_KEY}
                            sx={{
                                bgcolor: 'var(--primary-green-text-color)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                py: 1.5,
                                borderRadius: 2,
                                '&:hover': { bgcolor: 'var(--secondary-green-text-color)' },
                            }}
                        >
                            {isPaying ? 'Procesando...' : `PAGAR $${(contract.paymentStage === 'deposit' && contract.depositAmount ? contract.depositAmount : contract.agreedAmount).toLocaleString('es-CO')} COP`}
                        </Button>
                    </Paper>
                )}

                {/* Already paid notice */}
                {!isPendingPayment && (
                    <Paper elevation={1} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                        <Typography variant="body1" textAlign="center" color="text.secondary">
                            {contract.status === 'active' && '✅ El pago ha sido procesado. El contrato está activo.'}
                            {contract.status === 'completed' && '✅ Este contrato ha sido completado exitosamente.'}
                            {contract.status === 'disputed' && '⚠️ Este contrato está en disputa. Contacta soporte.'}
                        </Typography>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                className="btn-round btn-low"
                                onClick={() => navigate('/app/historial-servicios')}
                            >
                                Ver historial de servicios
                            </Button>
                        </Box>
                    </Paper>
                )}

                <Snackbar
                    open={snackOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackOpen(false)}
                    message={snackMessage}
                />
            </div>
        </Container>
    )
}
