// Pagina de Usuario - CambiarClave
import React from 'react'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const CambiarClave = (props) => {
    const againNewPassword = 'againNewPassword'
    const newPassword = 'newPassword'

    const handleChange = () => {}

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Col className="m-0 w-100 d-flex align-items-start justify-content-start">
                    <Row md={10}>
                        <span>
                            <h2 className="headline-xl">
                                Asigna una nueva contrasena
                            </h2>
                        </span>
                        <Box
                            style={{
                                display: 'flex',
                                'flex-direction': 'column',
                                'align-items': 'center',
                            }}
                            action=""
                        >
                            <TextField
                                id="newPassword"
                                label="Ingresa tu nueva clave"
                                value={newPassword}
                                onChange={handleChange}
                                defaultValue="Ingresa tu nueva clave"
                                variant="standard"
                            />
                            <br />
                            <br />
                            <TextField
                                id="againNewPassword"
                                label="Repite la nueva clave"
                                value={againNewPassword}
                                onChange={handleChange}
                                defaultValue="Repite la nueva clave"
                                variant="standard"
                            />
                            <Button>Establecer</Button>
                        </Box>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default CambiarClave
