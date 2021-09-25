// Pagina de Usuario - InvitarAmigos
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const InvitarAmigos = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start">
                    <Col md={10}>
                        <span>
                            <h2>Programa de referidos</h2>
                        </span>
                        <p>
                            Con el programa de referidos te premiamos por
                            recomendar la comunidad y, ayuda así la
                            Transformación digital inmobiliaria.
                        </p>
                        <p>
                            Invita tus amigos a que se registren al programa
                            compartiendo tu código único, envía el Link a tus
                            contactos, acumula puntos, obtén descuentos y
                            llévate premios.
                        </p>
                        <button>Copiar tu Link</button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default InvitarAmigos
