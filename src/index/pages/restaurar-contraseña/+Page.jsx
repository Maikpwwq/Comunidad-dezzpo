export { Layout } from '#@/index/components/LayoutPaperbase'

// Pagina de Usuario - CambiarClave
import React, { useState } from 'react'
import Link from '#R/Link'
import { auth } from '#@/firebase/firebaseClient'
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth'

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
    const [resetEmail, setResetEmail] = useState({
        resetEmail: '@.com',
        code: null,
        newPassword: undefined,
    })
    const [formStatus, setFormStatus] = useState(1)

    const handleChange = (event) => {
        setResetEmail({
            ...resetEmail,
            [event.target.name]: event.target.value,
        })
    }

    const handleClick = async () => {
        await sendPasswordResetEmail(auth, resetEmail.resetEmail)
            .then((result) => {
                console.log(
                    `Se envio un codigo a su cuenta de correo para continuar con la restauración de su contraseña ${result}`
                )
                setFormStatus(2)
            })
            .catch((error) => {
                console.log(
                    `Se produjo un error al enviar el correo de restauración de su contraseña ${error}`
                )
            })
    }

    const handleConfirm = async () => {
        // Obtain code from user.
        await confirmPasswordReset(
            resetEmail.resetEmail,
            resetEmail.code,
            resetEmail.newPassword
        )
            .then((result) => {
                console.log(
                    `Se ha restaurado correctamente su contraseña ${result}`
                )
                setFormStatus(1)
            })
            .catch((error) => {
                console.log(
                    `Se produjo un error al intentar restaurar su contraseña con este codigo de acceso ${error}`
                )
                setFormStatus(1)
            })
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex pt-4 pb-4">
                    <Col className="col-10">
                        <h2 className="headline-xl pb-4">
                            Recuperar contraseña
                        </h2>
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            action=""
                        >
                            {formStatus === 1 && (
                                <>
                                    <p className="body-1 pb-4 m-0">
                                        Ingresa la cuenta de correo con la que
                                        te has registrado
                                    </p>
                                    <TextField
                                        sx={{ minWidth: '300px' }}
                                        id="resetEmail"
                                        name="resetEmail"
                                        label="Ingresa tu cuenta de correo"
                                        value={resetEmail.resetEmail}
                                        onChange={handleChange}
                                        // defaultValue="Ingresa tu nueva contraseña"
                                        variant="standard"
                                    />
                                    <Button
                                        className="my-4"
                                        type="submit"
                                        onClick={handleClick}
                                    >
                                        Enviar correo de restablecimiento
                                    </Button>
                                </>
                            )}

                            {formStatus === 2 && (
                                <>
                                    <p className="body-1 pb-4 m-0">
                                        Ingresa el código que recibiste en tu
                                        correo y la nueva contraseña
                                    </p>
                                    <TextField
                                        sx={{ minWidth: '300px' }}
                                        id="code"
                                        name="code"
                                        label="Ingresar el código recibido"
                                        value={resetEmail.code}
                                        onChange={handleChange}
                                        // defaultValue="Ingresa tu nueva contraseña"
                                        variant="standard"
                                    />

                                    <TextField
                                        sx={{ minWidth: '300px' }}
                                        id="newPassword"
                                        name="newPassword"
                                        label="Ingresa tu nueva contraseña segura"
                                        value={resetEmail.newPassword}
                                        onChange={handleChange}
                                        // defaultValue="Ingresa tu nueva contraseña"
                                        variant="standard"
                                    />
                                    <Button
                                        className="my-4"
                                        type="submit"
                                        onClick={handleConfirm}
                                    >
                                        Confirmar cambio de contraseña
                                    </Button>
                                </>
                            )}
                        </Box>
                        <p className="body-1 pt-2 m-0">
                            Eres nuevo, crea fácil una cuenta,
                            <Link
                                className="body-2 btn-TEXT textVerde2"
                                href="/registro/"
                            >
                                {' Registrarme'}
                            </Link>
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Page