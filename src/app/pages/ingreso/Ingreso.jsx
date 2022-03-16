/* eslint-disable prettier/prettier */
// Pagina de Ingreso
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../../../../public/assets/css/ingreso.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Ingreso = (props) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/app/perfil')
    }

    let checkStyle = {
        width: '30px',
    }
    //

    return (
        <>
            <Container fluid className="p-0">
                <Row className="ingresoFormulario  m-0 w-100">
                    <Col className="imagenIngreso"></Col>
                    <Col className="colRight">
                        <div className="ingresarFormulario">
                            <h2 className="headline-l textBlanco">
                                Bienvenido!
                            </h2>

                            <p className="body-1 textBlanco">
                                ERES NUEVO, <br />
                                CREA FÁCIL UNA CUENTA!
                                <a className="body-2" href="">
                                    , Registrate
                                </a>
                            </p>
                            <br />
                            <ul>
                                <li>
                                    <a href="">INGRESAR CON FACEBOOK </a>
                                </li>
                                <li>
                                    <a href="">INGRESAR CON GMAIL </a>
                                </li>
                            </ul>
                            <br />
                            <hr />
                            <Form id="formularioIngreso" action="">
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicCredential"
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="correo o número celular"
                                        value=""
                                        name="credential"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Control
                                        type="password"
                                        placeholder="contraseña"
                                        value=""
                                        name="password"
                                    />
                                </Form.Group>
                                <Button
                                    className="BOTON-TEXT"
                                    variant="primary"
                                    type="submit"
                                    onClick={handleClick}
                                >
                                    OLVIDASTE LA CONTRASEÑA
                                </Button>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicCheckboxRecordar"
                                >
                                    <Form.Check
                                        className=""
                                        type="checkbox"
                                        label="Recuérdame"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicCheckboxRobot"
                                >
                                    <Form.Check
                                        className=""
                                        type="checkbox"
                                        label="No soy un robot"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Col>
                                        <hr />
                                        <Button
                                            className="btn-round btn-high"
                                            variant="primary"
                                            type="submit"
                                            onClick={handleClick}
                                        >
                                            INICIAR SESIÓN
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="ingresoUbicacion m-0 w-100">
                    <Col className="left m-4 p-0 pt-4 pb-4">
                        <Form action="busquedaCiudad">
                            <h3 className="headline-l textBlanco">
                                Ingresa tu ubicación
                            </h3>{' '}
                            <p className="body-1 textBlanco">
                                Podras consultar con mejor <br />
                                precision los costos y <br />
                                tiempos de entrega <br />
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
                                        onClick={handleClick}
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

export default Ingreso
