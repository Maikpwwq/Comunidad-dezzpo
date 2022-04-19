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
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

const Ingreso = (props) => {
    const navigate = useNavigate()
    const [send, setSend] = React.useState(false)
    const [userLoginEmail, setEmail] = React.useState(null)
    const [userLoginPassword, setPassword] = React.useState('')
    const [userSignupRol, setRol] = React.useState({})

    const handleClick = (e) => {
        e.preventDefault()
        console.log(userLoginEmail, userLoginPassword, userSignupRol)
        let credential = EmailAuthProvider.credential(
            userLoginEmail,
            userLoginPassword
        )
        const logIn = (usercredential) => {
            signInWithCredential(auth, usercredential)
                .then((userCredential) => {
                    var user = userCredential.user
                    console.log('Anonymous account successfully upgraded', user)
                    console.log(userSignupRol)
                    // localStorage.setItem('role', JSON.stringify(userSignupRol))
                    localStorage.role = JSON.stringify(userSignupRol)
                    // navigate('/app/perfil', { state: { role: userSignupRol } })
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

    const handleClickForgetPassword = (e) => {
        e.preventDefault()
        sendPasswordResetEmail(auth, userLoginEmail)
            .then((result) => {
                console.log(`Se envio correo de restauración ${result}`)
            })
            .catch((error) => {
                console.log(
                    `Se produjo un error al enviar correo de restauración ${error}`
                )
            })
    }

    let checkStyle = {
        width: '30px',
    }
    //

    return (
        <>
            <Container fluid className="p-0">
                <Row className="ingresoFormulario  m-0 w-100">
                    <Col className="imagenIngreso" lg={6} md={6} sm={12}></Col>
                    <Col
                        className="ingresarFormulario m-0 p-4"
                        lg={4}
                        md={6}
                        sm={12}
                    >
                        <Col className="ps-4 pe-4 ">
                            <h2 className="headline-l textBlanco">
                                Bienvenido!
                            </h2>
                            <p className="body-1 textBlanco">
                                Eres nuevo, crea fácil una cuenta
                                <NavLink className="body-2" to="/registro/">
                                    {' Registrate.'}
                                </NavLink>
                            </p>
                            <br />
                            <ul className="align-items-center">
                                <li className="body-1">
                                    <Button className="btn btn-round btn-middle">
                                        INGRESAR CON FACEBOOK
                                    </Button>
                                </li>
                                <li className="body-1 pt-2">
                                    <Button className="btn btn-round btn-middle">
                                        INGRESAR CON GMAIL
                                    </Button>
                                </li>
                            </ul>
                            <br />
                            <Button
                                className="BOTON-TEXT textBlanco"
                                variant="primary"
                                onClick={handleClickForgetPassword}
                            >
                                OLVIDASTE LA CONTRASEÑA
                            </Button>
                            <hr />
                            <Form id="formularioIngreso" action="">
                                <ToggleButtonGroup
                                    type="checkbox" // 'radio'
                                    name="userRol"
                                    className="mb-2 mt-2"
                                    vertical="true"
                                    // value={userSignupRol}
                                >
                                    <Form.Label className="mb-0">
                                        Elegir rol:
                                    </Form.Label>
                                    <ToggleButton
                                        className="body-1 textBlanco d-flex flex-row align-items-center justify-content-center"
                                        value={1}
                                        id="formBasicRolPropietarioResidente"
                                        onChange={(e) => setRol(e.target.value)}
                                    >
                                        Soy Propietario/Residente
                                    </ToggleButton>
                                    <ToggleButton
                                        className="body-1 textBlanco d-flex flex-row align-items-center justify-content-center"
                                        value={2}
                                        id="formBasicRolComercianteCalificado"
                                        onChange={(e) => setRol(e.target.value)}
                                    >
                                        Soy Comerciante Calificado
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <Form.Group
                                    className="mb-2 d-flex flex-column align-items-center"
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
                                    className="mb-2 d-flex flex-column align-items-center"
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

                                <Form.Group
                                    className="mb-2 mt-4"
                                    controlId="formBasicCheckboxRecordar"
                                >
                                    <Form.Check
                                        className="d-flex flex-row align-items-center justify-content-start"
                                        type="checkbox"
                                        label="Recuérdame"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2"
                                    controlId="formBasicCheckboxRobot"
                                >
                                    <Form.Check
                                        className="d-flex flex-row align-items-center justify-content-start"
                                        type="checkbox"
                                        label="No soy un robot"
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Col className="pb-4 pt-4">
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
                        </Col>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Ingreso
