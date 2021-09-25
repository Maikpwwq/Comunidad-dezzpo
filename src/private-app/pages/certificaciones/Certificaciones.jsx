// Pagina de Usuario - Certificaciones
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Certificaciones = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <Row md={10}>
                        <h2>
                            Bienvenido al modulo de evaluación y Certificación
                            por Competencias Laborales
                        </h2>
                        <p>
                            El desempeño real de las personas se compara con un
                            referente que es la Norma de Competencia Laboral y/o
                            el esquema de certificación, así tu experiencia es
                            promovida y reconocida. Con el apoyo de la Dirección
                            del Sistema Nacional de Formación para el Trabajo
                            DSNFT
                        </p>
                        <p>
                            La insignia de validación de habilidades, aumentan
                            las posibilidades laborales, al permitir brindar{' '}
                            mayor confianza a los propietarios, y acceder
                            facilmente a proyectos de mayor complejidad{' '}
                        </p>
                        <span>
                            {' '}
                            <h3>
                                ¿Listo para solicitar una? Programa una visita
                            </h3>
                        </span>
                    </Row>
                    <Row md={10}>
                        <form
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                            }}
                            action=""
                        >
                            <p>Certificación</p>
                            <br />
                            <label for="date">Fecha</label>
                            <input
                                type="text"
                                name="date"
                                id="date"
                                placeholder="Selecciona"
                            />
                            <br />
                            <label for="hour">Hora</label>
                            <input
                                type="text"
                                name="hour"
                                id="hour"
                                placeholder="Selecciona"
                            />
                            <br />
                            <label for="service">Servicio</label>
                            <input
                                type="text"
                                name="service"
                                id="service"
                                placeholder="Selecciona"
                            />
                            <br />
                            <button>Valor de la Gestión</button>
                        </form>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default Certificaciones
