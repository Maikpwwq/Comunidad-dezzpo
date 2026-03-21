import React, { useState, useEffect, useContext } from 'react'
import { UserAuthContext } from '@providers/UserAuthProvider'
import { usePageContext } from '@hooks/usePageContext'
import { navigate } from 'vike/client/router'
import { getQuotation, updateQuotation } from '@services/quotations'
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
    Typography,
    Box,
    CircularProgress
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
    quotationDraftId: string
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
    const { quotationId } = pageContext.routeParams as { quotationId: string }

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [cotizacion, setCotizacion] = useState<CotizacionState>({
        quotationId: quotationId || '',
        quotationDraftId: '',
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

    const fetchQuotationData = async () => {
        if (!quotationId || quotationId.trim() === '') return
        try {
            const response = await getQuotation({ quotationId })
            if (response.success && response.data) {
                const legacyItem = response.data as any
                setCotizacion({
                    quotationId: quotationId,
                    quotationDraftId: legacyItem.quotationDraftId || '',
                    proponentId: legacyItem.quotationComercianteId || legacyItem.proponentId || userAuthID,
                    description: legacyItem.quotationDescription || legacyItem.description || '',
                    scope: legacyItem.scope || '',
                    procedimiento: legacyItem.procedimiento || '',
                    tiempoEjecucion: legacyItem.tiempoEjecucion || '',
                    actividades: legacyItem.actividades || [],
                    condicionesNegocio: legacyItem.condicionesNegocio || '',
                    garantia: legacyItem.garantia || '',
                    valorSubtotal: legacyItem.valorSubtotal || legacyItem.quotationPrice || 0,
                })
            } else {
                console.log('Quotation not found or error:', response.error)
            }
        } catch (error) {
            console.error('Error fetching quotation:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (quotationId) {
            fetchQuotationData()
        } else {
            setLoading(false)
        }
    }, [quotationId])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCotizacion({
            ...cotizacion,
            [e.target.name]: e.target.value,
        })
    }

    const handleRemoveTableRow = (e: React.MouseEvent, index: number) => {
        e.preventDefault()
        const actividades = cotizacion.actividades.filter((_, i) => i !== index)
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
                    id: Math.random().toString(36).substring(7),
                    item: 'Ítem',
                    actividadTitle: 'Actividad',
                    unidadMedida: 'Unidad Medida',
                    cantidad: 0,
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
                const qty = Number(updatedActivity.cantidad) || 0
                const price = Number(updatedActivity.precio) || 0
                updatedActivity.valor = qty * price
                return updatedActivity
            }
            return activity
        })
        sumaSubtotal = updateActivities.reduce((sum, act) => sum + (act.valor || 0), 0)
        setCotizacion({
            ...cotizacion,
            actividades: updateActivities,
            valorSubtotal: sumaSubtotal,
        })
    }

    const handleActualizar = async () => {
        if (!userAuthID) {
            console.error('User not authenticated')
            return
        }
        setSaving(true)
        const quotationData: Partial<QuotationFirestoreDocument> = {
            ...cotizacion,
            quotationComercianteId: userAuthID,
            quotationPrice: cotizacion.valorSubtotal,
            quotationDescription: cotizacion.description,
        }
        
        try {
            await updateQuotation({
                quotationId: quotationId,
                data: quotationData
            })
            console.log('Quotation updated successfully')
            if (cotizacion.quotationDraftId) {
                navigate(`/app/ver-requerimiento/${cotizacion.quotationDraftId}`)
            } else {
                navigate('/app/portal-servicios')
            }
        } catch (error) {
            console.error('Error in handleActualizar:', error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <Container fluid className="h-100 d-flex justify-content-center align-items-center">
                <CircularProgress />
            </Container>
        )
    }

    return (
        <Container fluid className="p-0 pt-4 pb-4 h-100 d-flex justify-content-center">
            <Col className="col-10 p-4 card-frame">
                <Row className="m-0 w-100 pb-2 d-flex">
                    <Typography className="type-section-title w-auto pb-4">
                        Editar Cotización
                    </Typography>
                </Row>
                
                <Typography className="type-card-title pb-2 w-100">
                    Descripción del servicio:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.description}
                    onChange={handleChange}
                    name="description"
                    placeholder="Registra una descripción del servicio que ofreceras"
                    minRows={4}
                    className="ps-3 information-pill w-100"
                />
                
                <Typography className="type-card-title w-100 mt-3">
                    Alcance del servicio:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.scope}
                    onChange={handleChange}
                    name="scope"
                    placeholder="Registra una descripción del alcance para este proyecto"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                
                <Typography className="type-card-title w-100 mt-3">
                    Procedimiento a desarrollar:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.procedimiento}
                    onChange={handleChange}
                    name="procedimiento"
                    placeholder="Registra una descripción del procedimiento a desarrollar"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                
                <Typography className="type-card-title pt-3 mb-3 w-100">
                    Tabla de valores
                </Typography>
                <Box sx={{ width: '100%', overflowX: 'auto', mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="type-body fw-bold"></TableCell>
                                <TableCell className="type-body fw-bold">Ítem</TableCell>
                                <TableCell className="type-body fw-bold">Actividad</TableCell>
                                <TableCell className="type-body fw-bold">Unidad Medida</TableCell>
                                <TableCell className="type-body fw-bold">Cantidad</TableCell>
                                <TableCell className="type-body fw-bold">Precio unitario</TableCell>
                                <TableCell className="type-body fw-bold">Valor sin IVA</TableCell>
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
                </Box>
                
                <Typography className="type-card-title w-100 mt-3">
                    Tiempo Ejecución:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.tiempoEjecucion}
                    onChange={handleChange}
                    name="tiempoEjecucion"
                    placeholder="Registra los Tiempos de Ejecución"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                
                <Typography className="type-card-title w-100 mt-3">
                    Condiciones de Negociación:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.condicionesNegocio}
                    onChange={handleChange}
                    name="condicionesNegocio"
                    placeholder="Registra las condiciones para dar esta negociación"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                
                <Typography className="type-card-title w-100 mt-3">
                    Garantía:
                </Typography>
                <TextareaAutosize
                    value={cotizacion.garantia}
                    onChange={handleChange}
                    name="garantia"
                    placeholder="Registra cuales seran las garantía para el proyecto"
                    minRows={2}
                    className="ps-3 information-pill w-100"
                />
                
                <Row className="pb-4 pt-4 w-100">
                    <Col className="">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                            onClick={handleActualizar}
                            sx={{
                                color: 'white',
                                bgcolor: 'var(--background-main-green-color)',
                                '&:hover': {
                                    bgcolor: '#0d6efd',
                                    color: 'white'
                                }
                            }}
                        >
                            {saving ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Cotización'}
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Container>
    )
}
