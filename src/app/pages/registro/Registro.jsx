// Pagina de registro
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth, firestore } from '../../../firebase/firebaseClient' // src/firebase/firebaseClient
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'

import '../../../../public/assets/css/registro.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

const Registro = (props) => {
    const { showLogo } = props

    const _firestore = firestore
    // const usersRef = collection(_firestore, 'users')
    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const [send, setSend] = React.useState(false)
    const [userSignupEmail, setEmail] = React.useState(null)
    const [userSignupPassword, setPassword] = React.useState('')
    const [userSignupRol, setRol] = React.useState({})

    const navigate = useNavigate()

    // const userToFirestore = async (updateInfo, userID) => {
    //     await setDoc(doc(usersRef, userID), updateInfo)
    // }

    const userProResToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersProResRef, userID), updateInfo)
    }

    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo)
    }

    const handleClick = (e) => {
        e.preventDefault()
        const signUp = (email, password) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    var user = userCredential.user
                    console.log('Anonymous account successfully upgraded', user)
                    const data = {
                        userMail: user.email,
                        userJoined: user.metadata.creationTime,
                        userId: user.uid,
                        // userName: user.displayName,
                    }
                    console.log(userSignupRol)
                    if (userSignupRol == 1) {
                        userProResToFirestore(data, user.uid)
                    }
                    if (userSignupRol == 2) {
                        userComCalToFirestore(data, user.uid)
                    }
                    // userToFirestore(data, user.uid)
                    // localStorage.setItem('role', JSON.stringify(userSignupRol))
                    localStorage.role = JSON.stringify(userSignupRol)
                    navigate('/app/perfil')
                })
                .catch((err) => {
                    console.log('Error upgrading anonymous account', err)
                    console.log(err.code)
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
        signUp(userSignupEmail, userSignupPassword)
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row id="registrate" className="m-0">
                    {showLogo == false ? (
                        <></>
                    ) : (
                        <Col
                            className="registrateImagen m-0"
                            md={6}
                            sm={12}
                        ></Col>
                    )}
                    <Col
                        className="registrateformulario m-0 p-0 pt-2 pb-4"
                        md={6}
                        sm={12}
                    >
                        <Form
                            id="formularioRegistro"
                            action=""
                            className="p-4"
                            // preventDefault="true"
                        >
                            <Col className="d-flex">
                                <h2 className="headline-xl textBlanco">
                                    REGISTRATE
                                </h2>
                                <p className="body-1 textBlanco">
                                    Bienvenido a todos los beneficios de dezzpo.
                                </p>
                                <NavLink className="body-2" to="/ingreso/">
                                    {'¿Ya tienes una cuenta?'}
                                </NavLink>
                                {/* <Form.Group
                                className="mb-2"
                                controlId="formBasicName"
                            >
                                <Form.Label className="mb-0">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Registre su nombre"
                                    name="name"
                                />
                            </Form.Group> */}
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
                                    className="w-80 pt-4 mb-2 d-flex flex-column align-items-start"
                                    controlId="formBasicName"
                                >
                                    <Form.Label className="mb-0">
                                        Nombre de usuario
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Elija su usuario"
                                        name="username"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                    controlId="formSignupEmail"
                                >
                                    <Form.Label className="mb-0">
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Registre una cuenta de email valida"
                                        name="email"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                    controlId="formSignupPassword"
                                >
                                    <Form.Label className="mb-0">
                                        Contraseña
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Registre una clave"
                                        name="password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="w-80 mb-2 d-flex flex-column align-items-start"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label className="mb-0">
                                        Confirme la Contraseña
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="De nuevo la clave"
                                        name="confirmPassword"
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-2 mt-2"
                                    controlId="formBasicCheckboxRobot"
                                >
                                    <Form.Check
                                        className="d-flex flex-row align-items-center justify-content-center"
                                        type="checkbox"
                                        label="No soy un robot"
                                    />
                                </Form.Group>
                                <Col className="pt-2">
                                    <Button
                                        className="btn-round btn-high"
                                        variant="primary"
                                        type="submit"
                                        onClick={handleClick}
                                    >
                                        Crear Cuenta
                                    </Button>
                                </Col>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Registro
