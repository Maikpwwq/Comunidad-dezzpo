/**
 * Certificaciones Page
 *
 * Converted to TypeScript.
 * Labor competency certification module.
 */
import { useState } from 'react'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
export default function Page() {
    const [certificationDate, setCertificationDate] = useState('')
    const [certificationHour, setCertificationHour] = useState('12:00')
    const [certificationService, setCertificationService] = useState('')
    const handleChange = (setter: (value: string) => void) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setter(event.target.value)
    }
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 pt-4 pb-4">
                <Col className="col-10 d-flex align-items-start justify-content-start">
                    <Row md={10}>
                        <h1 className="type-hero-title">
                            Bienvenido al módulo de evaluación y Certificación por Competencias
                            Laborales
                        </h1>
                        <p className="body-1 p-4">
                            El desempeño real de las personas se compara con un referente que es
                            la Norma de Competencia Laboral y/o el esquema de certificación, así
                            tu experiencia es promovida y reconocida. Con el apoyo de la
                            Dirección del Sistema Nacional de Formación para el Trabajo DSNFT
                        </p>
                        <p className="body-1 p-4">
                            La insignia de validación de habilidades, aumentan las posibilidades
                            laborales, al permitir brindar mayor confianza a los propietarios, y
                            acceder fácilmente a proyectos de mayor complejidad
                        </p>
                        <span>
                            <h4 className="headline-m">
                                ¿Listo para solicitar una? Programa una visita
                            </h4>
                        </span>
                    </Row>
                    <Row md={10}>
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <p className="body-1">Certificación</p>
                            <br />
                            <TextField
                                id="date"
                                label="Fecha"
                                type="date"
                                value={certificationDate}
                                onChange={handleChange(setCertificationDate)}
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                id="certificationHour"
                                label="Hora"
                                type="time"
                                value={certificationHour}
                                onChange={handleChange(setCertificationHour)}
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                id="certificationService"
                                label="Servicio"
                                value={certificationService}
                                onChange={handleChange(setCertificationService)}
                                variant="standard"
                            />
                            <Button>Valor de la Gestión</Button>
                        </Box>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
