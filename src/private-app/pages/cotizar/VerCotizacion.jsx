import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

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
    const _firestore = firestore
    const quotationRef = collection(_firestore, 'quotation')
    const { state } = useLocation() || {}
    const { quotationId } = state || {}

    const [quotationInfo, setQuotationInfo] = useState({
        quotationId: '',
        proponentId: '',
        description: '',
        scope: '',
        tiempoEjecucion: '',
        actividades: [],
        condicionesNegocio: '',
        garantia: '',
        valorSubtotal: 0,
    })

    const quotationFromFirestore = async (quotationId) => {
        const quotationData = await getDocFromServer(
            doc(quotationRef, quotationId)
        )
        return quotationData
    }

    useEffect(() => {
        console.log(quotationId)
        if (quotationId !== ' ' && quotationId !== undefined) {
            const snap = quotationFromFirestore(quotationId)
            snap.then((docSnap) => {
                if (docSnap) {
                    const data = docSnap.data()
                    console.log(data)
                    if (data) {
                        setQuotationInfo({
                            ...quotationInfo,
                            quotationId: data.quotationId,
                            proponentId: data.proponentId,
                            description: data.description,
                            scope: data.scope,
                            tiempoEjecucion: data.tiempoEjecucion,
                            actividades: data.actividades,
                            condicionesNegocio: data.condicionesNegocio,
                            garantia: data.garantia,
                            valorSubtotal: data.valorSubtotal,
                        })
                    }
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
                <Col className="col-10 pb-4 pt-4">
                    <Typography variant="subtitle1" className="w-auto pb-4">
                        A continuación podrás consultar los detalles de la
                        cotización.
                    </Typography>
                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography
                            variant="body1"
                            className="p-description w-auto"
                        >
                            Descripción del servicio:
                        </Typography>
                        <Typography
                            variant="body1"
                            name="description"
                            className="w-auto"
                        >
                            {quotationInfo.description}
                        </Typography>
                    </Row>

                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography
                            variant="body1"
                            className="p-description w-auto"
                        >
                            Alcance del servicio:
                        </Typography>
                        <Typography
                            variant="body1"
                            name="scope"
                            className="w-auto"
                        >
                            {quotationInfo.scope}
                        </Typography>
                    </Row>

                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography
                            variant="body1"
                            className="p-description w-auto"
                        >
                            Procedimiento a desarrollar:
                        </Typography>
                        <Typography
                            variant="body1"
                            name="procedimiento"
                            className="w-auto"
                        >
                            {quotationInfo.procedimiento}
                        </Typography>
                    </Row>

                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography
                            variant="body1"
                            className="p-description pt-2 pb-2 w-100"
                        >
                            Tabla de valores
                        </Typography>
                    </Row>

                    <Row className="m-0 w-100 pb-2 d-flex">
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
                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography
                            variant="body1"
                            className="p-description w-auto"
                        >
                            Tiempo Ejecución:
                        </Typography>
                        <Typography
                            variant="body1"
                            name="tiempoEjecucion"
                            className="w-auto"
                        >
                            {quotationInfo.tiempoEjecucion}
                        </Typography>
                    </Row>

                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography
                            variant="body1"
                            className="p-description w-auto"
                        >
                            Condiciones de Negociación:
                        </Typography>
                        <Typography
                            variant="body1"
                            name="condicionesNegocio"
                            className="w-auto"
                        >
                            {quotationInfo.condicionesNegocio}
                        </Typography>
                    </Row>

                    <Row className="m-0 w-100 pb-2 d-flex">
                        <Typography
                            variant="body1"
                            className="p-description w-auto"
                        >
                            Garantía:
                        </Typography>
                        <Typography
                            variant="body1"
                            name="garantia"
                            className="w-auto"
                        >
                            {quotationInfo.garantia}
                        </Typography>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default VerCotizacion
