// Pagina de Asi Trabajamos
import React from 'react'
import '../../../../public/assets/css/asi_trabajamos.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

const AsiTrabajamos = (props) => {
    return (
        <>
            <div className="asiTrabajamosRegistro">
                {/* se importa el componente de registro */}
            </div>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosChat m-0 w-100 d-flex justify-content-end">
                    <Col className="col d-flex" md={6} sm={12}>
                        <span className="chatAsesor headline-xl">
                            Contacta Con Un Asesor
                            <br />
                            en Tiempo Real En Nuestro Chat
                        </span>
                        <br />
                        <Button className="btn btn-round btn-high">
                            <a
                                className="body-1"
                                href="https://api.whatsapp.com/send?phone=573196138057"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                CHAT EN VIVO
                            </a>
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosVinculate m-0 w-100 d-flex justify-content-end">
                    <Col className="col d-flex center" lg={4} md={8} sm={12}>
                        <span className="headline-xl opacidadNegro">
                            {' '}
                            PERFIL COMERCIANTE{' '}
                        </span>
                        <div>
                            <button className="btn">Vinculate</button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosPropietario m-0 w-100 d-flex justify-content-end">
                    <Col
                        className="col d-flex m-0 p-0 ps-4 pe-4"
                        lg={6}
                        md={12}
                        sm={12}
                    >
                        <h2 className="headline-xl textBlanco">PROPIETARIO</h2>
                        <p className="body-2 m-0 p-0 ps-4 pe-4 ms-4 me-4 textBlanco">
                            SOMOS UNA COMUNIDAD DE COMERCIANTES PROFESIONALES,
                            CONTRATA PERSONAL CALIFICADO MANTENIMIENTO GENERAL
                            RESIDENCIAL Y DE PROPIEDAD HORIZONTAL, CONSULTA
                            PÚBLICAMENTE LOS PERFILES Y LA REPUTACIÓN DE LOS
                            PRESTADORES DE SERVICIOS. AHORA TUS PROYECTOS Y
                            REMODELACIONES MÁS RÁPIDO Y SIMPLE QUE NUNCA
                        </p>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosCertificaciones m-0 w-100">
                    <Col
                        className="d-flex flex-column align-items-center"
                        md={12}
                    >
                        <Col
                            className="certificaciones-titulo d-flex mb-4 mt-4 p-0 align-items-center"
                            style={{ 'min-height': '8em' }}
                            lg={4}
                            md={6}
                            sm={10}
                            xs={12}
                        >
                            <span className="pt-4 p-0 mt-4 textBlanco certificacion-titulo headline-xl">
                                {' '}
                                CERTIFICACIÓN{' '}
                            </span>
                        </Col>
                        <Col className="p-0 w-100 d-flex flex-column align-items-start">
                            <p className="textBlanco m-4 p-4 body-1">
                                Aumente sus posibilidades laborales, pregunta a
                                nuestro equipo por nuestra insignia
                                <br />
                                de validación de habilidades, esto te permitira
                                brindar mayor confianza a los
                                <br />
                                propietarios, y acceder facilmente a proyectos
                                de mayor complejidad
                                <br />
                            </p>
                            <p className="m-4 p-4 body-1">
                                Juntos programamos una visita de inspección para
                                validarentre otras cosas,
                                <br />
                                certificados y diplomas, equipos y tecnica
                                requerida.
                                <br />
                                ¿Listo para solicitar una? Regístrese e ingrese
                                con su usuario para comenzar.
                                <br />
                            </p>
                        </Col>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosCalificaciones m-0 p-4 w-100 d-flex flex-column align-items-end">
                    <Col className="mt-4" lg={6} md={6} sm={12}>
                        <span>
                            <h2 className="headline-xl textBlanco">
                                CALIFICACIONES
                            </h2>
                        </span>
                        <p className="body-1 textBlanco">
                            La valoración debe darse con base en los
                            <br />
                            siguientes tres aspectos:
                            <br />`{'>'}` Gestión `{'>'}` Calidad `{'>'}`
                            Oportunidad
                            <br />
                            <br />
                            <ul className="ps-0">
                                <li>
                                    Estado de observaciones generales y
                                    evaluacion del desempeño:
                                </li>
                                <br />
                                <li>
                                    - Cumple con los tiempos de entrega de las
                                    certificaciones, polizas, actas y contratos.
                                </li>

                                <br />
                                <li>
                                    - El servicio fue prestado en las fechas y
                                    horario programados.
                                </li>
                                <li>
                                    - El servicio cumplio con las
                                    especificaciones y normas tecnicas
                                    establecidas.
                                </li>
                                <li>
                                    - Fue suficiente el presonal y tenia todas
                                    las competencias necesarias para ejecutar
                                    las actividades del contrato.
                                </li>
                                <li>
                                    - Las facturas, soportes y documentos
                                    contractuales fueren entregados
                                    oportunamente.
                                </li>
                            </ul>
                        </p>
                    </Col>
                    <Col
                        className="col-12"
                        style={{ 'min-height': '200px' }}
                    ></Col>
                    <Col
                        className="col-12"
                        style={{ 'min-height': '200px' }}
                    ></Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosEstadisticas m-0">
                    <Row className="headline-l">
                        <ul>
                            <li>
                                <span className="text-black">484</span>
                                <br />
                                USUARIOS
                            </li>
                            <li>
                                <span className="text-black">2018</span>
                                <br /> ACTIVO DESDE
                            </li>
                            <li>
                                <span className="text-black">84</span>
                                <br />
                                CLIENTES FELICES
                            </li>
                            <li>
                                <span className="text-black">206</span>
                                <br />
                                PROYECTOS
                            </li>
                        </ul>
                    </Row>
                </Row>
            </Container>
        </>
    )
}

export default AsiTrabajamos