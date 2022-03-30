// Pagina de registro
import * as React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../../../firebase/firebaseClient' // src/firebase/firebaseClient
import { createUserWithEmailAndPassword } from 'firebase/auth'

import '../../../../public/assets/css/registro.css'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Registro = (props) => {
    const { showLogo } = props

    const [send, setSend] = React.useState(false)
    const [userSignupEmail, setEmail] = React.useState(null)
    const [userSignupPassword, setPassword] = React.useState('')

    const navigate = useNavigate()

    const handleClick = (e) => {
        e.preventDefault()
        const signUp = (email, password) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    var user = userCredential.user
                    console.log('Anonymous account successfully upgraded', user)
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
                        className="registrateformulario m-0 p-0"
                        md={6}
                        sm={12}
                    >
                        <Form
                            id="formularioRegistro"
                            action=""
                            className="p-4"
                            // preventDefault="true"
                        >
                            <h2 className="headline-xl textBlanco">
                                REGISTRATE
                            </h2>
                            <p className="body-1 textBlanco">
                                Bienvenido a todos los beneficios de dezzpo.
                            </p>
                            <NavLink className="body-2" to="/ingreso/">
                                {'¿Ya tienes una cuenta?'}
                            </NavLink>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicName"
                            >
                                <Form.Label className="mb-0">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Registre su nombre"
                                    name="name"
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
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
                                className="mb-2"
                                controlId="formSignupEmail"
                            >
                                <Form.Label className="mb-0">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Registre una cuenta de email valida"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
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
                                className="mb-2"
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
                                className="mb-2"
                                controlId="formBasicCheckboxRobot"
                            >
                                <Form.Check
                                    className=""
                                    type="checkbox"
                                    label="No soy un robot"
                                />
                            </Form.Group>
                            <Col>
                                <Button
                                    className="btn-round btn-high"
                                    variant="primary"
                                    type="submit"
                                    onClick={handleClick}
                                >
                                    Crear Cuenta
                                </Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Registro