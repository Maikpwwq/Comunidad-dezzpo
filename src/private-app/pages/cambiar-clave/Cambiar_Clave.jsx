// Pagina de Usuario - CambiarClave
import React, { useState } from 'react'
import { auth } from '../../../firebase/firebaseClient'
import { updatePassword } from 'firebase/auth'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const CambiarClave = (props) => {
    const [newPassword, setNewPassword] = useState({
        newPassword: 'againNewPassword',
        againNewPassword: 'newPassword',
    })

    const handleChange = (event) => {
        setNewPassword({
            ...newPassword,
            [event.target.name]: event.target.value,
        })
    }

    updatePassword(auth.currentUser, newPassword.newPassword)
        .then((result) => {
            console.log(`Se actulizo la contraseña ${result}`)
        })
        .catch((error) => {
            console.log(
                `Se produjo un error al actulizar la contraseña ${error}`
            )
        })

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
                                name="newPassword"
                                label="Ingresa tu nueva clave"
                                value={newPassword.newPassword}
                                onChange={handleChange}
                                defaultValue="Ingresa tu nueva clave"
                                variant="standard"
                            />
                            <br />
                            <br />
                            <TextField
                                id="againNewPassword"
                                name="againNewPassword"
                                label="Repite la nueva clave"
                                value={newPassword.againNewPassword}
                                onChange={handleChange}
                                defaultValue="Repite la nueva clave"
                                variant="standard"
                            />
                            <Button type="submit" onClick={updatePassword}>
                                Establecer
                            </Button>
                        </Box>
                    </Row>
                </Col>
            </Container>
        </>
    )
}

export default CambiarClave
