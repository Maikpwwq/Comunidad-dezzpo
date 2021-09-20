// Pagina de Asesorias
import React from 'react'
import '../../../../public/assets/css/asesorias.css'
import { Link } from 'react-router-dom'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Asesorias = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="asesoriasTitulo m-0 w-100">
                    <Col>
                        {/* Mensaje del Banner izquierda */}
                        <span className="opacidadNegro">
                            ASESORÍAS EN VIVO
                            <br />
                            <p className="asesoriaMessage">
                                Consulta a un profesional de la comunidad, y
                                resulve ya las dudas que tengas en cuanto a
                                tecnicas, especificaciones de materiales,
                                alcance, tiempo y costo, de tu nuevo proyecto.
                            </p>
                        </span>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asesoriasPreguntas m-0 w-100">
                    <Col className="row">
                        <Col className="col1">
                            <h1>¿Requieres de una asesoria?</h1>
                            <p>
                                Nuestra comunidad de comerciantes calificados te
                                ayudaran con
                                <br />
                                tus inquietudes.
                            </p>
                            <h2>Realiza una pregunta a un profesional</h2>
                            <span>obten ayuda gratuita de la comunidad</span>
                            <br />
                            <form action="">
                                <input
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="dale un titulo a tu pregunta"
                                />
                                <br />
                                <label htmlFor="">
                                    ¿Qué quisieras conocer?
                                </label>
                                <br />
                                <textarea name="" id="" rows="5" cols="30">
                                    Recuerda entre mas detallado puedas
                                    describirlo mejores respuestas obtendras
                                </textarea>
                                <br />
                                <select name="" id="">
                                    <optgroup>
                                        categorias
                                        <option value="">Nuevo</option>
                                        <option value="">Controversial</option>
                                        <option value="">Destacado</option>
                                    </optgroup>
                                </select>
                                <button className="btn">PUBLICAR</button>
                            </form>
                        </Col>
                        <Col className="col2">
                            <span className="chatAsesor">
                                Contacta Con Un Asesor
                                <br />
                                en Tiempo Real En Nuestro Chat
                            </span>
                            <br />
                            <button className="btn" onClick="">
                                CHAT EN VIVO
                            </button>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asesoriasBlog m-0 w-100">
                    <Col className="col3">
                        <p>
                            Postulando una pregunta, estas creando una cuenta
                            gratuita y accediento a aceptar nuestra <br />
                            <Link to="/legal">politica de privacidad</Link> y
                            los
                            <Link to="/legal">terminos de uso</Link>
                        </p>
                        <h2>Historial de preguntas de la comunidad</h2>
                        <p>
                            Revisa las ultimas preguntas y respuestas de la
                            comunidad, y participa.
                        </p>
                    </Col>
                    <Col className="col2">
                        <button className="btn">BLOG DE LA COMUNIDAD</button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Asesorias
