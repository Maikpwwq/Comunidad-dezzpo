/**
 * Cambiar Clave (Change Password) Page
 *
 * Converted to TypeScript.
 */

export const documentProps = {
    title: 'Cambiar Contraseña | Comunidad Dezzpo',
    description: 'Actualiza tu contraseña de acceso.',
}

import { useState } from 'react'
import { auth } from '@firebase/firebaseClient'
import { updatePassword } from 'firebase/auth'

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

// MUI
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

interface PasswordState {
    newPassword: string
    againNewPassword: string
}

export default function Page() {
    const [passwords, setPasswords] = useState<PasswordState>({
        newPassword: '',
        againNewPassword: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value,
        })
    }

    const handleClick = async () => {
        setError(null)
        setSuccess(false)

        if (passwords.newPassword !== passwords.againNewPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (!auth?.currentUser) {
            setError('Debes iniciar sesión para cambiar la contraseña')
            return
        }

        try {
            await updatePassword(auth.currentUser, passwords.newPassword)
            setSuccess(true)
            setPasswords({ newPassword: '', againNewPassword: '' })
        } catch (err) {
            setError('Error al actualizar la contraseña. Por favor, inicia sesión nuevamente.')
            console.error('Password update error:', err)
        }
    }

    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex pt-4 pb-4">
                <Col className="col-10">
                    <h2 className="headline-xl">Asigna una nueva contraseña</h2>
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            id="newPassword"
                            name="newPassword"
                            label="Ingresa tu nueva clave"
                            type="password"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            variant="standard"
                        />
                        <br />
                        <br />
                        <TextField
                            id="againNewPassword"
                            name="againNewPassword"
                            label="Repite la nueva clave"
                            type="password"
                            value={passwords.againNewPassword}
                            onChange={handleChange}
                            variant="standard"
                        />
                        {error && <p className="body-1 text-danger mt-2">{error}</p>}
                        {success && <p className="body-1 textVerde mt-2">¡Contraseña actualizada!</p>}
                        <Button type="submit" onClick={handleClick} className="mt-4">
                            Establecer
                        </Button>
                    </Box>
                </Col>
            </Row>
        </Container>
    )
}
