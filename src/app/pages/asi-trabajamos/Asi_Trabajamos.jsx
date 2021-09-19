// Pagina de Asi Trabajamos
import React from 'react'
import '../../../../public/assets/css/asi_trabajamos.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const AsiTrabajamos = (props) => {
    return (
        <>
            <div className="asiTrabajamosRegistro">
                {/* se importa el componente de registro */}
            </div>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosChat m-0 w-100 d-flex justify-content-end">
                    <Col className="d-flex colRight" md={6}>
                        <span className="chatAsesor">
                            Contacta Con Un Asesor
                            <br />
                            en Tiempo Real En Nuestro Chat
                        </span>
                        <br />
                        <div>
                            <button className="btn">CHAT EN VIVO</button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosVinculate m-0 w-100 d-flex justify-content-end">
                    <Col className="d-flex colRight2" md={4}>
                        <span> PERFIL COMERCIANTE </span>
                        <div>
                            <button className="btn">Vinculate</button>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosPropietario  m-0 w-100 d-flex justify-content-end">
                    <Col className="d-flex colRight3" md={6}>
                        <span>
                            <h1>PROPIETARIO</h1>
                        </span>
                        <p>
                            SOMOS UNA COMUNIDAD DE COMERCIANTES PROFESIONALES,
                            <br />
                            CONTRATA PERSONAL CALIFICADO MANTENIMIENTO GENERAL
                            <br />
                            RESIDENCIAL Y DE PROPIEDAD HORIZONTAL, CONSULTA
                            <br />
                            PÚBLICAMENTE LOS PERFILES Y LA REPUTACIÓN DE LOS
                            <br />
                            PRESTADORES DE SERVICIOS. AHORA TUS PROYECTOS Y
                            <br />
                            REMODELACIONES MÁS RÁPIDO Y SIMPLE QUE NUNCA
                            <br />
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
                        <Col className="colCenter m-0 w-75 d-flex flex-column align-items-end justify-content-end">
                            <span className="certificacion-titulo">
                                {' '}
                                CERTIFICACIÓN{' '}
                            </span>
                        </Col>
                        <Col className="m-0 w-100 d-flex flex-column align-items-start">
                            <p className="whiteP mb-4">
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
                            <p className="pb-4">
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
                <Row className="asiTrabajamosCalificaciones m-0 w-100 d-flex flex-column align-items-end justify-content-end">
                    <Col className="colRight3 w-50">
                        <span>
                            <h2>CALIFICACIONES</h2>
                        </span>
                        <p className="LeftP">
                            La valoración debe darse con base en los
                            <br />
                            siguientes tres aspectos:
                            <br />`{'>'}` Gestión `{'>'}` Calidad `{'>'}`
                            Oportunidad
                            <br />
                            <br />
                            <ul>
                                <li>
                                    Estado de observaciones generales y
                                    evaluacion del desempeño:
                                </li>
                                <li>
                                    Cumple con los tiempos de entrega de las
                                    certificaciones,
                                    <br />
                                    polizas, actas y contratos.
                                </li>
                                <li>
                                    El servicio fue prestado en las fechas y
                                    horario programados.
                                </li>
                                <li>
                                    El servicio cumplio con las especificaciones
                                    y
                                    <br />
                                    normas tecnicas establecidas.
                                </li>
                                <li>
                                    Fue suficiente el presonal y tenia todas las
                                    competencias
                                    <br />
                                    necesarias para ejecutar las actividades del
                                    contrato.
                                </li>
                                <li>
                                    Las facturas, soportes y documentos
                                    contractuales fueren
                                    <br />
                                    entregados oportunamente.
                                </li>
                            </ul>
                        </p>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="asiTrabajamosEstadisticas  m-0 w-100">
                    <Row className="">
                        <ul style={{ 'flex-direction': 'row' }}>
                            <li>USUARIOS</li>
                            <li>ACTIVO DESDE</li>
                            <li>CLIENTES FELICES</li>
                            <li>PROYECTOS</li>
                        </ul>
                    </Row>
                </Row>
            </Container>
        </>
    )
}

export default AsiTrabajamos
