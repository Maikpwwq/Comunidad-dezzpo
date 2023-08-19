export { Page }

// Pagina de Usuario - CambiarClave
import React, { useState } from 'react'
import { auth } from '#@/firebase/firebaseClient'
import { updatePassword } from 'firebase/auth'

// react-bootrstrap
// import { Row, Col, Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import {Button, Box} from '@mui/material'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

const Page = () => {
    const [newPassword, setNewPassword] = useState({
        newPassword: 'Ingresa tu nueva clave',
        againNewPassword: 'Repite la nueva clave',
    })

    const handleChange = (event) => {
        setNewPassword({
            ...newPassword,
            [event.target.name]: event.target.value,
        })
    }

    const handleClick = () => {
        updatePassword(auth?.currentUser, newPassword.newPassword)
            .then((result) => {
                console.log(`Se actulizo la contraseña ${result}`)
            })
            .catch((error) => {
                console.log(
                    `Se produjo un error al actulizar la contraseña ${error}`
                )
            })
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex pt-4 pb-4">
                    <Col className="col-10">
                        <span>
                            <h2 className="headline-xl">
                                Asigna una nueva contrasena
                            </h2>
                        </span>
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            action=""
                        >
                            <TextField
                                id="newPassword"
                                name="newPassword"
                                label="Ingresa tu nueva clave"
                                value={newPassword.newPassword}
                                onChange={handleChange}
                                // defaultValue="Ingresa tu nueva clave"
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
                                // defaultValue="Repite la nueva clave"
                                variant="standard"
                            />
                            <Button type="submit" onClick={handleClick}>
                                Establecer
                            </Button>
                        </Box>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
