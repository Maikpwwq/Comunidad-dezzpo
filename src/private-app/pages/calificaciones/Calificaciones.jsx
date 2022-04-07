// Pagina de Usuario - Notificaciones
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import InputLabel from '@mui/material/InputLabel'
import FormLabel from '@mui/material/FormLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

const Calificaciones = (props) => {
    const handleSubmit = () => {}

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
                        <Col className="col-8">
                            <FormLabel
                                className="body-2"
                                forHtml="addMetodoPago"
                            >
                                Gestión: <br />
                                Cumple con los tiempos de entrega de las
                                certificaciones,- polizas, actas y contratos
                            </FormLabel>
                            <FormControl className="pb-4">
                                <Select name="Gestión" id="Gestión" autoWidth>
                                    <MenuItem value="">
                                        <em>seleccione </em>
                                    </MenuItem>
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="2">2</MenuItem>
                                    <MenuItem value="3">3</MenuItem>
                                    <MenuItem value="4">4</MenuItem>
                                    <MenuItem value="5">5</MenuItem>
                                </Select>
                            </FormControl>

                            <FormLabel className="body-2" forHtml="Calidad">
                                Calidad: <br />
                                El servicio cumplio con las especificaciones y
                                normas tecnicas establecidas, mientras el
                                personal contratado fue suficiente y tenia todas
                                las competencias necesarias para ejecutar las
                                actividades del contrato
                            </FormLabel>
                            <FormControl className="pb-4">
                                <Select name="Calidad" id="Calidad" autoWidth>
                                    <MenuItem value="">
                                        <em>seleccione </em>
                                    </MenuItem>
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="2">2</MenuItem>
                                    <MenuItem value="3">3</MenuItem>
                                    <MenuItem value="4">4</MenuItem>
                                    <MenuItem value="5">5</MenuItem>
                                </Select>
                            </FormControl>
                            <FormLabel className="body-2" forHtml="Oportunidad">
                                Oportunidad: <br />
                                El servicio fue prestado en las fechas y horario
                                programados, además las facturas, soportes y
                                documentos contractuales fueren entregados
                                oportunamente
                            </FormLabel>
                            <FormControl className="pb-4">
                                <Select
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
                            </FormControl>
                            <TextareaAutosize
                                // value={userEditInfo.userDescription}
                                // onChange={handleChange}
                                name="userDescription"
                                id="ofertaServicios"
                                placeholder="Observaciones generales"
                                cols="30"
                                minRows={8}
                                className="w-80"
                            ></TextareaAutosize>
                            <Button type="submit" onClick={handleSubmit}>
                                Enviar
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Calificaciones
