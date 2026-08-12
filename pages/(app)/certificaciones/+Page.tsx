/**
 * Certificaciones Page
 *
 * Labor competency certification module for Comerciantes.
 * Features:
 * - Role gating (Comerciantes only)
 * - Autocomplete category selection (ListadoCategorias)
 * - Date/time visit scheduling
 * - Upfront payment flow ($290.000 COP) via ePayco
 * - Request history tracking table
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import {
    Button,
    Box,
    TextField,
    Typography,
    Autocomplete,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PaymentIcon from '@mui/icons-material/Payment'

import { useUserStore } from '@stores/userStore'
import { PRICING } from '@config/pricing.config'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

import {
    createCertificationRequest,
    getCertificationRequestsByComerciante,
} from '@services/membershipAndCertService'
import { navigate } from 'vike/client/router'

const EPAYCO_PUBLIC_KEY = import.meta.env.VITE_APP_EPAYCO_PUBLIC_KEY || ''

const STATUS_CHIPS: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
    pending_payment: { label: 'Pago Pendiente', color: 'warning' },
    pending: { label: 'Pendiente de Revisión', color: 'info' },
    scheduled: { label: 'Visita Programada', color: 'primary' },
    evaluated: { label: 'Evaluado', color: 'secondary' },
    approved: { label: 'Aprobado', color: 'success' },
    rejected: { label: 'Rechazado', color: 'error' },
}

export default function Page() {
    // Auth & Role
    const isAuth = useUserStore((state) => state.isAuth)
    const userId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)
    const userEmail = useUserStore((state) => state.email)
    const userName = useUserStore((state) => state.displayName)

    // Form inputs
    const [certificationDate, setCertificationDate] = useState('')
    const [certificationHour, setCertificationHour] = useState('08:00')
    const [selectedCategory, setSelectedCategory] = useState<any>(null)

    // History and loading
    const [requests, setRequests] = useState<any[]>([])
    const [loadingHistory, setLoadingHistory] = useState(true)
    const [processingPayment, setProcessingPayment] = useState(false)

    // Feedback
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info'>('success')

    // Load request history
    const loadHistory = useCallback(async () => {
        if (!userId) return
        try {
            setLoadingHistory(true)
            const list = await getCertificationRequestsByComerciante(userId)
            setRequests(list)
        } catch (error) {
            console.error('Error loading request history:', error)
        } finally {
            setLoadingHistory(false)
        }
    }, [userId])

    useEffect(() => {
        if (isAuth && userRole === 2 && userId) {
            loadHistory()
        }
    }, [isAuth, userRole, userId, loadHistory])

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

    // Handler: Payment & Request Creation
    const handleRequestAndPay = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedCategory) {
            setSnackMessage('Por favor selecciona una especialidad para certificar.')
            setSnackSeverity('error')
            setSnackOpen(true)
            return
        }

        if (!certificationDate) {
            setSnackMessage('Por favor selecciona una fecha válida para la visita técnica.')
            setSnackSeverity('error')
            setSnackOpen(true)
            return
        }

        // Validate date in the future
        const chosenDate = new Date(`${certificationDate}T${certificationHour}`)
        if (chosenDate <= new Date()) {
            setSnackMessage('La fecha y hora de la visita técnica deben ser en el futuro.')
            setSnackSeverity('error')
            setSnackOpen(true)
            return
        }

        setProcessingPayment(true)

        try {
            // 1. Save Request in Firestore in 'pending_payment' state
            const reqId = await createCertificationRequest({
                comercianteId: userId!,
                category: selectedCategory.label,
                dateTime: chosenDate.toISOString(),
            })

            if (!reqId) {
                throw new Error('Error al registrar la solicitud en la base de datos.')
            }

            // 2. Generate signed payment payload from server
            const amount = PRICING.CERTIFICATION_SKILLS_VAL.amount
            const description = `${PRICING.CERTIFICATION_SKILLS_VAL.description} - ${selectedCategory.label}`

            const response = await fetch('/api/v1/payment/signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractId: `CERT-${reqId}`, // Prefix 'CERT' tells confirmation webhook this is a certification
                    amount,
                    description,
                    buyerEmail: userEmail || '',
                    buyerName: userName || '',
                    paymentStage: 'full_payment',
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al generar la firma del pago')
            }

            const { payload } = await response.json()

            // 3. Open ePayco checkout
            const ePayco = (window as any).ePayco
            if (!ePayco) {
                throw new Error('SDK de ePayco no cargado. Por favor recarga la página.')
            }

            const handler = ePayco.checkout.configure({
                key: payload.key,
                test: payload.test,
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

            setSnackMessage('Cargando pasarela de pago para la tasa de gestión...')
            setSnackSeverity('info')
            setSnackOpen(true)
            
            // Reload history to show the pending payment request
            setTimeout(() => loadHistory(), 2000)

        } catch (error: any) {
            console.error('Payment error:', error)
            setSnackMessage(error.message || 'Error al procesar el pago de la certificación.')
            setSnackSeverity('error')
            setSnackOpen(true)
        } finally {
            setProcessingPayment(false)
        }
    }

    // Role gating validation
    if (!isAuth) {
        return (
            <Container className="py-5 text-center">
                <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 500, mx: 'auto' }} variant="outlined">
                    <HowToRegIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Módulo de Certificación de Habilidades
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Por favor inicia sesión para agendar tu evaluación técnica y obtener tu insignia.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate('/ingreso')}>
                        INICIAR SESIÓN
                    </Button>
                </Paper>
            </Container>
        )
    }

    if (userRole !== 2) {
        return (
            <Container className="py-5 text-center">
                <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 500, mx: 'auto' }} variant="outlined">
                    <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
                        Acceso Restringido
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Este módulo está disponible exclusivamente para Comerciantes Calificados que deseen certificar sus competencias técnicas.
                    </Typography>
                </Paper>
            </Container>
        )
    }

    return (
        <Container className="py-5">
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" fontWeight={800} sx={{ color: '#0f766e', mb: 2 }}>
                    Evaluación y Certificación de Competencias
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
                    Demuestra tu profesionalismo. Nuestro proceso de evaluación presencial valida tu experiencia, herramientas e idoneidad técnica. Al aprobar, recibirás una insignia verificada en tu perfil y estatus destacado.
                </Typography>
            </Box>

            <Row className="g-4">
                {/* Request Form */}
                <Col xs={12} lg={5}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <CalendarMonthIcon sx={{ color: '#0f766e' }} />
                                <Typography variant="h6" fontWeight={700}>
                                    Agendar Visita de Evaluación
                                </Typography>
                            </Box>

                            <form onSubmit={handleRequestAndPay}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Autocomplete
                                        options={ListadoCategorias}
                                        getOptionLabel={(option) => option.label}
                                        value={selectedCategory}
                                        onChange={(_, newValue) => setSelectedCategory(newValue)}
                                        renderInput={(params) => {
                                            const { size, InputLabelProps, ...restParams } = params
                                            return (
                                                <TextField 
                                                    {...restParams} 
                                                    {...(size ? { size } : {})}
                                                    InputLabelProps={InputLabelProps as any}
                                                    label="Especialidad a Certificar" 
                                                    required 
                                                />
                                            )
                                        }}
                                    />

                                    <TextField
                                        label="Fecha de la Visita"
                                        type="date"
                                        value={certificationDate}
                                        onChange={(e) => setCertificationDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />

                                    <TextField
                                        label="Hora de la Visita"
                                        type="time"
                                        value={certificationHour}
                                        onChange={(e) => setCertificationHour(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />

                                    <Box sx={{ p: 2, bgcolor: '#f0fdfa', borderRadius: 2, border: '1px dashed #0d9488' }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Tasa de Gestión y Visita Técnica (Pago Previo)
                                        </Typography>
                                        <Typography variant="h5" fontWeight={800} color="#0f766e" sx={{ mt: 0.5 }}>
                                            ${PRICING.CERTIFICATION_SKILLS_VAL.amount.toLocaleString()} COP
                                        </Typography>
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={processingPayment}
                                        startIcon={<PaymentIcon />}
                                        sx={{ 
                                            bgcolor: '#0f766e', 
                                            '&:hover': { bgcolor: '#0d9488' },
                                            py: 1.5,
                                            borderRadius: 2
                                        }}
                                    >
                                        {processingPayment ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            'PAGAR Y SOLICITAR VISITA'
                                        )}
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Col>

                {/* History Table */}
                <Col xs={12} lg={7}>
                    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}>
                        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                                Historial de Solicitudes
                              </Typography>

                            {loadingHistory ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                                    <CircularProgress />
                                </Box>
                            ) : requests.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Typography color="text.secondary" variant="body2">
                                        No has solicitado certificaciones aún.
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <Table>
                                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Especialidad</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Fecha Propuesta</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Notas</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {requests.map((req) => (
                                                <TableRow key={req.requestId}>
                                                    <TableCell>{req.category}</TableCell>
                                                    <TableCell>{new Date(req.dateTime).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={STATUS_CHIPS[req.status]?.label || req.status}
                                                            color={STATUS_CHIPS[req.status]?.color || 'default'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: 200, fontSize: '0.8rem', color: 'text.secondary' }}>
                                                        {req.notes || '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Col>
            </Row>

            {/* Notifications */}
            <Snackbar
                open={snackOpen}
                autoHideDuration={6000}
                onClose={() => setSnackOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>

            <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Los datos de verificación laboral y documentos técnicos proporcionados se tratan bajo nuestro{' '}
                    <a
                        href="/legal?doc=aviso-privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}
                    >
                        Aviso de Privacidad
                    </a>{' '}
                    y la{' '}
                    <a
                        href="/legal?doc=politica-tratamiento-datos"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}
                    >
                        Política de Tratamiento de Datos
                    </a>.
                </Typography>
            </Box>
        </Container>
    )
}
