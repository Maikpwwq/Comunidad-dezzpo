import { useEffect, useState } from 'react'
import { Container, Paper, Typography, Box, Button, CircularProgress } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'

interface TransactionData {
    x_cod_response: number
    x_transaction_state: string
    x_id_invoice: string
    x_amount: number
    x_ref_payco: number
    x_description: string
}

export default function Page() {
    const [loading, setLoading] = useState(true)
    const [transaction, setTransaction] = useState<TransactionData | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Extract ref_payco from URL search params
    const getRefPayco = (): string | null => {
        if (typeof window === 'undefined') return null
        const params = new URLSearchParams(window.location.search)
        return params.get('ref_payco')
    }

    useEffect(() => {
        const refPayco = getRefPayco()
        if (!refPayco) {
            setError('Referencia de pago no encontrada en la URL.')
            setLoading(false)
            return
        }

        async function fetchTransaction() {
            try {
                const response = await fetch(`https://secure.epayco.co/validation/v1/reference/${refPayco}`)
                if (!response.ok) {
                    throw new Error('Error consultando el estado de la transacción')
                }

                const result = await response.json()
                if (result.success && result.data) {
                    const data = result.data as TransactionData
                    setTransaction(data)

                    const isSuccess = Number(data.x_cod_response) === 1
                    
                    if (isSuccess) {
                        // Extract contractId from DEZZPO-{contractId}-{stage}
                        const parts = (data.x_id_invoice || '').split('-')
                        const contractId = parts[1] || ''

                        // Track conversion event on GA4/Firestore
                        import('@utils/analytics').then(({ trackCompletePayment }) => {
                            trackCompletePayment(contractId, Number(data.x_amount))
                        })
                    }
                } else {
                    throw new Error('No se encontraron detalles de la transacción')
                }
            } catch (err: any) {
                console.error('Error fetching transaction info:', err)
                setError(err.message || 'Error de conexión.')
            } finally {
                setLoading(false)
            }
        }

        fetchTransaction()
    }, [])

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <CircularProgress color="success" size={60} sx={{ mb: 4 }} />
                <Typography variant="h5" fontWeight={600} gutterBottom>
                    Procesando respuesta de pago
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Estamos verificando el estado de tu transacción con ePayco. Por favor espera un momento...
                </Typography>
            </Container>
        )
    }

    if (error || !transaction) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid #ffebeb' }} elevation={0}>
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 70, mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Error de Transacción
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {error || 'No pudimos validar la transacción con los servidores de ePayco.'}
                    </Typography>
                    <Button variant="contained" color="primary" href="/app/formas-pago" fullWidth sx={{ borderRadius: 25, py: 1.5 }}>
                        Volver a Formas de Pago
                    </Button>
                </Paper>
            </Container>
        )
    }

    const responseCode = Number(transaction.x_cod_response)
    const isApproved = responseCode === 1
    const isPending = responseCode === 3

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper 
                sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    borderRadius: 4, 
                    border: isApproved 
                        ? '1px solid #e8f5e9' 
                        : isPending 
                            ? '1px solid #fff3e0' 
                            : '1px solid #ffebeb',
                    bgcolor: isApproved 
                        ? 'linear-gradient(180deg, #f8fbf9 0%, #ffffff 100%)'
                        : isPending 
                            ? 'linear-gradient(180deg, #fffbf5 0%, #ffffff 100%)'
                            : 'linear-gradient(180deg, #fffafb 0%, #ffffff 100%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
                }} 
                elevation={0}
            >
                {isApproved ? (
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                ) : isPending ? (
                    <HourglassEmptyIcon color="warning" sx={{ fontSize: 80, mb: 2 }} />
                ) : (
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
                )}

                <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                    {isApproved ? '¡Pago Aprobado!' : isPending ? 'Pago Pendiente' : 'Pago Rechazado'}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {isApproved 
                        ? 'El pago se procesó con éxito. El contrato ya se encuentra activo y puedes comunicarte con el comerciante.' 
                        : isPending 
                            ? 'El pago está en proceso de verificación por la entidad financiera.' 
                            : 'La transacción no se pudo completar. Por favor intenta nuevamente o ponte en contacto con tu banco.'}
                </Typography>

                <Box sx={{ mb: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Referencia ePayco:</Typography>
                        <Typography variant="body2" fontWeight={600}>{transaction.x_ref_payco}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Factura:</Typography>
                        <Typography variant="body2" fontWeight={600}>{transaction.x_id_invoice}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Valor:</Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(transaction.x_amount)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Estado:</Typography>
                        <Typography variant="body2" fontWeight={600} color={isApproved ? 'success.main' : isPending ? 'warning.main' : 'error.main'}>
                            {transaction.x_transaction_state}
                        </Typography>
                    </Box>
                </Box>

                <Button 
                    variant="contained" 
                    color={isApproved ? 'success' : 'primary'} 
                    href="/app/formas-pago" 
                    fullWidth 
                    sx={{ borderRadius: 25, py: 1.5, fontWeight: 'bold' }}
                >
                    Ir a Mis Contratos
                </Button>
            </Paper>
        </Container>
    )
}
