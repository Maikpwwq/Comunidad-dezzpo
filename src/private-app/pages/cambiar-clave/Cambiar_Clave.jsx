// Pagina de Usuario - CambiarClave
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const CambiarClave = (props) => {
    return (
        <>
            <Container fluid className="p-0 h-100">
                <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <Row md={10}>
                        <span>
                            <h2>Asigna una nueva contrasena</h2>
                        </span>
                        <form
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                            }}
                            action=""
                        >
                            <input
                                type="text"
                                name="newPassword"
                                id="newPassword"
                                placeholder="Ingresa tu nueva clave"
                                required
                            />
                            <br />
                            <br />
                            <input
                                type="text"
                                name="againNewPassword"
                                id="againNewPassword"
                                placeholder="Repite la nueva clave"
                                required
                            />
                            <br />
                            <br />
                            <button>Establecer</button>
                        </form>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default CambiarClave
