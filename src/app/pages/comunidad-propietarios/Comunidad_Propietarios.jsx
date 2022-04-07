// Pagina de Comunidad Propietarios
import React from 'react'
import '../../../../public/assets/css/comunidad_propietarios.css'

import Registro from '../../pages/registro/Registro'
import BuscadorNuevoProyecto from '../../components/buscador/BuscadorNuevoProyecto'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const ComunidadPropietarios = (props) => {
    let checkStyle = {
        width: '30px',
    }

    return (
        <>
            <Container fluid className="p-0" style={{ 'overflow-y': 'scroll' }}>
                <Row className="comunidadPropietariosTitulo m-0 d-flex flex-row justify-content-start align-content-start">
                    <Col className="col-md-6 align-items-start">
                        <Col
                            className="w-100 opacidadNegro mt-4 mb-4"
                            md={6}
                            sm={12}
                            lg={4}
                        >
                            <span className="pitchPropietarios">
                                {' '}
                                <p className="p-description">
                                    SOMOS UNA COMUNIDAD DE COMERCIANTES
                                    PROFESIONALES, CONTRATA PERSONAL CALIFICADO
                                    MANTENIMIENTO GENERAL RESIDENCIAL Y DE
                                    PROPIEDAD HORIZONTAL, CONSULTA PÚBLICAMENTE
                                    LOS PERFILES Y LA REPUTACIÓN DE LOS
                                    PRESTADORES DE SERVICIOS. AHORA TUS
                                    PROYECTOS Y REMODELACIONES MÁS RÁPIDO Y
                                    SIMPLE QUE NUNCA <br />
                                </p>
                            </span>
                            <h3 className=".headline-l textVerde">
                                Contrata seguro con <br />
                                nuestra comunidad
                            </h3>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidadPropietariosRegistro m-0 d-flex flex-column">
                    <Col className="m-0" style={{ 'padding-left': '0px' }}>
                        <span className="pitchPropietarios">
                            <h2 className="textBlanco headline-xl">
                                {' '}
                                COMUNIDAD PROPIETARIOS
                            </h2>
                        </span>
                        <Registro></Registro>
                    </Col>
                    <Col md={8}>
                        <div className="imagenRegistro"></div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidadPropietariosBuscador m-0 row">
                    <Col
                        className="justify-content-center align-items-center"
                        lg={4}
                        md={6}
                        sm={10}
                    >
                        <Col className="opacidadNegro">
                            <p className="body-2">
                                Con ayuda de la comunidad haz realidad la casa
                                que deseas. Encuentra un profesional Seguro y
                                Confiable, para cada trabajo. Desde iluminación
                                y pequeños arreglos, hasta diseños de ingeniería
                                y remodelaciones completas.
                            </p>
                        </Col>
                    </Col>
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
                <Row className="comunidadPropietariosConsultar m-0 row p-4">
                    <Col className="col-10">
                        <Col className="col-12 m-4">
                            <h3 className=".headline-l">
                                Planea con nosotros el proyecto
                            </h3>
                            <p className="body-1">
                                El espacio de tus sueños comienza con una gran
                                idea y tenemos miles de ellas.
                            </p>
                        </Col>
                        <Col
                            className="col d-flex flex-column align-items-baseline"
                            md={4}
                            style={{ 'justify-content': 'space-evenly' }}
                        >
                            <p className="body-2">
                                Nuestra recomendación esencial al contratar un
                                comerciante calificado, nunca cancelar la
                                totalidad por adelantado, revisar siempre las
                                referencias, calificaciones y afiliaciones del
                                perfil.
                            </p>
                            <span className="pitchPropietarios">
                                <p className=".headline-l">
                                    Propietario revisa la
                                </p>
                            </span>
                            <Button className="btn" onClick="listaChequeo">
                                lista de chequeo
                            </Button>
                            <span className="body-2">
                                3196138057
                                <br />
                                Lunes a viernes, 8am - 5pm
                                <br />
                                Sabados 9am - 2pm
                                <br />
                            </span>
                        </Col>
                        <Col
                            className="col d-flex flex-column align-items-baseline"
                            md={4}
                            style={{ 'justify-content': 'space-evenly' }}
                        >
                            <span className="pitchPropietarios">
                                <h3 className=".headline-l">Observa cambios</h3>
                            </span>
                            <p className="body-1">
                                Inspirate, tenemos muchos trabajos realizados.
                            </p>
                            <span className="pitchPropietarios">
                                <h3 className=".headline-l">
                                    ¿Requieres de asesoria?
                                </h3>
                            </span>
                            <p className="body-1">
                                Nuestra comunidad de comerciantes calificados te
                                ayudaran con tus inquietudes.
                            </p>
                            <span className="pitchPropietarios">
                                <h3 className=".headline-l">Presupuestos</h3>
                            </span>
                            <p className="body-1">
                                Saber cuanto te puede costar es importante para
                                iniciar el proyecto.
                            </p>
                        </Col>
                        <Col
                            className="col d-flex flex-column align-items-center"
                            md={4}
                            style={{ 'justify-content': 'space-evenly' }}
                        >
                            <Button className="btn btn-primary btn-high">
                                Nuestro Blog
                            </Button>
                            <Button className="btn btn-primary btn-high">
                                Proyectos <br />
                                Destacados
                            </Button>
                            <Button className="btn btn-primary btn-high">
                                Pregunta a un <br />
                                Profesional
                            </Button>
                            <Button className="btn btn-primary btn-high">
                                Comenzar <br />
                                Cotización
                            </Button>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="comunidadPropietariosListaVerificacion m-0">
                    <Col
                        className="col-8 p-0 m-0 pt-4 mt-4 pb-4 mb-4"
                        id="listaChequeo"
                    >
                        <h2 className=".headline-xl textBlanco ps-4 ms-4">
                            LISTA DE VERIFICACION
                        </h2>
                        <ul className="body-1">
                            <li> - Verifica Adecuadamente La Identidad. </li>
                            <li>
                                {' '}
                                - Que el personal cuente con los elementos de
                                protección personal requeridos.{' '}
                            </li>
                            <li>
                                {' '}
                                - Recuerda verificar los certificados tecnicos y
                                de afiliación propios de cada labor. <br />
                                <strong>
                                    -- Trabajo seguro en alturas, arl, eps,
                                    instalaciones gasodomesticas, polizas --
                                </strong>
                            </li>
                            <li>
                                {' '}
                                - Diligenciar y firmar debidamente el contrato
                                de prestación de servicios.{' '}
                            </li>
                            <li>
                                - Las obras que afectan a terceros de la
                                comunidad, como muros de carga o de fachada, han
                                de hacerse saber para conseguir su aprobación.
                                Sin embargo ten en cuenta que además es
                                necesario un permiso de obra que concede la
                                curaduria urbana, al presentar el proyecto
                                firmado por un arquitecto.{' '}
                            </li>
                            <li>
                                {' '}
                                - Cuando hallas elegido el profesional
                                comerciante calificado para tu proyecto,
                                descarga y utiliza el contrato de adquicisión,
                                esto para resolver discrepancias concretas
                                durante el desarrollo del servicio.{' '}
                            </li>
                            <li>
                                - Comun mente en el desarrolllo del servicio
                                surgen imprevistos, estos no son posibles de
                                planear al diseñar, reserva un 5% del
                                presupuesto en caso de que alguna eventualidad
                                se presente.{' '}
                            </li>
                            <li>
                                - Expon claramente cualquier aspecto de la
                                ejecucción que pueda influir con el resultado
                                final <br />
                                <strong>
                                    -- tiempos de permanencia, color, marca,
                                    tiempos de secado, etc --
                                </strong>{' '}
                            </li>
                            <li>
                                - Si el proyecto tiene un inpacto energetico y/o
                                ecologico, Concretamente el instituto para la,
                                ofrece ayudas y subvenciones institucionales
                            </li>
                            <span className=".headline-l textVerde">
                                {' '}
                                - Se resuelve la encuesta de satisfacción del
                                servicio
                            </span>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ComunidadPropietarios
