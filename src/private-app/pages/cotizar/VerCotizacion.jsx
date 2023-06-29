import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import readQuotationFromFirestore from '@/services/readQuotationFromFirestore.service'
import { sharingInformationService } from '@/services/sharing-information'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

const VerCotizacion = () => {
    const { state } = useLocation() || {}
    const { quotationId } = state || {}

    const [quotationInfo, setQuotationInfo] = useState({
        quotationId: '',
        proponentId: '',
        description: '',
        scope: '',
        procedimiento: '',
        tiempoEjecucion: '',
        actividades: [],
        condicionesNegocio: '',
        garantia: '',
        valorSubtotal: 0,
    })

    const fromQuotation = (docId) => {
        readQuotationFromFirestore({
            docId,
        })
    }

    useEffect(() => {
        console.log(quotationId)
        if (quotationId !== ' ' && quotationId !== undefined) {
            fromQuotation(quotationId)
            const quotationData = sharingInformationService.getSubject()
            quotationData.subscribe((data) => {
                if (data) {
                    console.log('Detail load:', data)
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
                    setQuotationInfo({
                        ...quotationInfo,
                        quotationId: quotationId,
                        proponentId: proponentId,
                        description: description,
                        scope: scope,
                        procedimiento: procedimiento,
                        tiempoEjecucion: tiempoEjecucion,
                        actividades: actividades,
                        condicionesNegocio: condicionesNegocio,
                        garantia: garantia,
                        valorSubtotal: valorSubtotal,
                    })
                } else {
                    console.log('No such document!')
                }
            })
        }
    }, [quotationId])

    return (
        <>
            <Container
                fluid
                className="m-0 p-0 h-100 d-flex justify-content-center"
            >
                <Col className="col-8 pb-4 pt-4 align-items-start">
                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography variant="h5" className="w-auto pb-4">
                            Consulta los detalles de la cotización
                        </Typography>
                    </Row>
                    <Typography variant="h6" className="p-description w-auto">
                        Descripción del servicio:{' '}
                    </Typography>
                    <Typography
                        variant="body1"
                        name="description"
                        className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                    >
                        {quotationInfo.description}
                    </Typography>
                    <Typography
                        variant="h6"
                        className="p-description w-auto mt-3"
                    >
                        Alcance del servicio:{' '}
                    </Typography>
                    <Typography
                        variant="body1"
                        name="scope"
                        className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                    >
                        {quotationInfo.scope}
                    </Typography>
                    <Typography
                        variant="h6"
                        className="p-description w-auto mt-3"
                    >
                        Procedimiento a desarrollar:{' '}
                    </Typography>
                    <Typography
                        variant="body1"
                        name="procedimiento"
                        className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                    >
                        {quotationInfo.procedimiento}
                    </Typography>

                    <Row className="m-0 w-100 p-0 pt-2 d-flex">
                        <Typography
                            variant="h6"
                            className="p-description pt-3 w-100"
                        >
                            Tabla de valores
                        </Typography>

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
                            <TableBody>
                                {quotationInfo.actividades &&
                                    quotationInfo.actividades.map(
                                        (actividad, index) => {
                                            const {
                                                id,
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
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            name="item"
                                                        >
                                                            {item}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            name="actividadTitle"
                                                        >
                                                            {actividadTitle}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            name="unidadMedida"
                                                        >
                                                            {unidadMedida}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            name="cantidad"
                                                        >
                                                            {cantidad}
                                                        </Typography>

                                                        {/* {parseInt(
                                            Cantidad
                                        ).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                        })} */}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body1"
                                                            name="precio"
                                                        >
                                                            {precio}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {valor}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    )}
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>VALOR SUBTOTAL</TableCell>
                                    <TableCell>
                                        {quotationInfo.valorSubtotal}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Row>
                    <Typography variant="h6" className="p-description w-auto">
                        Tiempo Ejecución:{' '}
                    </Typography>
                    <Typography
                        variant="body1"
                        name="tiempoEjecucion"
                        className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                    >
                        {quotationInfo.tiempoEjecucion}
                    </Typography>

                    <Typography
                        variant="h6"
                        className="p-description w-auto mt-3"
                    >
                        Condiciones de Negociación:{' '}
                    </Typography>
                    <Typography
                        variant="body1"
                        name="condicionesNegocio"
                        className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                    >
                        {quotationInfo.condicionesNegocio}
                    </Typography>

                    <Typography
                        variant="h6"
                        className="p-description w-auto mt-3"
                    >
                        Garantía:{' '}
                    </Typography>
                    <Typography
                        variant="body1"
                        name="garantia"
                        className="detail-pill p-description w-100 p-1 ps-3 pe-3"
                    >
                        {quotationInfo.garantia}
                    </Typography>
                </Col>
            </Container>
        </>
    )
}

export default VerCotizacion
