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
import TablaSubCategoriaPresupuesto from '../components/TablaSubCategoriaPresupuesto'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
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
        draftSubCategory: any[] // Legacy array
        draftTotal: number
        draftApply: string[] // Array of quotation IDs
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
                // Map draft data to state
                setRequerimientoInfo(prev => ({
                    ...prev,
                    ...draft,
                    // Ensure defaults for critical fields
                    draftSubCategory: (draft.draftSubCategory as any) || [],
                    draftTotal: typeof draft.draftTotal === 'string' ? parseFloat(draft.draftTotal) : (draft.draftTotal || 0),
                    draftApply: draft.draftApply && Array.isArray(draft.draftApply) ? draft.draftApply : [] // Type guard
                } as any));
                // Handle applied quotations
                // Logic: "appliedQuotations = (draft.draftApply && draft.draftApply.length > 0) ? draft.draftApply[0] : null;"
                // This logic seems to fetch only the FIRST applied quotation?
                // Legacy code:
                // const appliedQuotations = (draft.draftApply && draft.draftApply.length > 0) ? draft.draftApply[0] : null;
                // if (appliedQuotations) { ... getQuotation ... setCotizacionesInfo ... appliedQuotations: [quoteResponse.data] }
                // So it only shows ONE quotation?
                // The table maps over "cotizacionesInfo.appliedQuotations".
                // So yes, it seems it supports only one or the view logic is limited.
                // I will reproduce legacy behavior.
                const appliedQuotationIds = draft.draftApply || [] // get safe array
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
        // Legacy passed state: { draftId, quotationId, proponentId }
        // Vike navigate doesn't support state.
        // We will pass via query params.
        // The destination page MUST be updated to read from query params if it uses useLocation/state.
        // Assuming we will migrate 'contratar' page later, we will use query params here 
        // and when migrating 'contratar' we will ensure it reads from query params.
        navigate(`/app/contratar?draftId=${draftId}&quotationId=${quotationId}&proponentId=${proponentId}`)
    }
    const handleCotizar = () => {
        const draftParamId = requerimientoInfo.draftId || draftId
        navigate(`/app/cotizacion/${draftParamId}`)
    }
    return (
        <Container fluid className="p-0">
            <Row className="h-100 pt-4 pb-4">
                <Col className="col-10">
                    <Typography variant="h5" className="headline-xl">
                        Detalle Requerimiento
                    </Typography>
                    <Button
                        className="btn-TEXT text-blanco"
                        variant="contained"
                    // Note: Legacy used variant="primary" which might be invalid Mui or Bootstrap mix? 
                    // Mui uses "contained", "outlined", "text". Bootstrap uses "primary".
                    // Legacy imported Button from '@mui/material/Button'. Mui Button doesn't have "primary" variant.
                    // But probably ignored or mapped to default.
                    // I'll use "contained" for primary look.
                    >
                        REALIZA UNA PREGUNTA ABIERTA AL PROPIETARÍO
                    </Button>
                    <Row className="p-0 pt-4 pb-4 w-100 align-items-start">
                        <Col className="col" md={6} sm={12}>
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Presupuesto
                            </Typography>
                            <Row className="m-0 w-100 pb-2 d-flex">
                                <Typography
                                    variant="body1"
                                    // name="draftTotal" // Typography doesn't support name
                                    className="w-100 detail-pill ps-3"
                                >
                                    Total: $
                                    {requerimientoInfo.draftTotal}
                                </Typography>
                            </Row>
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Categoria servicio
                            </Typography>
                            <Row className="m-0 w-100 pb-2 d-flex">
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Titulo:
                                    {requerimientoInfo.draftName}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Categoria:
                                    {requerimientoInfo.draftCategory}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Tipo Proyecto:
                                    {requerimientoInfo.draftProject}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Descripción:
                                    {requerimientoInfo.draftDescription}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3"
                                >
                                    Propietario:
                                    {requerimientoInfo.draftPropietarioResidente}
                                </Typography>
                            </Row>
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Ubicacion
                            </Typography>
                            <Row className="m-0 w-100 pb-2 d-flex">
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Ciudad:
                                    {requerimientoInfo.draftCity}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Dirección:
                                    {requerimientoInfo.draftDirection}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3"
                                >
                                    Codigo Postal:
                                    {requerimientoInfo.draftPostalCode}
                                </Typography>
                            </Row>
                        </Col>
                        <Col className="col" md={6} sm={12}>
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Programación
                            </Typography>
                            <Row className="m-0 w-100 pb-2 d-flex">
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    FECHA DE PUBLICACIÓN:
                                    {requerimientoInfo.draftCreatedAt || requerimientoInfo.draftCreated}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Prioridad:
                                    {(requerimientoInfo as any).draftPriority}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Calendario asignado:
                                    {(requerimientoInfo as any).draftBestScheduleDate}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Disponibilidad de horario:
                                    {(requerimientoInfo as any).draftBestScheduleTime}
                                </Typography>
                            </Row>
                            <Typography
                                gutterBottom
                                variant="h6"
                                align="left"
                                className="p-description w-100"
                            >
                                Descripción Propiedad
                            </Typography>
                            <Row className="m-0 w-100 pb-2 d-flex">
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Tipo propiedad:
                                    {(requerimientoInfo as any).draftProperty}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Cantidad Obra:
                                    {(requerimientoInfo as any).draftRooms}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3 mb-2"
                                >
                                    Planos:
                                    {(requerimientoInfo as any).draftPlans}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    className="w-100 detail-pill ps-3"
                                >
                                    Permisos:
                                    {(requerimientoInfo as any).draftPermissions}
                                </Typography>
                            </Row>
                            <Row className="m-0 w-100 pb-2 d-flex">
                                <Typography
                                    variant="h6"
                                    className="p-description w-100 p-1"
                                >
                                    Archivos adjuntos
                                </Typography>
                                <Button
                                    className="btn btn-round btn-high"
                                    onClick={handleDescargarAdjuntos}
                                >
                                    Descargar
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                    <TablaSubCategoriaPresupuesto
                        draftSubCategory={requerimientoInfo.draftSubCategory}
                        draftTotal={requerimientoInfo.draftTotal}
                    />
                    <Row>
                        <Col>
                            <div className="headline-l">
                                COTIZACIONES
                                {requerimientoInfo.draftApply && requerimientoInfo.draftApply.length < 4 && (
                                    <Button
                                        className="btn-TEXT text-blanco"
                                        variant="contained" // "primary" replacement
                                        onClick={handleCotizar}
                                    >
                                        + ASIGNAR NUEVA COTIZACION
                                    </Button>
                                )}
                            </div>
                            <Table
                                sx={{
                                    display: { sm: 'grid', xs: 'grid' },
                                    overflowX: 'scroll',
                                }}
                            >
                                <TableHead>
                                    <TableRow
                                        className="w-100 ps-4"
                                        sx={{ display: 'table' }}
                                    >
                                        <TableCell>
                                            Comerciante calificado
                                        </TableCell>
                                        <TableCell>Alcance</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cotizacionesInfo.appliedQuotations &&
                                        cotizacionesInfo.appliedQuotations
                                            .length > 0 &&
                                        cotizacionesInfo.appliedQuotations.map(
                                            (item) => {
                                                const {
                                                    quotationId,
                                                    // quotationComercianteId? -> proponentId in legacy
                                                    // legacy used 'proponentId'. 'QuotationFirestoreDocument' has 'quotationComercianteId'.
                                                    // I should map or use any if logic relies on legacy names.
                                                    // Legacy item destructure: { proponentId, scope, description, quotationId }
                                                    // Mapped from QuoteResponse.
                                                    // I assume Quote Document has these fields?
                                                    // Types say: quotationPrice, quotationDescription, quotationComercianteId.
                                                    // This implies legacy 'proponentId' = 'quotationComercianteId'
                                                    // 'scope' = ? maybe missing from types?
                                                    // 'description' = 'quotationDescription'
                                                    // Checking types again... types.ts:
                                                    // quotationPrice, quotationDescription, quotationStatus.
                                                    // If legacy used 'scope', I should handle it.
                                                    // I will cast item to any to access legacy fields for now.
                                                } = item
                                                const legacyItem = item as any
                                                const proponentId = legacyItem.proponentId || item.quotationComercianteId
                                                const scope = legacyItem.scope // ??
                                                const description = legacyItem.description || item.quotationDescription
                                                return (
                                                    <TableRow
                                                        key={quotationId}
                                                    >
                                                        <TableCell>
                                                            {proponentId}
                                                        </TableCell>
                                                        <TableCell>
                                                            {scope}
                                                        </TableCell>
                                                        <TableCell>
                                                            {description}
                                                        </TableCell>
                                                        <TableCell>
                                                            {userAuthID ==
                                                                proponentId ? (
                                                                <Button
                                                                    className="btn btn-round btn-middle"
                                                                    onClick={(e) =>
                                                                        handleEditQuotation(
                                                                            e,
                                                                            quotationId
                                                                        )
                                                                    }
                                                                >
                                                                    AJUSTAR
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    className="btn btn-round btn-high"
                                                                    onClick={(e) =>
                                                                        handleSeeQuotation(
                                                                            e,
                                                                            quotationId
                                                                        )
                                                                    }
                                                                >
                                                                    VER
                                                                    COTIZACION
                                                                </Button>
                                                            )}
                                                            {/* USUARIO PROPIETARIO INMOBILIARIO PUEDE CONTRATAR */}
                                                            {rolAuth ===
                                                                1 && (
                                                                    <Button
                                                                        className="btn btn-round btn-middle"
                                                                        onClick={(e) =>
                                                                            handleHire(
                                                                                e,
                                                                                quotationId,
                                                                                proponentId
                                                                            )
                                                                        }
                                                                    >
                                                                        CONTRATAR
                                                                    </Button>
                                                                )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        )}
                                </TableBody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
