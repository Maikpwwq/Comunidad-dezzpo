// Pagina de registro
import React from 'react'
import { Link, NavLink, Redirect } from 'react-router-dom'

import '../../../../public/assets/css/registro.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Registro = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row id="registrate" className="m-0">
                    <Col className="registrateImagen m-0"></Col>
                    <Col className="registrateformulario m-0">
                        <form id="formularioRegistro" action="">
                            <div>
                                <h1>REGISTRATE</h1>
                                <p>
                                    Bienvenido a todos los beneficios de dezzpo.
                                </p>
                                <label htmlFor="">Nombre</label>
                                <br />
                                <input type="text" value="" name="name" />
                                <br />
                                <label htmlFor="">Nombre de usuario</label>
                                <br />
                                <input type="text" value="" name="username" />
                                <br />
                                <label htmlFor="">Email</label>
                                <br />
                                <input type="email" value="" name="email" />
                                <br />
                                <label htmlFor="">Contraseña</label>
                                <br />
                                <input
                                    type="password"
                                    value=""
                                    name="password"
                                />
                                <br />
                                <label htmlFor="">Confirme la Contraseña</label>
                                <br />
                                <input
                                    type="password"
                                    value=""
                                    name="confirmPassword"
                                />
                                <br />
                                <label htmlFor="">
                                    {' '}
                                    No soy un robot
                                    <input type="checkbox" checked="checkbox" />
                                </label>{' '}
                                <br />
                                <button type="submit">
                                    <Link to="/app">Crear Cuenta</Link>
                                </button>
                                {/* <p>Bienvenido</p> */}
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Registro
