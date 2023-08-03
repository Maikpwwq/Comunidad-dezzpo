export { Notificaciones }

// Pagina de Usuario - Notificaciones
import React from 'react'

// react-bootrstrap
import { Row, Col, Container } from 'react-bootstrap'
// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Container from 'react-bootstrap/Container'
import TextareaAutosize from '@mui/material/TextareaAutosize'

const Notificaciones = () => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex pt-4 pb-4">
                    <Col className="col-10">
                        <h2 className="headline-xl">Notificaciones</h2>
                        <div>
                            <TextareaAutosize
                                minRows={10}
                                cols="30"
                                placeholder="Notificaciones"
                            ></TextareaAutosize>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
