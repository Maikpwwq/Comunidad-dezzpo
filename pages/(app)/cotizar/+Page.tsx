import React, { useState, useContext } from 'react'
import { UserAuthContext } from '@providers/UserAuthProvider'
import { v4 as uuidv4 } from 'uuid'
import { usePageContext } from '@hooks/usePageContext'
import { navigate } from 'vike/client/router'
import { updateDraft } from '@services/drafts'
import { setQuotation } from '@services/quotations'
import type { QuotationFirestoreDocument } from '@services/types'
// UI Libs
import { Row, Col, Container } from 'react-bootstrap'
import {
    Button,
    TextareaAutosize,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
interface Activity {
    id: string
    item: string
    actividadTitle: string
    unidadMedida: string
    cantidad: number | string
    precio: number | string
    valor: number
}
interface CotizacionState {
    quotationId: string
    proponentId: string
    description: string
    scope: string
    procedimiento: string
    tiempoEjecucion: string
    actividades: Activity[]
    condicionesNegocio: string
    garantia: string
    valorSubtotal: number
}
export default function Page() {
    const userAuth = useContext(UserAuthContext)
    const currentUser = userAuth?.currentUser
    const userAuthID = currentUser?.userId || ''
    const pageContext = usePageContext()
    const draftId = pageContext.routeParams?.draftId as string
    // Generate a new ID for this quotation session
    // Note: We use useState so it doesn't regenerate on every render, 
    // although technically the legacy code did `const quotationID = uuidv4()` in the body which IS wrong.
    // We'll fix it to be stable.
    const [quotationID] = useState(() => uuidv4())
    const [cotizacion, setCotizacion] = useState<CotizacionState>({
        quotationId: '', // Will be set on save, or we can set it now. Legacy set it in handleEnviar.
        proponentId: userAuthID,
        description: '',
        scope: '',
        procedimiento: '',
        tiempoEjecucion: '',
        actividades: [],
        condicionesNegocio: '',
        garantia: '',
        valorSubtotal: 0,
    })
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCotizacion({
            ...cotizacion,
            [e.target.name]: e.target.value,
        })
    }
    const handleRemoveTableRow = (e: React.MouseEvent, index: number) => {
        e.preventDefault()
        const actividades = cotizacion.actividades.filter((_, i) => i !== index)
        // Recalculate subtotal
        const newSubtotal = actividades.reduce((sum, act) => sum + (act.valor || 0), 0)
        setCotizacion({
            ...cotizacion,
            actividades,
            valorSubtotal: newSubtotal
        })
    }
    const handleNewTableRow = (e: React.MouseEvent) => {
        e.preventDefault()
        setCotizacion({
            ...cotizacion,
            actividades: [
                ...cotizacion.actividades,
                {
                    id: uuidv4(),
                    item: 'Ítem',
                    actividadTitle: 'Actividad',
                    unidadMedida: 'Unidad Medida',
                    cantidad: 0, // Changed default to number 0
                    precio: 0,
                    valor: 0,
                },
            ],
        })
    }
    const handleActivityChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
        e.preventDefault()
        const { name, value } = e.target
        let sumaSubtotal = 0
        const updateActivities = cotizacion.actividades.map((activity, i) => {
            if (i === index) {
                const updatedActivity = { ...activity, [name]: value }
                // Calculate line value if quantity or price changes
                const qty = Number(updatedActivity.cantidad) || 0
                const price = Number(updatedActivity.precio) || 0
                updatedActivity.valor = qty * price
                return updatedActivity
            }
            return activity
        })
        // Recalculate total
        sumaSubtotal = updateActivities.reduce((sum, act) => sum + (act.valor || 0), 0)
        setCotizacion({
            ...cotizacion,
            actividades: updateActivities,
            valorSubtotal: sumaSubtotal,
        })
    }
    const handleEnviar = async () => {
        if (!userAuthID) {
            console.error('User not authenticated')
            return
        }
        // Prepare quotation data
        const quotationData: Partial<QuotationFirestoreDocument> = {
            ...cotizacion,
            quotationDraftId: draftId,
            quotationComercianteId: userAuthID,
            quotationCreatedAt: new Date().toISOString(),
            quotationStatus: 'pending',
            quotationId: quotationID
        }
        try {
            // 1. Save Quotation
            const quoteResponse = await setQuotation({
                quotationId: quotationID,
                data: quotationData
            })
            // Check if quoteResponse exists and has success property (handling potential void return if types are mixed)
            if (quoteResponse && 'success' in quoteResponse && !quoteResponse.success) {
                console.error('Error saving quotation:', quoteResponse.error)
                return
            }
            console.log('Quotation saved successfully')
            // 2. Update Draft with reference to this quotation
            if (draftId && draftId.trim() !== '') {
                const updatePayload = {
                    draftApply: [quotationID]
                }
                // draftService.updateDraft returns Promise<void> and throws on error
                await updateDraft({
                    draftId: draftId,
                    data: updatePayload
                })
                console.log('Draft updated with quotation reference')
                navigate('/app/portal-servicios')
            } else {
                navigate('/app/portal-servicios')
            }
        } catch (error) {
            console.error('Error in handleEnviar:', error)
        }
    }
    return (
        <Container
            fluid
            className="p-0 pt-4 pb-4 h-100 d-flex justify-content-center"
        >
            <Col className="col-10 p-4 card-frame">
                <Row className="m-0 w-100 pb-2 d-flex">
                    <Typography variant="h5" className="w-auto pb-4">
                        Detalles de la cotización
                    </Typography>
                </Row>
                <Typography
                    variant="h6"
                    align="left"
                    className="body-1 pb-2 w-100"
                >
                    Descripción del servicio:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.description}
                    onChange={handleChange}
                    name="description"
                    id="ofertaServiciosDescription"
                    placeholder="Registra una descripción del servicio que ofreceras"
                    minRows={4}
                    className="ps-3 information-pill w-100"
                />
                <Typography
                    variant="h6"
                    align="left"
                    className="p-description w-100 mt-3"
                >
                    Alcance del servicio:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.scope}
                    onChange={handleChange}
                    name="scope"
                    id="ofertaServiciosAlcance"
                    placeholder="Registra una descripción del alcance para este proyecto"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                <Typography
                    variant="h6"
                    align="left"
                    className="p-description w-100 mt-3"
                >
                    Procedimiento a desarrollar:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.procedimiento}
                    onChange={handleChange}
                    name="procedimiento"
                    id="ofertaServiciosProcedimiento"
                    placeholder="Registra una descripción del procedimiento a desarrollar"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                <Typography
                    variant="h6"
                    className="p-description pt-3 w-100"
                >
                    Tabla de valores
                </Typography>
                <Row className="m-0 w-100 d-flex">
                    <Table>
                        <TableHead>
                            <TableRow
                                className="w-100"
                                sx={{ display: 'table' }}
                            >
                                <TableCell className="headline-s"></TableCell>
                                <TableCell className="headline-s">Ítem</TableCell>
                                <TableCell className="headline-s">Actividad</TableCell>
                                <TableCell className="headline-s">Unidad Medida</TableCell>
                                <TableCell className="headline-s">Cantidad</TableCell>
                                <TableCell className="headline-s">Precio unitario</TableCell>
                                <TableCell className="headline-s">Valor sin IVA</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cotizacion.actividades.map((actividad, index) => (
                                <TableRow key={actividad.id || index}>
                                    <TableCell>
                                        <RemoveCircleIcon
                                            onClick={(e: React.MouseEvent) => handleRemoveTableRow(e, index)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextareaAutosize
                                            value={actividad.item}
                                            onChange={(e) => handleActivityChange(e, index)}
                                            name="item"
                                            placeholder="Ítem"
                                            minRows={2}
                                            className="w-100"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextareaAutosize
                                            value={actividad.actividadTitle}
                                            onChange={(e) => handleActivityChange(e, index)}
                                            name="actividadTitle"
                                            placeholder="Actividad"
                                            minRows={2}
                                            className="w-100"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextareaAutosize
                                            value={actividad.unidadMedida}
                                            onChange={(e) => handleActivityChange(e, index)}
                                            name="unidadMedida"
                                            placeholder="Unidad"
                                            minRows={2}
                                            className="w-100"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="number"
                                            value={actividad.cantidad}
                                            onChange={(e) => handleActivityChange(e, index)}
                                            placeholder="Cant"
                                            name="cantidad"
                                            className="w-100"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <input
                                            type="number"
                                            value={actividad.precio}
                                            onChange={(e) => handleActivityChange(e, index)}
                                            placeholder="Precio"
                                            name="precio"
                                            className="w-100"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {Number(actividad.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>
                                    <AddCircleIcon
                                        onClick={handleNewTableRow}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </TableCell>
                                <TableCell colSpan={4}></TableCell>
                                <TableCell>VALOR SUBTOTAL</TableCell>
                                <TableCell>
                                    {Number(cotizacion.valorSubtotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Row>
                <Typography
                    variant="h6"
                    align="left"
                    className="p-description w-100"
                >
                    Tiempo Ejecución:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.tiempoEjecucion}
                    onChange={handleChange}
                    name="tiempoEjecucion"
                    id="ofertaServiciostiempoEjecucion"
                    placeholder="Registra los Tiempos de Ejecución"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                <Typography
                    variant="h6"
                    align="left"
                    className="p-description w-100 mt-3"
                >
                    Condiciones de Negociación:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.condicionesNegocio}
                    onChange={handleChange}
                    name="condicionesNegocio"
                    id="ofertaServicioscondicionesNegocio"
                    placeholder="Registra las condiciones para dar esta negociación"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                <Typography
                    variant="h6"
                    align="left"
                    className="p-description w-100 mt-3"
                >
                    Garantía:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.garantia}
                    onChange={handleChange}
                    name="garantia"
                    id="ofertaServiciosGarantía"
                    placeholder="Registra cuales seran las garantía para el proyecto"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                <Row className="pb-4 pt-4 w-100">
                    <Col className="">
                        <Button
                            type="submit"
                            className="btn btn-primary"
                            onClick={handleEnviar}
                        >
                            Enviar
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Container>
    )
}
