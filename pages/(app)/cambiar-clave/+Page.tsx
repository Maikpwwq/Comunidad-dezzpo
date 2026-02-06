/**
 * Cambiar Clave (Change Password) Page
 *
 * Converted to TypeScript.
 */
import { useState } from 'react'
import { auth } from '@services/firebase'
import { updatePassword } from 'firebase/auth'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import { Button, Box, TextField } from '@mui/material'
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
                    <h1 className="type-hero-title">Asigna una nueva contraseña</h1>
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
                        {error && <p className="type-body text-danger mt-2">{error}</p>}
                        {success && <p className="type-body text-verde mt-2">¡Contraseña actualizada!</p>}
                        <Button type="submit" onClick={handleClick} className="mt-4">
                            Establecer
                        </Button>
                    </Box>
                </Col>
            </Row>
        </Container>
    )
}
