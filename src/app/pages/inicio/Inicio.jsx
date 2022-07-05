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
                    <Col
                        id="contenedorBanner"
                        className="m-0 p-0"
                        lg={6}
                        md={6}
                        sm={12}
                    >
                        {/* Mensaje del Banner izquierda */}
                        <div className="slogan">
                            <span className="opacidadNegro">
                                {' '}
                                <p className="p-description">
                                    <strong className="pb-4">
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
                    <Col
                        className="col m-4 p-0"
                        xl={4}
                        lg={6}
                        xm={6}
                        md={8}
                        sm={12}
                        xs={12}
                    >
                        <BuscadorNuevoProyecto></BuscadorNuevoProyecto>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0 w-100 mensajeBanner">
                    {/* Mensaje del Banner inferior*/}
                    <Col className="p-4" lg={7} md={8} sm={10}>
                        <p className="m-0 p-description textBlanco">
                            {' '}
                            Encuentra aqui un profesional Seguro y Confiable
                            para cada trabajo. Desde iluminación y pequeños
                            arreglos, hasta diseños de ingeniería y
                            remodelaciones completas.
                        </p>
                    </Col>
                </Row>
            </Container>
            {/* Seccion de Registro */}
            <Registro></Registro>
            <Container fluid className="p-0">
                {/* Seccion de como funciona la comunidad */}
                <Row id="comoFunciona" className="m-0">
                    <Col className="">
                        <h3 className="pt-4 headline-l textBlanco">
                            ¿Como funciona nuestra comunidad?
                        </h3>
                        {/* Propietarios */}
                        <Col className="comoPropietarios">
                            <Row className="">
                                <Col
                                    className="comunidadTitulo m-4 w-auto"
                                    md={3}
                                    sm={10}
                                    xs={10}
                                >
                                    <h4 className="headline-s textAzul">
                                        PROPIETARIOS
                                    </h4>
                                </Col>
                                <Col
                                    className="nuevoProyecto p-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l text-white pb-2 justify-content-center">
                                        1
                                    </p>
                                    <p className="body-1 textBlanco flex-column">
                                        <strong className="pb-4">
                                            Crea una nueva oferta gratis.
                                        </strong>{' '}
                                        Describe tu proyecto <br />
                                    </p>
                                </Col>
                                <Col
                                    className="seleccionaPerfiles p-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l text-white pb-2 justify-content-center">
                                        2
                                    </p>
                                    <p className="body-1 textBlanco flex-column">
                                        <strong className="pb-4">
                                            Selecciona el perfil adecuado y
                                            consigue algunas cotizaciones.
                                        </strong>{' '}
                                        El servicio profesional se pondrá en
                                        contacto con tigo. <br />
                                    </p>
                                </Col>
                                <Col
                                    className="calificaServicio p-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l text-white pb-2 justify-content-center">
                                        3
                                    </p>
                                    <p className="body-1 textBlanco flex-column">
                                        <strong className="pb-4">
                                            Califica y comenta.
                                        </strong>{' '}
                                        Finalizo el proyecto, <br />
                                        Dejanos conocer tu experiencia. <br />
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        {/* Comerciantes Calificados */}
                        <Col className="comoComerciantes">
                            <Row className="">
                                <Col
                                    className="comunidadTitulo p-4 w-auto"
                                    md={3}
                                >
                                    <h4 className="headline-s textAzul">
                                        COMERCIANTES <br />
                                        CALIFICADOS
                                    </h4>
                                </Col>
                                <Col
                                    className="buscarOfertas p-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l text-white pb-2 justify-content-center">
                                        1
                                    </p>
                                    <p className="body-1 textBlanco flex-column">
                                        <strong className="pb-4">
                                            Busca la oferta indicada para ti.
                                        </strong>{' '}
                                        Filtra los proyectos de los propietarios
                                        y postulate. <br />
                                    </p>
                                </Col>
                                <Col
                                    className="cargaPresupuesto p-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l text-white pb-2 justify-content-center">
                                        2
                                    </p>
                                    <p className="body-1 textBlanco flex-column">
                                        <strong className="pb-4">
                                            Diligencia el presupuesto.
                                        </strong>
                                        Haz una cotizacion detallada con los
                                        datos suministrados, en caso de ser
                                        escogido por el propietario para
                                        desarrollar el servicio, nos pagaras una
                                        comisión por el servicio prestado <br />
                                    </p>
                                </Col>
                                <Col
                                    className="calificaPropietario p-4"
                                    md={3}
                                    sm={6}
                                >
                                    <p className="m-auto headline-l text-white pb-2 justify-content-center">
                                        3
                                    </p>
                                    <p className="body-1 textBlanco flex-column">
                                        <strong className="pb-4">
                                            Califica y comenta.
                                        </strong>
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
