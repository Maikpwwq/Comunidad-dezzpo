/**
 * Suscripciones Page
 * 
 * Displays gated subscription benefit plans.
 * Owners (role 1) see Propietario VIP with a data collection form.
 * Merchants (role 2) see Comerciante Membership with ePayco Checkout integration.
 * Guests see both with registration prompts.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import { 
    Button, 
    Typography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Box, 
    Alert, 
    Snackbar, 
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import BusinessIcon from '@mui/icons-material/Business'
import StarIcon from '@mui/icons-material/Star'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import HomeIcon from '@mui/icons-material/Home'
import DescriptionIcon from '@mui/icons-material/Description'

import { useUserStore } from '@stores/userStore'
import { PRICING } from '@config/pricing.config'
import { createInspectionRequest } from '@services/membershipAndCertService'
import { PropertySelector } from '@features/inmuebles'
import { navigate } from 'vike/client/router'


const EPAYCO_PUBLIC_KEY = (import.meta as any).env?.VITE_APP_EPAYCO_PUBLIC_KEY || ''

const beneficiosPropietarios = [
    { title: 'Servicio de inspección premium para tu inmueble.' },
    { title: 'Servicio 24 horas para urgencias del hogar.' },
    { title: 'Todos los servicios especializados de nuestra red.' },
    { title: 'Prioridad máxima al solicitar presupuestos y cotizaciones.' },
    { title: 'Garantía anti-fraude y acompañamiento Comunidad Dezzpo.' },
]

const beneficiosComerciantes = [
    { title: 'Ficha personalizada del perfil (proyectos, opiniones, portafolio y fotos).' },
    { title: 'Visualización de datos de contacto de clientes e historial de requerimientos.' },
    { title: 'Avisos instantáneos al correo y notificaciones en tiempo real.' },
    { title: 'Posicionamiento y optimización SEO del perfil público en Google.' },
    { title: 'Crédito mensual exclusivo para publicitar y destacar tu perfil.' },
    { title: 'Acceso a guías avanzadas de costeo y estructuración de presupuestos.' },
    { title: 'Insignia destacada de Comunidad Dezzpo en el directorio público.' },
]

export default function Page() {
    // Auth and Role details
    const isAuth = useUserStore((state) => state.isAuth)
    const userId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)
    const userEmail = useUserStore((state) => state.email)
    const userName = useUserStore((state) => state.displayName)

    // UI Feedback state
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'info'>('success')
    const [isPaying, setIsPaying] = useState(false)
    const [isSubmittingForm, setIsSubmittingForm] = useState(false)

    // Form state (Propietario VIP)
    const [openInspectionModal, setOpenInspectionModal] = useState(false)
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('Bogotá')
    const [postalCode, setPostalCode] = useState('')
    const [serviceScope, setServiceScope] = useState('')
    const [contactPhone, setContactPhone] = useState('')
    const [contactEmail, setContactEmail] = useState(userEmail || '')

    // Load ePayco SDK dynamically
    useEffect(() => {
        if (typeof window === 'undefined' || !EPAYCO_PUBLIC_KEY) return
        if (document.getElementById('epayco-sdk')) return

        const script = document.createElement('script')
        script.id = 'epayco-sdk'
        script.src = 'https://checkout.epayco.co/checkout.js'
        script.setAttribute('data-epayco-key', EPAYCO_PUBLIC_KEY)
        document.head.appendChild(script)
    }, [])

    // Update email state if user authenticates
    useEffect(() => {
        if (userEmail) {
            setContactEmail(userEmail)
        }
    }, [userEmail])

    // Handler: Comerciante Membership Checkout
    const handleComercianteCheckout = useCallback(async () => {
        if (!isAuth) {
            navigate('/ingreso')
            return
        }

        if (!userId) return

        setIsPaying(true)
        try {
            // Get price from central pricing config
            const amount = PRICING.COMERCIANTE_MEMBERSHIP_ANNUAL.amount
            const description = PRICING.COMERCIANTE_MEMBERSHIP_ANNUAL.description

            // 1. Get signed checkout payload from server
            const response = await fetch('/api/v1/payment/signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contractId: `SUB-${userId}`, // Prefix 'SUB' tells confirmation webhook this is a subscription
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

            // 2. Configure and open ePayco Checkout
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
        } catch (err: any) {
            console.error('Subscription error:', err)
            setSnackMessage(err.message || 'Error al iniciar el checkout')
            setSnackSeverity('error')
            setSnackOpen(true)
        } finally {
            setIsPaying(false)
        }
    }, [isAuth, userId, userEmail, userName])

    // Handler: Submit Propietario VIP Inspection
    const handleInspectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isAuth || !userId) {
            navigate('/ingreso')
            return
        }

        if (!address.trim() || !city.trim() || !serviceScope.trim() || !contactPhone.trim() || !contactEmail.trim()) {
            setSnackMessage('Por favor completa todos los campos requeridos.')
            setSnackSeverity('error')
            setSnackOpen(true)
            return
        }

        setIsSubmittingForm(true)
        try {
            const requestId = await createInspectionRequest({
                propietarioId: userId,
                propertyDetails: {
                    name: 'Inmueble VIP ' + address.slice(0, 15),
                    address,
                    city,
                    postalCode,
                },
                serviceScope,
                contactPhone,
                contactEmail,
            })

            if (requestId) {
                setSnackMessage('¡Solicitud de Inspección Técnica guardada con éxito! Nos comunicaremos contigo.')
                setSnackSeverity('success')
                setSnackOpen(true)
                setOpenInspectionModal(false)
                
                // Clear fields
                setAddress('')
                setPostalCode('')
                setServiceScope('')
                setContactPhone('')
            } else {
                throw new Error('Error al registrar la solicitud')
            }
        } catch (error: any) {
            console.error('Inspection submit error:', error)
            setSnackMessage(error.message || 'Ocurrió un error inesperado al procesar tu solicitud.')
            setSnackSeverity('error')
            setSnackOpen(true)
        } finally {
            setIsSubmittingForm(false)
        }
    }

    // Role conditional rendering
    const showOwnerCard = !isAuth || userRole === 1
    const showMerchantCard = !isAuth || userRole === 2

    return (
        <Container className="py-5">
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h3" fontWeight={800} sx={{ 
                    background: 'linear-gradient(90deg, #0f766e 0%, #0d9488 100%)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    mb: 2 
                }}>
                    Membresías y Beneficios Premium
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
                    Desbloquea el máximo potencial de la Comunidad Dezzpo con nuestros planes adaptados a tus necesidades.
                </Typography>
            </Box>

            <Row className="justify-content-center g-4">
                {/* Owners Column */}
                {showOwnerCard && (
                    <Col xs={12} md={showMerchantCard ? 6 : 8} lg={showMerchantCard ? 5 : 6}>
                        <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 4, 
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <Box sx={{ p: 4, background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', textAlign: 'center' }}>
                                <WorkspacePremiumIcon sx={{ fontSize: 50, color: '#0f766e', mb: 1 }} />
                                <Typography variant="h5" fontWeight={700} color="#0f766e">
                                    Propietario VIP +Plus
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Inspección técnica y soporte preventivo
                                </Typography>
                            </Box>
                            
                            <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                <List>
                                    {beneficiosPropietarios.map((item, index) => (
                                        <ListItem key={index} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                                <CheckCircleIcon sx={{ color: '#0d9488', fontSize: 20 }} />
                                            </ListItemIcon>
                                            <ListItemText primary={item.title} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>

                            <Box sx={{ p: 4, pt: 0 }}>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    sx={{ 
                                        borderRadius: 2, 
                                        py: 1.5, 
                                        bgcolor: '#0f766e', 
                                        '&:hover': { bgcolor: '#0d9488' } 
                                    }}
                                    onClick={() => {
                                        if (!isAuth) {
                                            navigate('/ingreso')
                                        } else {
                                            setOpenInspectionModal(true)
                                        }
                                    }}
                                >
                                    {isAuth ? 'SOLICITAR INSPECCIÓN' : 'INICIAR SESIÓN'}
                                </Button>
                            </Box>
                        </Card>
                    </Col>
                )}

                {/* Merchants Column */}
                {showMerchantCard && (
                    <Col xs={12} md={showOwnerCard ? 6 : 8} lg={showOwnerCard ? 5 : 6}>
                        <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: 4, 
                            border: '2px solid',
                            borderColor: '#0d9488',
                            boxShadow: '0 10px 30px rgba(13, 148, 136, 0.08)',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <Box sx={{ p: 4, background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)', textAlign: 'center', color: '#fff' }}>
                                <BusinessIcon sx={{ fontSize: 50, color: '#ccfbf1', mb: 1 }} />
                                <Typography variant="h5" fontWeight={700}>
                                    Comerciante Calificado
                                </Typography>
                                <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                                    $150.000 <Typography component="span" variant="subtitle2">COP / año</Typography>
                                </Typography>
                            </Box>
                            
                            <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                <List>
                                    {beneficiosComerciantes.map((item, index) => (
                                        <ListItem key={index} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                                <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                                            </ListItemIcon>
                                            <ListItemText primary={item.title} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>

                            <Box sx={{ p: 4, pt: 0 }}>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    disabled={isPaying}
                                    sx={{ 
                                        borderRadius: 2, 
                                        py: 1.5, 
                                        bgcolor: '#0d9488', 
                                        '&:hover': { bgcolor: '#0f766e' } 
                                    }}
                                    onClick={handleComercianteCheckout}
                                >
                                    {isPaying ? (
                                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                                    ) : isAuth ? (
                                        'SUSCRIBIRSE AHORA'
                                    ) : (
                                        'INICIAR SESIÓN'
                                    )}
                                </Button>
                            </Box>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Propietario VIP Modal Form */}
            <Dialog 
                open={openInspectionModal} 
                onClose={() => setOpenInspectionModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <form onSubmit={handleInspectionSubmit}>
                    <DialogTitle sx={{ pb: 1, fontWeight: 700, color: '#0f766e' }}>
                        Solicitud de Inspección Propietario VIP
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Ingresa los detalles del inmueble a inspeccionar. Nuestro equipo evaluará y agendará una visita técnica preventiva.
                        </Typography>
                        
                        <Row className="g-3">
                            <Col xs={12}>
                                {isAuth && userId ? (
                                    <PropertySelector
                                        propietarioId={userId}
                                        label="Selecciona el inmueble a inspeccionar *"
                                        onSelectInmueble={(inmueble) => {
                                            if (inmueble) {
                                                setAddress(inmueble.direccion)
                                                setCity(inmueble.ciudad)
                                                setPostalCode(inmueble.codigoPostal || '')
                                            }
                                        }}
                                    />
                                ) : null}
                            </Col>
                            <Col xs={12}>
                                <TextField
                                    fullWidth
                                    label="Dirección del Inmueble *"
                                    placeholder="Ej. Calle 123 # 45-67 Apto 101"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    size="small"
                                    InputProps={{
                                        startAdornment: <HomeIcon sx={{ color: 'action.active', mr: 1 }} />
                                    }}
                                />
                            </Col>
                            <Col xs={6}>
                                <TextField
                                    fullWidth
                                    label="Ciudad *"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    size="small"
                                />
                            </Col>
                            <Col xs={6}>
                                <TextField
                                    fullWidth
                                    label="Código Postal (Opcional)"
                                    placeholder="Ej. 110111"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    size="small"
                                />
                            </Col>
                            <Col xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Alcance del Servicio / Estado del Inmueble"
                                    placeholder="Cuéntanos brevemente qué deseas revisar o qué mantenimiento requiere el inmueble..."
                                    value={serviceScope}
                                    onChange={(e) => setServiceScope(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <DescriptionIcon sx={{ color: 'action.active', mr: 1, mt: 1 }} />
                                    }}
                                />
                            </Col>
                            <Col xs={12}>
                                <TextField
                                    fullWidth
                                    label="Número de Contacto"
                                    placeholder="Ej. 3001234567"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <LocalPhoneIcon sx={{ color: 'action.active', mr: 1 }} />
                                    }}
                                />
                            </Col>
                            <Col xs={12}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Correo de Contacto"
                                    placeholder="correo@ejemplo.com"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    required
                                    InputProps={{
                                        startAdornment: <MailOutlineIcon sx={{ color: 'action.active', mr: 1 }} />
                                    }}
                                />
                            </Col>
                        </Row>
                    </DialogContent>
                    
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        <Button onClick={() => setOpenInspectionModal(false)}>Cancelar</Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={isSubmittingForm}
                            sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#0d9488' } }}
                        >
                            {isSubmittingForm ? <CircularProgress size={20} color="inherit" /> : 'ENVIAR SOLICITUD'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Notification Snackbar */}
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
        </Container>
    )
}
