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
                    <Col className="col d-flex" md={6} sm={12}>
                        <span className="chatAsesor headline-xl">
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
                    <Col className="col d-flex" lg={4} md={8} sm={12}>
                        <span className="headline-xl">
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
                    <Col className="col d-flex" md={6} sm={12}>
                        <h2 className="headline-xl textBlanco">PROPIETARIO</h2>
                        <p className="body-2 m-4 textBlanco">
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
                        <Col className="pt-4 p-0 pb-4 w-75 d-flex flex-column align-items-end justify-content-end">
                            <span
                                className="pt-4 p-0 pb-4 textBlanco certificacion-titulo headline-xl"
                                style={{ 'min-height': '6em' }}
                            >
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
                <Row className="asiTrabajamosCalificaciones m-0 w-100 d-flex flex-column align-items-end justify-content-end">
                    <Col className="fondoCafe" lg={6} md={6} sm={12}>
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
                    <Row className="headline-l">
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
