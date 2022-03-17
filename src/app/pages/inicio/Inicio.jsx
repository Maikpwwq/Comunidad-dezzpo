// Pagina de Inicio
import React from 'react'
import { Link, NavLink, Redirect } from 'react-router-dom'
import '../../../../public/assets/css/home.css'
import Registro from '../registro/Registro'
import BuscadorNuevoProyecto from '../../components/buscador/BuscadorNuevoProyecto'
import NuestraComunidad from '../../components/nuestra-comunidad/NuestraComunidad'

// imagenes

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Inicio = () => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="m-0 w-100 bannerComunidad">
                    {/* imagen fondo */}
                    <Col id="contenedorBanner" className="col-6 m-0 p-0">
                        {/* Mensaje del Banner izquierda */}
                        <div className="slogan">
                            <span className="opacidadNegro">
                                {' '}
                                <p className="p-description">
                                    <strong>
                                        <em>
                                            {' '}
                                            Hemos facilitado el servicio, <br />
                                            haciendolo más rapido y <br />
                                            simple que nunca{' '}
                                        </em>
                                    </strong>
                                </p>{' '}
                                <h3 className=".headline-l textVerde">
                                    {' '}
                                    Unete a la Comunidad{' '}
                                </h3>{' '}
                            </span>
                        </div>
                    </Col>
                    {/* Formulario nuevo proyecto */}
                    <Col className="col-md-6 p-0">
                        <BuscadorNuevoProyecto></BuscadorNuevoProyecto>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0 w-100">
                    {/* Mensaje del Banner inferior*/}
                    <Col className="mensajeBanner p-4" md={12}>
                        <p className="p-description textBlanco">
                            {' '}
                            Encuentra aqui un profesional Seguro y Confiable
                            para cada trabajo.
                            <br />
                            Desde iluminación y pequeños arreglos,
                            <br />
                            hasta diseños de ingeniería y remodelaciones
                            remodelaciones completas.{' '}
                        </p>
                    </Col>
                </Row>
            </Container>
            {/* Seccion de Registro */}
            <Registro></Registro>
            <Container fluid className="p-0">
                {/* Seccion de como funciona la comunidad */}
                <Row id="comoFunciona" className="m-0">
                    <Col className="p-4">
                        <h2 className="headline-xl textBlanco">
                            ¿Como funciona nuestra comunidad?
                        </h2>
                        {/* Propietarios */}
                        <Col className="comoPropietarios">
                            <Col
                                className="comunidadTitulo m-4"
                                md={4}
                                sm={10}
                                xs={10}
                            >
                                <h3 className=".headline-l textAzul">
                                    PROPIETARIOS
                                </h3>
                            </Col>
                            <Row className="">
                                <Col
                                    className="nuevoProyecto m-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="body-1 textBlanco">
                                        1 <br />
                                        Crea una nueva oferta gratis <br />
                                        Describe tu proyecto <br />
                                    </p>
                                </Col>
                                <Col
                                    className="seleccionaPerfiles m-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="body-1 textBlanco">
                                        2 <br />
                                        Selecciona el perfil adecuado y consigue
                                        algunas cotizaciones. <br />
                                        El servicio profesional se pondrá en
                                        contacto con tigo. <br />
                                    </p>
                                </Col>
                                <Col
                                    className="calificaServicio m-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="body-1 textBlanco">
                                        3 <br />
                                        Califica y comenta. <br />
                                        Finalizo el proyecto, <br />
                                        Dejanos conocer tu experiencia. <br />
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        {/* Comerciantes Calificados */}
                        <Col className="comoComerciantes">
                            <Col className="comunidadTitulo m-4" md={4}>
                                <h3 className=".headline-l textAzul">
                                    COMERCIANTES CALIFICADOS
                                </h3>
                            </Col>
                            <Row className="">
                                <Col
                                    className="buscarOfertas m-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="body-1 textBlanco">
                                        1 <br />
                                        Busca la oferta indicada para ti. <br />
                                        Filtra los proyectos de los propietarios
                                        y postulate. <br />
                                    </p>
                                </Col>
                                <Col
                                    className="cargaPresupuesto m-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="body-1 textBlanco">
                                        2 <br />
                                        Diligencia el presupuesto. <br />
                                        Haz una cotizacion detallada con los
                                        datos suministrados, <br />
                                        en caso de ser escogido por el
                                        propietario para desarrollar el
                                        servicio, nos pagaras una comisión por
                                        el servicio prestado <br />
                                    </p>
                                </Col>
                                <Col
                                    className="calificaPropietario m-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="body-1 textBlanco">
                                        3 <br />
                                        Califica y comenta. <br />
                                        Finalizo el proyecto, <br />
                                        Dejanos conocer tu experiencia. <br />
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Col>
                </Row>
            </Container>
            {/* seccion de categorias y servicios */}
            <NuestraComunidad></NuestraComunidad>
        </>
    )
}

export default Inicio
