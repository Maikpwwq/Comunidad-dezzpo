import * as React from 'react'
import Form from 'react-bootstrap/Form'
// Deprecated usage getDOMNode() and findDOMNode()
// 1. controlId & getElementById
const Componente1 = (props) => {
    let clave = document.getElementById('formSignupPassword').value
    console.log(clave)
    return (
        <>
            <Form>
                <Form.Group className="mb-2" controlId="formSignupPassword">
                    <Form.Label className="mb-0">Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Registre una clave"
                    />
                </Form.Group>
            </Form>
        </>
    )
}
// 2. ref & React.createRef
const Componente2 = (props) => {
    let passwordText = React.createRef()
    let clave = passwordText.current.value
    console.log(clave)
    return (
        <>
            <Form>
                <Form.Group className="mb-2" controlId="formSignupPassword">
                    <Form.Label className="mb-0">Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Registre una clave"
                        inputRef={passwordText}
                        // or Use
                        ref={passwordText}
                    />
                </Form.Group>
            </Form>
        </>
    )
}
// 3 onChange={(e) =>} & Hooks React.useState
const Componente3 = (props) => {
    const [userEmail, setEmail] = React.useState(null)
    console.log(userEmail)
    return (
        <>
            <Form>
                <Form.Group className="mb-2" controlId="formSignupEmail">
                    <Form.Label className="mb-0">Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Registre una cuenta de email valida"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
            </Form>
        </>
    )
}
