// Pagina de Profesionales Servicios
import React from 'react'
import '../../../../public/assets/css/profesionales_servicios.css'
import NuestraComunidad from '../../components/nuestra-comunidad/NuestraComunidad'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import { Link } from 'react-router-dom'

const ProfesionalesServicios = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Row className="profesionalesServiciosMensaje m-0 d-flex flex-row justify-content-end">
                    <Col md={4}>
                        <h2 className="headline-xl">
                            Profesionales y Servicios <br />
                            Recuerda
                        </h2>
                        <p className="body-1">
                            Los Certificados describen las acreditaciones que ha
                            recibido cada comerciante <br />
                            calificado, estos se pueden consultar junto al
                            perfil, además podras consultar <br />
                            las fotos de sus anteriores trabajos, las
                            calificaciones y comentarios de otros <br />
                            Propietarios
                        </p>
                        <span className="p-description">
                            {' '}
                            Busca Profesionales en tu zona{' '}
                        </span>
                    </Col>
                </Row>
            </Container>
            {/* seccion de categorias y servicios */}
            <NuestraComunidad></NuestraComunidad>
        </>
    )
}

export default ProfesionalesServicios
