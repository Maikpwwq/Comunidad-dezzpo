// Pagina de Usuario - Notificaciones
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Notificaciones = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <Col>
                        <h2 className="headline-xl">Notificaciones</h2>
                        <div>
                            <textarea rows="10" cols="30"></textarea>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Notificaciones
