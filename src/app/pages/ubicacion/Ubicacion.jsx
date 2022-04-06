import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../../public/assets/css/ubicacion.css'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Ubicacion = () => {
    const navigate = useNavigate()
    const handleConsult = () => {
        navigate('/app/perfil')
    }
    return (
        <>
            <Container fluid className="p-0">
                <Row className="ingresoUbicacion m-0 w-100">
                    <Col className="left m-4 p-0 pt-4 pb-4">
                        <Form action="busquedaCiudad">
                            <h3 className="headline-l textBlanco">
                                Ingresa tu ubicación
                            </h3>{' '}
                            <p className="body-1 textBlanco">
                                Podras consultar con mejor precision los costos
                                y tiempos de entrega.
                            </p>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicCity"
                            >
                                <Form.Label className="mb-0">
                                    Elija su ciudad
                                </Form.Label>
                                <Form.Select name="city" id="city">
                                    <option>seleccionar uno</option>
                                    <option value="Bogota">Bogota</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicStreet"
                            >
                                <Form.Label className="mb-0">
                                    Dirección
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Registre la dirección"
                                    name="street"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Col>
                                    <hr />
                                    <Button
                                        className="btn-round btn-high"
                                        variant="primary"
                                        type="submit"
                                        onClick={handleConsult}
                                    >
                                        Consultar
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className="imagenUbicacion"></Col>
                </Row>
            </Container>
        </>
    )
}

export default Ubicacion
