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
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

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

    const calculateSubtotal = () => {
        let sumaSubtotal = 0
        cotizacion.actividades.map((activity) => {
            sumaSubtotal = sumaSubtotal + activity.valor
        })
        setCotizacion({
            ...cotizacion,
            valorSubtotal: sumaSubtotal,
        })
    }
    // console.log('actividades', cotizacion.actividades)

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
                                {cotizacion.actividades.map(
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
                                                        value={actividadTitle}
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
                                                        placeholder={cantidad}
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
                                                <TableCell>{valor}</TableCell>
                                            </TableRow>
                                        )
                                    }
                                )}
                                <TableRow>
                                    <TableCell>
                                        {' '}
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
