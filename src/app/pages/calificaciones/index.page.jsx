export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Notificaciones
import React, { useState } from 'react'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import { Button, TextareaAutosize, Rating, FormLabel } from '@mui/material'
import Button from '@mui/material/Button'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Rating from '@mui/material/Rating'
import FormLabel from '@mui/material/FormLabel'
// import FormControl from '@mui/material/FormControl'
// import InputLabel from '@mui/material/InputLabel'
// import Select from '@mui/material/Select'
// import MenuItem from '@mui/material/MenuItem'

const Page = () => {
    const [rate, setRate] = useState({
        gestion: 0,
        calidad: 0,
        oportunidad: 0,
        description: '',
    })
    const handleSubmit = () => {}

    const handleRate = (value, name) => {
        console.log(value, name)
        if (name === 'calidad') {
            setRate({ ...rate, calidad: value })
        } else if (name === 'gestion') {
            setRate({ ...rate, gestion: value })
        } else if (name === 'oportunidad') {
            setRate({ ...rate, oportunidad: value })
        }
    }

    const handleChange = (event) => {
        console.log(event.target.value)
        setRate({ ...rate, description: event.target.value })
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex pt-4 pb-4">
                    <Col className="col-10">
                        <h2 className="headline-xl">Calificaciones</h2>
                        {/* Estatus (Premium, Gold, Plus, Básico) */}
                        <p className="p-description">
                            Evaluacion del desempeño
                        </p>
                        <p className="body-1">
                            Valore el usuario segun los siguientes tres
                            aspectos:
                        </p>
                        <Col className="col-12">
                            <FormLabel
                                className="body-2 pt-4 d-flex align-items-center w-100 justify-content-between"
                                forHtml="addMetodoPago"
                            >
                                <Col className="col-10 body-1">
                                    Gestión: <br />
                                    Cumple con los tiempos de entrega de las
                                    certificaciones,- polizas, actas y
                                    contratos.
                                </Col>
                                <br />
                                <Rating
                                    name="gestion"
                                    value={rate.gestion}
                                    onClick={(e) =>
                                        handleRate(
                                            e.target.value,
                                            e.target.name
                                        )
                                    }
                                />
                                {/* <FormControl className="ps-4 pb-2">
                                    <Select
                                        style={{ width: '10%' }}
                                        value=""
                                        name="Gestión"
                                        id="Gestión"
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>seleccione </em>
                                        </MenuItem>
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                    </Select>
                                </FormControl> */}
                            </FormLabel>

                            <FormLabel
                                className="body-2 pt-4 d-flex align-items-center w-100 justify-content-between"
                                forHtml="Calidad"
                            >
                                <Col className="col-10 body-1">
                                    Calidad:
                                    <br />
                                    El servicio cumplio con las especificaciones
                                    y normas tecnicas establecidas, mientras el
                                    personal contratado fue suficiente y tenia
                                    todas las competencias necesarias para
                                    ejecutar las actividades del contrato.
                                </Col>
                                <br />
                                <Rating
                                    name="calidad"
                                    value={rate.calidad}
                                    onClick={(e) =>
                                        handleRate(
                                            e.target.value,
                                            e.target.name
                                        )
                                    }
                                />
                                {/* <FormControl className="ps-4 pb-2">
                                    <Select
                                        style={{ width: '10%' }}
                                        value=""
                                        name="Calidad"
                                        id="Calidad"
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>seleccione </em>
                                        </MenuItem>
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                    </Select>
                                </FormControl> */}
                            </FormLabel>

                            <FormLabel
                                className="body-2 pt-4 pb-4 d-flex align-items-center w-100 justify-content-between"
                                forHtml="Oportunidad"
                            >
                                <Col className="col-10 body-1">
                                    Oportunidad: <br />
                                    El servicio fue prestado en las fechas y
                                    horario programados, además las facturas,
                                    soportes y documentos contractuales fueren
                                    entregados oportunamente.
                                </Col>
                                <br />
                                <Rating
                                    name="oportunidad"
                                    value={rate.oportunidad}
                                    onClick={(e) =>
                                        handleRate(
                                            e.target.value,
                                            e.target.name
                                        )
                                    }
                                />
                                {/* <FormControl className="ps-4 pb-4">
                                    <Select
                                        style={{ width: '10%' }}
                                        value=""
                                        name="Oportunidad"
                                        id="Oportunidad"
                                        autoWidth
                                    >
                                        <MenuItem value="">
                                            <em>seleccione </em>
                                        </MenuItem>
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                    </Select>
                                </FormControl> */}
                            </FormLabel>

                            <TextareaAutosize
                                value={rate.description}
                                onChange={handleChange}
                                name="rateDescription"
                                placeholder="Observaciones generales"
                                cols="50"
                                minRows={4}
                                className="w-80"
                            ></TextareaAutosize>
                            <Row className="pt-4">
                                <Col>
                                    <Button
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        Enviar
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
