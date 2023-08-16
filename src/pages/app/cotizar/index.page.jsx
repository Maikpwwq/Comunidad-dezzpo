export { Page }

import React, { useEffect, useState } from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '#@/firebase/firebaseClient'
import { usePageContext } from '#@/pages/app/renderer/usePageContext'

import { updateDraftToFirestore } from '#@/services/updateDraftToFirestore.service'
import { updateQuotationToFirestore } from '#@/services/updateQuotationToFirestore.service'
import { readQuotationFromFirestore } from '#@/services/readQuotationFromFirestore.service'
import { sharingInformationService } from '#@/services/sharing-information'

// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import AddCircleIcon from '@mui/icons-material/AddCircle'
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import Typography from '@mui/material/Typography'

const Page = (props) => {
    const user = auth.currentUser || {}
    const userID = user.uid || ''
    const pageContext = usePageContext()
    const { draftId } = pageContext.routeParams // , quotationId
    const quotationID = uuidv4() // quotationId ? quotationId :
    console.log('quotationID', quotationID)

    const [cotizacion, setCotizacion] = useState({
        quotationId: '',
        proponentId: userID,
        description: '',
        scope: '',
        procedimiento: '',
        tiempoEjecucion: '',
        actividades: [],
        condicionesNegocio: '',
        garantia: '',
        valorSubtotal: 0,
    })

    const handleChange = (e) => {
        setCotizacion({
            ...cotizacion,
            [e.target.name]: e.target.value,
        })
    }

    const handleRemoveTableRow = (e, index) => {
        e.preventDefault()
        const actividades = cotizacion.actividades.filter((_, i) => i !== index)
        console.log('actividades', actividades)
        setCotizacion({
            ...cotizacion,
            actividades,
        })
    }

    const handleNewTableRow = (e) => {
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
                    cantidad: 'Cantidad',
                    precio: 0,
                    valor: 0,
                },
            ],
        })
    }

    useEffect(() => {
        if (quotationId && quotationId !== ' ' && quotationId !== undefined) {
            fromQuotation(quotationId)
            const quotationData = sharingInformationService.getSubject()
            quotationData.subscribe((data) => {
                if (data) {
                    const { quotation } = data
                    const {
                        quotationId,
                        proponentId,
                        description,
                        scope,
                        procedimiento,
                        tiempoEjecucion,
                        actividades,
                        condicionesNegocio,
                        garantia,
                        valorSubtotal,
                    } = quotation
                    // console.log('Detail load:', data)
                    setCotizacion({
                        ...cotizacion,
                        quotationId: quotationId,
                        proponentId: proponentId,
                        description: description,
                        scope: scope,
                        procedimiento: procedimiento,
                        tiempoEjecucion: tiempoEjecucion,
                        actividades: actividades || [],
                        condicionesNegocio: condicionesNegocio,
                        garantia: garantia,
                        valorSubtotal: valorSubtotal,
                    })
                } else {
                    console.log(
                        'No se encontro información relacionada con esta cotización!'
                    )
                }
            })
        }
    }, [quotationId])

    const handleActivityChange = (e, index) => {
        e.preventDefault()
        const { name, value } = e.target
        console.log(name, value, index)
        let sumaSubtotal = 0
        const updateActivities = cotizacion.actividades.map((activity, i) => {
            if (i === index) {
                return {
                    ...activity,
                    [name]: value,
                    valor: activity.cantidad * activity.precio,
                }
            }
            sumaSubtotal = sumaSubtotal + activity.valor
            return activity
        })
        setCotizacion({
            ...cotizacion,
            actividades: updateActivities,
            valorSubtotal: sumaSubtotal,
        })
        // calculateSubtotal()
        // calculateSubtotal()
    }

    // const calculateSubtotal = () => {
    //     let sumaSubtotal = 0
    //     cotizacion.actividades.map((activity) => {
    //         sumaSubtotal = sumaSubtotal + activity.valor
    //     })
    //     setCotizacion({
    //         ...cotizacion,
    //         valorSubtotal: sumaSubtotal,
    //     })
    // }
    // console.log('actividades', cotizacion.actividades)

    const toDraft = (updateInfo, docId) => {
        updateDraftToFirestore({
            updateInfo,
            docId,
        })
    }

    const toQuotation = (updateInfo, docId) => {
        updateQuotationToFirestore({
            updateInfo,
            docId,
        })
    }

    const fromQuotation = (docId) => {
        readQuotationFromFirestore({
            docId,
        })
    }

    const handleEnviar = () => {
        toQuotation(cotizacion, quotationID)
        const quotationData = sharingInformationService.getSubject()
        quotationData.subscribe((data) => {
            if (data) {
                const { sendQuotation } = data
                console.log('Detail quotation:', sendQuotation)
            }
        })
        const update = { draftApply: [quotationID] } // TODO: add just to five id's
        console.log(draftId)
        toDraft(update, draftId)
        const draftData = sharingInformationService.getSubject()
        draftData.subscribe((data) => {
            if (data) {
                const { sendDraft } = data
                console.log('Detail load:', sendDraft)
            }
        })
        navigate(-1)
    }

    return (
        <>
            <Container
                fluid
                className="p-0 pt-4 pb-4 h-100 d-flex justify-content-center"
            >
                <Col className="col-10 p-4 cardFrame">
                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography variant="h5" className="w-auto pb-4">
                            Detalles de la cotización
                        </Typography>
                    </Row>
                    <Typography
                        variant="h6"
                        align="left"
                        className="p-description pb-2 w-100"
                    >
                        Descripción del servicio:
                    </Typography>
                    <TextareaAutosize
                        value={cotizacion.description}
                        onChange={handleChange}
                        name="description"
                        id="ofertaServiciosDescription"
                        placeholder="Registra una descripción del servicio que ofreceras"
                        cols="10"
                        minRows={4}
                        className="ps-3 information-pill w-100"
                    ></TextareaAutosize>
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
                        cols="10"
                        minRows={2}
                        className="ps-3 information-pill w-100"
                    ></TextareaAutosize>
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
                        cols="10"
                        minRows={2}
                        className="ps-3 information-pill w-100"
                    ></TextareaAutosize>
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
                                    <TableCell></TableCell>
                                    <TableCell>Ítem</TableCell>
                                    <TableCell>Actividad</TableCell>
                                    <TableCell>Unidad Medida</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Precio unitario</TableCell>
                                    <TableCell>Valor sin IVA</TableCell>
                                </TableRow>
                            </TableHead>
                            {/* TODO: Create and delete activities */}
                            <TableBody>
                                {cotizacion.actividades &&
                                    cotizacion.actividades.map(
                                        (actividad, index) => {
                                            const {
                                                // id,
                                                item,
                                                actividadTitle,
                                                unidadMedida,
                                                cantidad,
                                                precio,
                                                valor,
                                            } = actividad
                                            // console.log(
                                            //     index,
                                            //     id,
                                            //     item,
                                            //     actividadTitle,
                                            //     unidadMedida,
                                            //     cantidad,
                                            //     precio
                                            // )
                                            return (
                                                <TableRow key={index}>
                                                    <RemoveCircleIcon
                                                        onClick={(e) =>
                                                            handleRemoveTableRow(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                    <TableCell>
                                                        <TextareaAutosize
                                                            value={item}
                                                            onChange={(e) =>
                                                                handleActivityChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            name="item"
                                                            id="ActividadesItem"
                                                            placeholder={item}
                                                            cols="8"
                                                            minRows={2}
                                                            className="w-100"
                                                        ></TextareaAutosize>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextareaAutosize
                                                            value={
                                                                actividadTitle
                                                            }
                                                            onChange={(e) =>
                                                                handleActivityChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            name="actividadTitle"
                                                            id="ActividadesactividadTitle"
                                                            placeholder={
                                                                actividadTitle
                                                            }
                                                            cols="8"
                                                            minRows={2}
                                                            className="w-100"
                                                        ></TextareaAutosize>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextareaAutosize
                                                            value={unidadMedida}
                                                            onChange={(e) =>
                                                                handleActivityChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            name="unidadMedida"
                                                            id="ActividadesunidadMedida"
                                                            placeholder={
                                                                unidadMedida
                                                            }
                                                            cols="8"
                                                            minRows={2}
                                                            className="w-100"
                                                        ></TextareaAutosize>
                                                    </TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            value={cantidad}
                                                            onChange={(e) =>
                                                                handleActivityChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            placeholder={
                                                                cantidad
                                                            }
                                                            name="cantidad"
                                                            id="ActividadesCantidad"
                                                            className="w-100"
                                                        />
                                                        {/* {parseInt(
                                            Cantidad
                                        ).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                        })} */}
                                                    </TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="number"
                                                            value={precio}
                                                            onChange={(e) =>
                                                                handleActivityChange(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                            placeholder={precio}
                                                            name="precio"
                                                            id="ActividadesPrecio"
                                                            className="w-100"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {valor}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    )}
                                <TableRow>
                                    <TableCell>
                                        <AddCircleIcon
                                            onClick={handleNewTableRow}
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>VALOR SUBTOTAL</TableCell>
                                    <TableCell>
                                        {cotizacion.valorSubtotal}
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
                        cols="10"
                        minRows={2}
                        className="ps-3 information-pill w-100"
                    ></TextareaAutosize>
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
                        cols="10"
                        minRows={2}
                        className="ps-3 information-pill w-100"
                    ></TextareaAutosize>
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
                        cols="10"
                        minRows={2}
                        className="ps-3 information-pill w-100"
                    ></TextareaAutosize>
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
        </>
    )
}

Page.propTypes = {}
