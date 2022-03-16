// Pagina de registro
import * as React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import '../../../../public/assets/css/registro.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Registro = (props) => {
    const { showLogo } = props

    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/app/perfil')
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row id="registrate" className="m-0">
                    {showLogo == false ? (
                        <></>
                    ) : (
                        <Col
                            className="registrateImagen m-0"
                            md={6}
                            sm={12}
                        ></Col>
                    )}
                    <Col
                        className="registrateformulario m-0 p-0"
                        md={6}
                        sm={12}
                    >
                        <Form
                            id="formularioRegistro"
                            action=""
                            className="p-4"
                            // preventDefault="true"
                        >
                            <h2 className="headline-xl textBlanco">
                                REGISTRATE
                            </h2>
                            <p className="body-1 textBlanco">
                                Bienvenido a todos los beneficios de dezzpo.
                            </p>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicName"
                            >
                                <Form.Label className="mb-0">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Registre su nombre"
                                    name="name"
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicName"
                            >
                                <Form.Label className="mb-0">
                                    Nombre de usuario
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Elija su usuario"
                                    name="username"
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicEmail"
                            >
                                <Form.Label className="mb-0">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Registre una cuenta de email valida"
                                    name="email"
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicPassword"
                            >
                                <Form.Label className="mb-0">
                                    Contraseña
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Registre una clave"
                                    name="password"
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicPassword"
                            >
                                <Form.Label className="mb-0">
                                    Confirme la Contraseña
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="De nuevo la clave"
                                    name="confirmPassword"
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
                            <Col>
                                <Button
                                    className="btn-round btn-high"
                                    variant="primary"
                                    type="submit"
                                    onClick={handleClick}
                                >
                                    Crear Cuenta
                                </Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Registro
