import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { collection, doc, setDoc } from 'firebase/firestore'
import { firestore, auth } from '../../../firebase/firebaseClient'
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

const Cotizar = (props) => {
    const quotationID = uuidv4()
    const user = auth.currentUser || {}
    const userID = user.uid || ''
    const { state } = useLocation() || {}
    const navigate = useNavigate()
    const { draftId } = state || {}
    const _firestore = firestore
    const quotationRef = collection(_firestore, 'quotation')
    const draftRef = collection(_firestore, 'drafts')

    const [cotizacion, setCotizacion] = useState({
        quotationId: quotationID,
        proponentId: userID,
        description: '',
        scope: '',
        tiempoEjecucion: '',
        condicionesNegocio: '',
        garantia: '',
    })

    const handleChange = (e) => {
        setCotizacion({
            ...cotizacion,
            [e.target.name]: e.target.value,
        })
    }

    const quotationToFirestore = async (updateInfo, docId) => {
        await setDoc(doc(quotationRef, docId), updateInfo)
    } 

    const draftToFirestore = async (updateInfo, projectID) => {
        await setDoc(doc(draftRef, projectID), updateInfo, { merge: true })
    }

    const handleEnviar = () => {
        quotationToFirestore(cotizacion, quotationID)
        const update = { draftApply: [quotationID] } // TODO: add just to five id's
        console.log(draftId)
        draftToFirestore(update, draftId)
        navigate(-1)
    }

    return (
        <>
            <Container
                fluid
                className="p-0 h-100 d-flex justify-content-center"
            >
                <Col className="col-10 pb-4 pt-4">
                    <label
                        htmlFor="ofertaServiciosDescription"
                        className="p-description pb-4 w-100"
                    >
                        Descripción del servicio
                    </label>
                    <TextareaAutosize
                        value={cotizacion.description}
                        onChange={handleChange}
                        name="description"
                        id="ofertaServiciosDescription"
                        placeholder="Registra una descripción del servicio que ofreceras"
                        cols="10"
                        minRows={4}
                        className="w-100"
                    ></TextareaAutosize>
                    <label
                        htmlFor="ofertaServiciosAlcance"
                        className="p-description pt-4 pb-2 w-100"
                    >
                        Inlcuir alcance
                    </label>
                    <TextareaAutosize
                        value={cotizacion.scope}
                        onChange={handleChange}
                        name="scope"
                        id="ofertaServiciosAlcance"
                        placeholder="Registra una descripción del alcance para este proyecto"
                        cols="10"
                        minRows={2}
                        className="w-100"
                    ></TextareaAutosize>
                    <label
                        htmlFor="ofertaServiciosProcedimiento"
                        className="p-description pt-4 pb-2 w-100"
                    >
                        Procedimiento
                    </label>
                    <TextareaAutosize
                        value={cotizacion.procedimiento}
                        onChange={handleChange}
                        name="procedimiento"
                        id="ofertaServiciosProcedimiento"
                        placeholder="Registra una descripción del procedimiento a desarrollar"
                        cols="10"
                        minRows={2}
                        className="w-100"
                    ></TextareaAutosize>
                    <label
                        htmlFor="ofertaServiciosValores"
                        className="p-description pt-4 pb-2 w-100"
                    >
                        Tabla de valores
                    </label>
                    <Row className="m-0 w-100 d-flex">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ítem</TableCell>
                                    <TableCell>Actividad</TableCell>
                                    <TableCell>Unidad Medida</TableCell>
                                    <TableCell>Cantidad</TableCell>
                                    <TableCell>Precio unitario</TableCell>
                                    <TableCell>Valor sin IVA</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Ítem</TableCell>
                                    <TableCell>Actividad</TableCell>
                                    <TableCell>Unidad Medida</TableCell>
                                    <TableCell>
                                        Cantidad
                                        {/* {parseInt(
                                            Cantidad
                                        ).toLocaleString('es-CO', {
                                            style: 'currency',
                                            currency: 'COP',
                                        })} */}
                                    </TableCell>
                                    <TableCell>Valor sin IVA</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>VALOR SUBTOTAL</TableCell>
                                    <TableCell>VALOR SUBTOTAL</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Row>

                    <label
                        htmlFor="ofertaServiciostiempoEjecucion"
                        className="p-description pt-4 pb-2 w-100"
                    >
                        Tiempo Ejecución
                    </label>
                    <TextareaAutosize
                        value={cotizacion.tiempoEjecucion}
                        onChange={handleChange}
                        name="tiempoEjecucion"
                        id="ofertaServiciostiempoEjecucion"
                        placeholder="Registra los Tiempos de Ejecución"
                        cols="10"
                        minRows={2}
                        className="w-100"
                    ></TextareaAutosize>
                    <label
                        htmlFor="ofertaServicioscondicionesNegocio"
                        className="p-description pt-4 pb-2 w-100"
                    >
                        Condiciones de Negociación
                    </label>
                    <TextareaAutosize
                        value={cotizacion.condicionesNegocio}
                        onChange={handleChange}
                        name="condicionesNegocio"
                        id="ofertaServicioscondicionesNegocio"
                        placeholder="Registra las condiciones para dar esta negociación"
                        cols="10"
                        minRows={2}
                        className="w-100"
                    ></TextareaAutosize>
                    <label
                        htmlFor="ofertaServiciosGarantía"
                        className="p-description pt-4 pb-2 w-100"
                    >
                        Garantía
                    </label>
                    <TextareaAutosize
                        value={cotizacion.garantia}
                        onChange={handleChange}
                        name="garantia"
                        id="ofertaServiciosGarantía"
                        placeholder="Registra cuales seran las garantía para el proyecto"
                        cols="10"
                        minRows={2}
                        className="w-100"
                    ></TextareaAutosize>
                    <Row className="pb-4 w-100">
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

Cotizar.propTypes = {}

export default Cotizar
