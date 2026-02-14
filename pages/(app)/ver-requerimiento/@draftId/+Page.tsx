import React, { useState, useEffect } from 'react'
import { navigate } from 'vike/client/router'
// Hooks
import { usePageContext } from '@hooks/usePageContext'
import { useAuth } from '@hooks/useAuth'
// Services
import { getDraft } from '@services/drafts'
import { getQuotation } from '@services/quotations'
import type { DraftFirestoreDocument, QuotationFirestoreDocument } from '@services/types'
// Components
import TablaSubCategoriaPresupuesto from '../../requerimiento/components/TablaSubCategoriaPresupuesto'
// MUI
import {
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Box,
    Divider,
    Stack,
    Chip,
    Avatar,
    Container
} from '@mui/material'
// Icons
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import VisibilityIcon from '@mui/icons-material/Visibility'
import WorkIcon from '@mui/icons-material/Work'
import EditIcon from '@mui/icons-material/Edit'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EventIcon from '@mui/icons-material/Event'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
// CSS

export default function Page() {
    const { currentUser } = useAuth()
    const userAuthID = currentUser?.userId
    const rolAuth = currentUser?.role
    const pageContext = usePageContext()
    const { draftId } = pageContext.routeParams
    const [isLoaded, setIsLoaded] = useState(false)

    interface CotizacionesState {
        appliedQuotations: QuotationFirestoreDocument[]
    }
    const [cotizacionesInfo, setCotizacionesInfo] = useState<CotizacionesState>({
        appliedQuotations: [],
    })
    const [requerimientoInfo, setRequerimientoInfo] = useState<Omit<Partial<DraftFirestoreDocument>, 'draftSubCategory'> & {
        draftName: string
        draftCategory: string
        draftSubCategory: any[]
        draftTotal: number
        draftApply: string[]
    }>({
        draftName: '',
        draftCategory: '',
        draftSubCategory: [],
        draftTotal: 0,
        draftApply: [] as string[],
    })

    const fetchDraftData = async () => {
        if (!draftId) return;
        try {
            const draft = await getDraft({ draftId });
            if (draft) {
                setRequerimientoInfo(prev => ({
                    ...prev,
                    ...draft,
                    draftSubCategory: (draft.draftSubCategory as any) || [],
                    draftTotal: typeof draft.draftTotal === 'string' ? parseFloat(draft.draftTotal) : (draft.draftTotal || 0),
                    draftApply: draft.draftApply && Array.isArray(draft.draftApply) ? draft.draftApply : []
                } as any));

                const appliedQuotationIds = draft.draftApply || []
                const firstQuotationId = appliedQuotationIds.length > 0 ? appliedQuotationIds[0] : null
                if (firstQuotationId) {
                    try {
                        const response = await getQuotation({ quotationId: firstQuotationId });
                        if (response.success && response.data) {
                            setCotizacionesInfo(prev => ({
                                ...prev,
                                appliedQuotations: [response.data!],
                            }));
                        }
                    } catch (e) {
                        console.error('Error fetching quotation', e)
                    }
                }
                setIsLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching draft:', error);
        }
    };

    useEffect(() => {
        if (!isLoaded && draftId) {
            fetchDraftData();
        }
    }, [draftId, isLoaded]);

    const handleDescargarAdjuntos = () => { }
    const handleSeeQuotation = (e: React.MouseEvent, quotationId: string) => {
        e.preventDefault()
        navigate(`/app/ver-cotizacion/${quotationId}`)
    }
    const handleEditQuotation = (e: React.MouseEvent, quotationId: string) => {
        e.preventDefault()
        navigate(`/app/editar-cotizacion/${quotationId}`)
    }
    const handleHire = (e: React.MouseEvent, quotationId: string, proponentId: string) => {
        e.preventDefault()
        navigate(`/app/contratar?draftId=${draftId}&quotationId=${quotationId}&proponentId=${proponentId}`)
    }
    const handleCotizar = () => {
        const draftParamId = requerimientoInfo.draftId || draftId
        navigate(`/app/cotizacion/${draftParamId}`)
    }

    // Helper for key-value display
    const InfoRow = ({ label, value, icon }: { label: string, value: React.ReactNode, icon?: React.ReactNode }) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            {icon && <Box sx={{ color: 'var(--primary-green-text-color)', mr: 1, mt: 0.5 }}>{icon}</Box>}
            <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {label}
                </Typography>
                <Typography variant="body1" color="text.primary">
                    {value || '-'}
                </Typography>
            </Box>
        </Box>
    )

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--primary-titles-text-color)', fontWeight: 'bold' }}>
                        Detalle Requerimiento
                    </Typography>
                    <Chip
                        label={requerimientoInfo.draftCategory || 'General'}
                        color="primary"
                        variant="outlined"
                        sx={{ borderColor: 'var(--primary-green-text-color)', color: 'var(--primary-green-text-color)', fontWeight: 600 }}
                    />
                </Box>
                <Button
                    variant="contained"
                    startIcon={<QuestionAnswerIcon />}
                    sx={{
                        bgcolor: 'var(--primary-blue-light-color)',
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': { bgcolor: 'var(--background-blue-color)' }
                    }}
                >
                    PREGUNTAR AL PROPIETARIO
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Left Column: Service Information */}
                <Grid item xs={12} md={7} lg={8}>
                    {/* Main Info Card */}
                    <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardHeader
                            title="Información del Servicio"
                            avatar={<WorkIcon sx={{ color: 'white' }} />}
                            sx={{
                                bgcolor: 'var(--logo-comunidad-dezzpo-color)',
                                color: 'white',
                                '& .MuiCardHeader-title': { fontWeight: 'bold', fontSize: '1.25rem' }
                            }}
                        />
                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{ bgcolor: 'var(--background-nav-bar-sigmi-color)', p: 2, borderRadius: 2, mb: 3 }}>
                                        <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            {requerimientoInfo.draftName}
                                        </Typography>
                                        <InfoRow label="Descripción" value={requerimientoInfo.draftDescription} />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InfoRow
                                        icon={<AttachMoneyIcon />}
                                        label="Presupuesto Total"
                                        value={
                                            <Typography variant="h5" color="success.main" fontWeight="bold">
                                                ${requerimientoInfo.draftTotal?.toLocaleString()}
                                            </Typography>
                                        }
                                    />
                                    <InfoRow
                                        label="Tipo de Proyecto"
                                        value={requerimientoInfo.draftProject}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoRow label="Propietario" value={requerimientoInfo.draftPropietarioResidente} />
                                    <InfoRow label="Categoría" value={requerimientoInfo.draftCategory} />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" gutterBottom sx={{ color: 'var(--primary-titles-text-color)', display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOnIcon sx={{ mr: 1, color: 'var(--secondary-blue-text-color)' }} /> Ubicación
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">Ciudad</Typography>
                                    <Typography variant="body1" fontWeight={500}>{requerimientoInfo.draftCity}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">Dirección</Typography>
                                    <Typography variant="body1" fontWeight={500}>{requerimientoInfo.draftDirection}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary">Código Postal</Typography>
                                    <Typography variant="body1" fontWeight={500}>{requerimientoInfo.draftPostalCode}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Breakdown Table */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'var(--primary-titles-text-color)', mb: 2 }}>
                            Desglose de Costos
                        </Typography>
                        <TablaSubCategoriaPresupuesto
                            draftSubCategory={requerimientoInfo.draftSubCategory}
                            draftTotal={requerimientoInfo.draftTotal}
                        />
                    </Box>
                </Grid>

                {/* Right Column: Details & Times */}
                <Grid item xs={12} md={5} lg={4}>
                    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'sticky', top: 24 }}>
                        <CardHeader
                            title="Detalles y Tiempos"
                            avatar={<EventIcon sx={{ color: 'white' }} />}
                            sx={{
                                bgcolor: 'var(--background-dark-blue-color)',
                                color: 'white',
                                '& .MuiCardHeader-title': { fontWeight: 'bold', fontSize: '1.25rem' }
                            }}
                        />
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'var(--primary-titles-text-color)', borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                                    Programación
                                </Typography>
                                <Stack spacing={2}>
                                    <InfoRow label="Fecha de Publicación" value={requerimientoInfo.draftCreatedAt || requerimientoInfo.draftCreated} />
                                    <InfoRow label="Prioridad" value={(requerimientoInfo as any).draftPriority} />
                                    <InfoRow label="Calendario Asignado" value={(requerimientoInfo as any).draftBestScheduleDate} />
                                    <InfoRow label="Disponibilidad Horaria" value={(requerimientoInfo as any).draftBestScheduleTime} />
                                </Stack>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'var(--primary-titles-text-color)', borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                                    Propiedad
                                </Typography>
                                <Stack spacing={2}>
                                    <InfoRow
                                        icon={<HomeWorkIcon fontSize="small" />}
                                        label="Tipo Propiedad"
                                        value={(requerimientoInfo as any).draftProperty}
                                    />
                                    <InfoRow label="Cantidad Obra" value={(requerimientoInfo as any).draftRooms} />
                                    <InfoRow label="Planos" value={(requerimientoInfo as any).draftPlans} />
                                    <InfoRow label="Permisos" value={(requerimientoInfo as any).draftPermissions} />
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'var(--primary-titles-text-color)', borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                                    Adjuntos
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDescargarAdjuntos}
                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                >
                                    Descargar Archivos
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quotations Section */}
            <Box sx={{ mt: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'var(--primary-titles-text-color)', fontWeight: 'bold' }}>
                        COTIZACIONES
                    </Typography>
                    {requerimientoInfo.draftApply && requerimientoInfo.draftApply.length < 4 && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<AddIcon />}
                            onClick={handleCotizar}
                            sx={{ color: 'white', fontWeight: 'bold' }}
                        >
                            ASIGNAR NUEVA COTIZACION
                        </Button>
                    )}
                </Box>

                <Card sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'var(--background-light-gray-color)' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Comerciante Calificado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Alcance</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cotizacionesInfo.appliedQuotations && cotizacionesInfo.appliedQuotations.length > 0 ? (
                                cotizacionesInfo.appliedQuotations.map((item) => {
                                    const { quotationId } = item
                                    const legacyItem = item as any
                                    const proponentId = legacyItem.proponentId || item.quotationComercianteId
                                    const scope = legacyItem.scope
                                    const description = legacyItem.description || item.quotationDescription

                                    return (
                                        <TableRow key={quotationId} hover>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'var(--primary-blue-light-color)' }}>
                                                        {proponentId ? proponentId.charAt(0).toUpperCase() : '?'}
                                                    </Avatar>
                                                    <Typography variant="body2">{proponentId}</Typography>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{scope}</TableCell>
                                            <TableCell>{description}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    {userAuthID === proponentId ? (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="warning"
                                                            startIcon={<EditIcon />}
                                                            onClick={(e) => handleEditQuotation(e, quotationId)}
                                                            sx={{ color: 'white' }}
                                                        >
                                                            AJUSTAR
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            // className="btn-high" equivalent color
                                                            sx={{ bgcolor: 'var(--primary-green-text-color)', color: 'white', '&:hover': { bgcolor: 'var(--secondary-green-text-color)' } }}
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={(e) => handleSeeQuotation(e, quotationId)}
                                                        >
                                                            VER
                                                        </Button>
                                                    )}
                                                    {rolAuth === 1 && (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={(e) => handleHire(e, quotationId, proponentId)}
                                                        >
                                                            CONTRATAR
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        No hay cotizaciones asignadas aún.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </Box>
        </Container>
    )
}
