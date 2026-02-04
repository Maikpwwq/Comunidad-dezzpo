/**
 * Restaurar Contraseña (Password Reset) Page
 *
 * Converted to TypeScript.
 */
import { useState } from 'react'
import { auth } from '@services/firebase'
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth'
// Components
import { Link } from '@hooks'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// MUI
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
interface ResetEmailState {
    resetEmail: string
    code: string | null
    newPassword: string | undefined
}
export default function Page() {
    const [resetEmail, setResetEmail] = useState<ResetEmailState>({
        resetEmail: '',
        code: null,
        newPassword: undefined,
    })
    const [formStatus, setFormStatus] = useState<1 | 2>(1)
    const [error, setError] = useState<string | null>(null)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setResetEmail({
            ...resetEmail,
            [event.target.name]: event.target.value,
        })
    }
    const handleClick = async () => {
        setError(null)
        try {
            await sendPasswordResetEmail(auth, resetEmail.resetEmail)
            setFormStatus(2)
        } catch (err) {
            setError('Error al enviar el correo de restauración.')
            console.error('Reset email error:', err)
        }
    }
    const handleConfirm = async () => {
        if (!resetEmail.code || !resetEmail.newPassword) return
        setError(null)
        try {
            await confirmPasswordReset(auth, resetEmail.code, resetEmail.newPassword)
            setFormStatus(1)
            // TODO: Navigate to login or show success message
        } catch (err) {
            setError('Error al restaurar la contraseña con este código.')
            console.error('Confirm reset error:', err)
        }
    }
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex pt-4 pb-4">
                <Col className="col-10">
                    <h2 className="headline-xl pb-4">Recuperar contraseña</h2>
                    <Box
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {formStatus === 1 && (
                            <>
                                <p className="body-1 pb-4 m-0">
                                    Ingresa la cuenta de correo con la que te has registrado
                                </p>
                                <TextField
                                    sx={{ minWidth: '300px' }}
                                    id="resetEmail"
                                    name="resetEmail"
                                    label="Ingresa tu cuenta de correo"
                                    value={resetEmail.resetEmail}
                                    onChange={handleChange}
                                    variant="standard"
                                    type="email"
                                />
                                <Button className="my-4" type="submit" onClick={handleClick}>
                                    Enviar correo de restablecimiento
                                </Button>
                            </>
                        )}
                        {formStatus === 2 && (
                            <>
                                <p className="body-1 pb-4 m-0">
                                    Ingresa el código que recibiste en tu correo y la nueva contraseña
                                </p>
                                <TextField
                                    sx={{ minWidth: '300px' }}
                                    id="code"
                                    name="code"
                                    label="Ingresar el código recibido"
                                    value={resetEmail.code || ''}
                                    onChange={handleChange}
                                    variant="standard"
                                />
                                <TextField
                                    sx={{ minWidth: '300px' }}
                                    id="newPassword"
                                    name="newPassword"
                                    label="Ingresa tu nueva contraseña segura"
                                    value={resetEmail.newPassword || ''}
                                    onChange={handleChange}
                                    variant="standard"
                                    type="password"
                                />
                                <Button className="my-4" type="submit" onClick={handleConfirm}>
                                    Confirmar cambio de contraseña
                                </Button>
                            </>
                        )}
                        {error && <p className="body-1 text-danger">{error}</p>}
                    </Box>
                    <p className="body-1 pt-2 m-0">
                        Eres nuevo, crea fácil una cuenta,
                        <Link className="body-2 btn-TEXT text-verde-2" href="/registro/">
                            {' Registrarme'}
                        </Link>
                    </p>
                </Col>
            </Row>
        </Container>
    )
}
