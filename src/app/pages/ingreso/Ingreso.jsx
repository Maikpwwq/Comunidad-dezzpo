/* eslint-disable prettier/prettier */
// Pagina de Ingreso
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../../firebase/firebaseClient' // src/firebase/firebaseClient
import {
    EmailAuthProvider,
    signInWithCredential,
    sendPasswordResetEmail,
} from 'firebase/auth'

import '../../../../public/assets/css/ingreso.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Ingreso = (props) => {
    const navigate = useNavigate()
    const [send, setSend] = React.useState(false)
    const [userLoginEmail, setEmail] = React.useState(null)
    const [userLoginPassword, setPassword] = React.useState('')

    const handleClick = (e) => {
        e.preventDefault()
        console.log(userLoginEmail, userLoginPassword)
        let credential = EmailAuthProvider.credential(
            userLoginEmail,
            userLoginPassword
        )
        const logIn = (usercredential) => {
            signInWithCredential(auth, usercredential)
                .then((userCredential) => {
                    var user = userCredential.user
                    console.log('Anonymous account successfully upgraded', user)
                    navigate('/app/perfil')
                })
                .catch((err) => {
                    console.log('Error upgrading anonymous account', err)
                    var errorCode = err.code
                    var errorMessage = err.message
                    if (errorCode === 'auth/wrong-password') {
                        alert('Clave incorrecta.')
                    } else {
                        alert(errorMessage)
                    }
                })
        }
        setSend(true)
        logIn(credential)
    }

    sendPasswordResetEmail(auth, userLoginEmail)
        .then((result) => {
            console.log(`Se envio correo de restauración ${result}`)
        })
        .catch((error) => {
            console.log(
                `Se produjo un error al enviar correo de restauración ${error}`
            )
        })

    let checkStyle = {
        width: '30px',
    }
    //

    return (
        <>
            <Container fluid className="p-0">
                <Row className="ingresoFormulario  m-0 w-100">
                    <Col className="imagenIngreso"></Col>
                    <Col className="colRight">
                        <div className="ingresarFormulario">
                            <h2 className="headline-l textBlanco">
                                Bienvenido!
                            </h2>

                            <p className="body-1 textBlanco">
                                ERES NUEVO, <br />
                                CREA FÁCIL UNA CUENTA!
                                <NavLink className="body-2" to="/registro/">
                                    {', Registrate'}
                                </NavLink>
                            </p>
                            <br />
                            <ul>
                                <li>
                                    <a href="">INGRESAR CON FACEBOOK </a>
                                </li>
                                <li>
                                    <a href="">INGRESAR CON GMAIL </a>
                                </li>
                            </ul>
                            <br />
                            <hr />
                            <Form id="formularioIngreso" action="">
                                <Form.Group
                                    className="mb-2"
                                    controlId="formLoginCredential"
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="correo o número celular"
                                        name="credential"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formLoginPassword"
                                >
                                    <Form.Control
                                        type="password"
                                        placeholder="contraseña"
                                        name="password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Button
                                    className="BOTON-TEXT"
                                    variant="primary"
                                    type="submit"
                                    onClick={sendPasswordResetEmail}
                                >
                                    OLVIDASTE LA CONTRASEÑA
                                </Button>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicCheckboxRecordar"
                                >
                                    <Form.Check
                                        className=""
                                        type="checkbox"
                                        label="Recuérdame"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicCheckboxRobot"
                                >
                                    <Form.Check
                                        className=""
                                        type="checkbox"
                                        label="No soy un robot"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Col>
                                        <hr />
                                        <Button
                                            className="btn-round btn-high"
                                            variant="primary"
                                            type="submit"
                                            onClick={handleClick}
                                        >
                                            INICIAR SESIÓN
                                        </Button>
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Ingreso
