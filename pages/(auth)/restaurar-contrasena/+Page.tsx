/**
 * Restaurar Contraseña (Password Reset) Page
 *
 * Refactored with standardized typography and modern auth-family styling.
 */
import { useState } from 'react'
import { auth } from '@services/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
// Components
import { Link } from '@hooks'
// Styles
import clsx from 'clsx'
import styles from './ResetPassword.module.scss'
// MUI
import { Paper, Box, TextField, Button, Alert } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
// Bootstrap
import { Container, Row } from 'react-bootstrap'

export default function Page() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return
        if (!auth) {
            setError('Servicio de autenticación no disponible.')
            return
        }
        setError(null)
        setIsLoading(true)
        try {
            await sendPasswordResetEmail(auth, email.trim())
            setSent(true)
        } catch (err) {
            setError('No pudimos enviar el correo. Verifica que la dirección sea correcta.')
            console.error('Reset email error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container fluid className={clsx(styles.Container, 'p-0')}>
            <Row className={clsx(styles.MainRow, 'm-0')}>
                <Paper elevation={16} className={styles.FormCard || ''}>
                    {!sent ? (
                        /* ── Step 1: Request reset ─────────────────── */
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2.5,
                                px: 2,
                            }}
                        >
                            <h1 className="type-hero-title" style={{ margin: 0 }}>
                                Recuperar contraseña
                            </h1>
                            <p className="type-body" style={{ margin: 0, color: 'var(--content-text-color)' }}>
                                Ingresa el correo con el que te registraste y te enviaremos
                                un enlace para restablecer tu contraseña.
                            </p>

                            <TextField
                                className={styles.Input || ''}
                                id="resetEmail"
                                label="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="outlined"
                                type="email"
                                fullWidth
                                autoFocus
                            />

                            {error && (
                                <Alert severity="error" sx={{ width: '100%', borderRadius: '12px' }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                className={styles.SubmitButton || ''}
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading || !email.trim()}
                                disableElevation
                            >
                                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                            </Button>

                            <Link className={styles.Link || ''} href="/ingreso/">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <KeyboardBackspaceIcon fontSize="small" />
                                    <span className="type-caption">Volver a iniciar sesión</span>
                                </Box>
                            </Link>
                        </Box>
                    ) : (
                        /* ── Step 2: Success confirmation ──────────── */
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                px: 2,
                            }}
                        >
                            <CheckCircleOutlineIcon className={styles.SuccessIcon || ''} />
                            <h2 className="type-section-title" style={{ margin: 0 }}>
                                ¡Correo enviado!
                            </h2>
                            <p className="type-body" style={{ margin: 0, color: 'var(--content-text-color)', textAlign: 'center' }}>
                                Enviamos un enlace de recuperación a <strong>{email}</strong>.
                                Revisa tu bandeja de entrada y sigue las instrucciones.
                            </p>
                            <p className="type-caption" style={{ margin: 0, color: 'var(--content-text-light-gray-color)' }}>
                                ¿No lo ves? Revisa la carpeta de spam.
                            </p>

                            <Button
                                className={styles.SubmitButton || ''}
                                variant="contained"
                                disableElevation
                                onClick={() => { setSent(false); setEmail('') }}
                                sx={{ mt: 1 }}
                            >
                                Enviar otro correo
                            </Button>

                            <Link className={styles.Link || ''} href="/ingreso/">
                                <span className="type-caption">Volver a iniciar sesión</span>
                            </Link>
                        </Box>
                    )}

                    {/* ── Registration nudge ───────────────────── */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid var(--auth-divider-color)', textAlign: 'center' }}>
                        <p className="type-caption" style={{ margin: 0 }}>
                            ¿Eres nuevo?{' '}
                            <Link className={styles.Link || ''} href="/registro/">
                                Crea tu cuenta
                            </Link>
                        </p>
                    </Box>
                </Paper>
            </Row>
        </Container>
    )
}

