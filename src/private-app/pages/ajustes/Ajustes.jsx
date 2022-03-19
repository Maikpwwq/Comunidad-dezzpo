// Pagina de Usuario - Ajustes
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Ajustes = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <Row md={10}>
                        <div>
                            <form 
                                action=""
                                style={{
                                    display: 'flex',
                                    'flex-direction': 'column',
                                    'align-items': 'center',
                                }}
                            >
                                <div>
                                    <span className="body-1">Datos de contacto</span>
                                </div>
                                <input
                                    type="text"
                                    name="user"
                                    id="user"
                                    placeholder="@NOMBRE USUARIO"
                                />
                                <input
                                    type="text"
                                    name="razonSocial"
                                    id="razonSocial"
                                    placeholder="Razon social"
                                />
                                <input
                                    type="text"
                                    name="identification"
                                    id="identification"
                                    placeholder="Identificación"
                                />
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    placeholder="Correo"
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    placeholder="Celular"
                                />
                                <input
                                    type="text"
                                    name="place"
                                    id="place"
                                    placeholder="ubicación"
                                />
                                <input type="text" name="profesion"
                                    id="profesion"placeholder="Profesión" />
                                <input type="text" name="experience"
                                    id="experience"placeholder="experiencia" />
                                <input
                                    type="text"
                                    name="certifications"
                                    id="certifications"
                                    placeholder="certificaciones"
                                />
                                <label for="ofertaServicios">Servicios ofrecidos</label>
                                <textarea
                                    name="ofertaServicios"
                                    id="ofertaServicios"
                                    cols="30"
                                    rows="10"
                                ></textarea>                                
                            </form>
                            <p>Confirma tu identidad</p>
                        </div>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default Ajustes
