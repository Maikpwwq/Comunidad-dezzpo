/* eslint-disable prettier/prettier */
// Pagina de Ingreso
import React from 'react'
import '../../../../public/assets/css/ingreso.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Ingreso = (props) => {
    let checkStyle = {
        width: '30px',
    }

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
                            <form id="formularioIngreso" action="">
                                <hr />
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="correo o número celular"
                                />
                                <br />
                                <br />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="contraseña"
                                />
                                <br />
                                <span>
                                    <a href="">OLVIDASTE LA CONTRASEÑA</a>
                                </span>
                                <br />
                                <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    style={checkStyle}
                                />
                                <span> Recuérdame </span>
                                <br />
                                <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    style={checkStyle}
                                    required
                                />
                                <span> NO SOY UN ROBOT </span> <br />
                                <br />
                                <button>INICIAR SESIÓN</button>
                                <br />
                                <hr />
                            </form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="ingresoUbicacion m-0 w-100">
                    <Col className="colLeft">
                        <span className="tituloformulario">
                            {' '}
                            <h3 className="headline-l textBlanco">
                                Ingresa tu ubicación
                            </h3>{' '}
                        </span>
                        <p className="body-1 textBlanco">
                            Podras consultar con mejor <br />
                            precision los costos y <br />
                            tiempos de entrega <br />
                        </p>
                        <form action="busquedaCiudad">
                            <label htmlFor=""> Ciudad </label>
                            <br />
                            <select name="city" id="city">
                                <option>seleccionar uno</option>
                                <option value="Bogota">Bogota</option>
                            </select>
                            <br />
                            <label htmlFor="">Dirección</label>
                            <br />
                            <input type="text" />
                            <br />
                            <button className="btn">Consultar</button>
                        </form>
                    </Col>
                    <Col className="imagenUbicacion"></Col>
                </Row>
            </Container>
        </>
    )
}

export default Ingreso
