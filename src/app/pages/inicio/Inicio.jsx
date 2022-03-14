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
                <Row className="m-0 w-100" id="bannerComunidad">
                    {/* imagen fondo */}
                    <Col id="contenedorBanner" className="m-0 p-0">
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
                                <h3 className=".headline-l titulosVerde">
                                    {' '}
                                    Unete a la Comunidad{' '}
                                </h3>{' '}
                            </span>
                        </div>
                        {/* Formulario nuevo proyecto */}
                        <BuscadorNuevoProyecto></BuscadorNuevoProyecto>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="m-0 w-100">
                    {/* Mensaje del Banner inferior*/}
                    <Col className="mensajeBanner" md={12}>
                        <p className="p-description">
                            {' '}
                            Encuentra aqui un profesional Seguro y Confiable
                            para cada trabajo.
                            <br />
                            Desde iluminación y pequeños arreglos, hasta diseños
                            de ingeniería y remodelaciones remodelaciones
                            completas.{' '}
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
                        <h2 className="headline-xl">
                            ¿Como funciona nuestra comunidad?
                        </h2>
                        {/* Propietarios */}
                        <div className="comoPropietarios">
                            <Col className="comunidadTitulo" md={4}>
                                <h3 className=".headline-l titulosAzul">
                                    PROPIETARIOS
                                </h3>
                            </Col>
                            <Col className="nuevoProyecto">
                                <p className="body-1">
                                    1 <br />
                                    Crea una nueva oferta gratis <br />
                                    Describe tu proyecto <br />
                                </p>
                            </Col>
                            <Col className="seleccionaPerfiles">
                                <p className="body-1">
                                    2 <br />
                                    Selecciona el perfil adecuado y <br />
                                    consigue algunas cotizaciones. <br />
                                    El servicio profesional se pondrá en <br />
                                    contacto con tigo. <br />
                                </p>
                            </Col>
                            <Col className="calificaServicio">
                                <p className="body-1">
                                    3 <br />
                                    Califica y comenta. <br />
                                    Finalizo el proyecto, <br />
                                    Dejanos conocer tu experiencia. <br />
                                </p>
                            </Col>
                        </div>
                        {/* Comerciantes Calificados */}
                        <div className="comoComerciantes">
                            <Col className="comunidadTitulo" md={4}>
                                <h3 className=".headline-l titulosAzul">
                                    COMERCIANTES CALIFICADOS
                                </h3>
                            </Col>
                            <Col className="buscarOfertas">
                                <p className="body-1">
                                    1 <br />
                                    Busca la oferta indicada para ti. <br />
                                    Filtra los proyectos de los <br />
                                    propietarios y postulate. <br />
                                </p>
                            </Col>
                            <Col className="cargaPresupuesto">
                                <p className="body-1">
                                    2 <br />
                                    Diligencia el presupuesto <br />
                                    Haz una cotizacion detallada con los datos
                                    suministrados, <br />
                                    en caso de ser escogido por el propietario
                                    para desarrollar el <br />
                                    servicio, nos pagaras una comisión por el
                                    servicio prestado <br />
                                </p>
                            </Col>
                            <Col className="calificaPropietario">
                                <p className="body-1">
                                    3 <br />
                                    Califica y comenta. <br />
                                    Finalizo el proyecto, <br />
                                    Dejanos conocer tu experiencia. <br />
                                </p>
                            </Col>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* seccion de categorias y servicios */}
            <NuestraComunidad></NuestraComunidad>
        </>
    )
}

export default Inicio
