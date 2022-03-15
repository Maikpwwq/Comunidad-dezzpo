// Pagina de registro
import * as React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import '../../../../public/assets/css/registro.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Registro = (props) => {
    const { showLogo } = props

    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/app/*')
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
                    <Col className="registrateformulario m-0" md={6} sm={12}>
                        <form
                            id="formularioRegistro"
                            action=""
                            // preventDefault="true"
                        >
                            <div>
                                <h2 className="headline-xl">REGISTRATE</h2>
                                <p className="body-1">
                                    Bienvenido a todos los beneficios de dezzpo.
                                </p>
                                <label htmlFor="">Nombre</label>
                                <br />
                                <input
                                    type="text"
                                    placeholder=""
                                    id="name"
                                    name="name"
                                />
                                <br />
                                <label htmlFor="">Nombre de usuario</label>
                                <br />
                                <input
                                    type="text"
                                    value=""
                                    id="username"
                                    name="username"
                                />
                                <br />
                                <label htmlFor="">Email</label>
                                <br />
                                <input
                                    type="email"
                                    value=""
                                    id="email"
                                    name="email"
                                />
                                <br />
                                <label htmlFor="">Contraseña</label>
                                <br />
                                <input
                                    type="password"
                                    value=""
                                    name="password"
                                    id="password"
                                />
                                <br />
                                <label htmlFor="">Confirme la Contraseña</label>
                                <br />
                                <input
                                    type="password"
                                    value=""
                                    name="confirmPassword"
                                    id="confirmPassword"
                                />
                                <br />
                                <label htmlFor="">
                                    {' '}
                                    No soy un robot
                                    <input type="checkbox" checked="checkbox" />
                                </label>{' '}
                                <br />
                                <button onClick={handleClick}>
                                    Crear Cuenta
                                </button>
                                {/* <p>Bienvenido</p> */}
                            </div>
                        </form>
                        <NavLink to="/app/">click here</NavLink>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Registro
