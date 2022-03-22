// Pagina de Usuario - Certificaciones
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const Certificaciones = (props) => {
    const [certificationDate, setCertificationDate] = React.useState(256)
    let certificationHour = '12:00'
    let certificationService = 'Servicio de prueba'

    const handleChange = () => {}

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100">
                    <Col className="col-10 d-flex align-items-start justify-content-start">
                        <Row md={10}>
                            <h3 className="headline-l">
                                Bienvenido al modulo de evaluación y
                                Certificación por Competencias Laborales
                            </h3>
                            <p className="body-1 p-4">
                                El desempeño real de las personas se compara con
                                un referente que es la Norma de Competencia
                                Laboral y/o el esquema de certificación, así tu
                                experiencia es promovida y reconocida. Con el
                                apoyo de la Dirección del Sistema Nacional de
                                Formación para el Trabajo DSNFT
                            </p>
                            <p className="body-1 p-4">
                                La insignia de validación de habilidades,
                                aumentan las posibilidades laborales, al
                                permitir brindar mayor confianza a los
                                propietarios, y acceder facilmente a proyectos
                                de mayor complejidad{' '}
                            </p>
                            <span>
                                {' '}
                                <h4 className="headline-m">
                                    ¿Listo para solicitar una? Programa una
                                    visita
                                </h4>
                            </span>
                        </Row>
                        <Row md={10}>
                            <Box
                                style={{
                                    display: 'flex',
                                    'flex-direction': 'column',
                                    'align-items': 'center',
                                }}
                                action=""
                            >
                                <p className="body-1">Certificación</p>
                                <br />
                                <TextField
                                    id="date"
                                    label="Fecha"
                                    value={certificationDate}
                                    onChange={handleChange}
                                    defaultValue="Selecciona"
                                    variant="standard"
                                />
                                <TextField
                                    id="certificationHour"
                                    label="Hora"
                                    value={certificationHour}
                                    onChange={handleChange}
                                    defaultValue="Selecciona"
                                    variant="standard"
                                />
                                <TextField
                                    id="certificationService"
                                    label="Servicio"
                                    value={certificationService}
                                    onChange={handleChange}
                                    defaultValue="Selecciona"
                                    variant="standard"
                                />
                                <Button>Valor de la Gestión</Button>
                            </Box>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Certificaciones
