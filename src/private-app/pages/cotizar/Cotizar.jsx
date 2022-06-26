import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextareaAutosize from '@mui/material/TextareaAutosize'

const Cotizar = (props) => {
    const { state } = useLocation() || {}
    const { draftId } = state || {}
    const [cotizacion, setCotizacion] = useState({
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

    const handleEnviar = () => {
        // TODO: Implementar el envio de la cotizacion
        draftId && console.log(draftId)
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

                    {/* Ítem Actividad Unidad Cantidad Precio unitario Valor sin IVA VALOR SUBTOTAL $ */}
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
