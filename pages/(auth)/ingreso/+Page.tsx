/**
 * Auth Page: Ingreso (Login)
 *
 * Refactored to use @features/auth components and hooks.
 * Original: 384 lines → Current: ~170 lines (56% reduction)
 */
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from '@hooks'
// Auth feature components & hooks
import {
    useAuthActions,
    RoleSelector,
    GoogleAuthButton,
    OrDivider,
    type UserRoleNumeric,
    type DraftInfo,
} from '@features/auth'
// Components
import { SnackBarAlert } from '@components/common'
// Styles
import clsx from 'clsx'
import styles from './Login.module.scss'
// MUI
import { Paper, Box, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
// Bootstrap
// Bootstrap
import {
    Row,
    Col,
    Container,
    Button,
    Form
} from 'react-bootstrap'
// Types
interface PageProps {
    showLogo?: boolean
    draftInfo?: DraftInfo
    setDraftInfo?: (info: DraftInfo) => void
    handleSave?: () => void
}
export default function Page({
    showLogo = true,
    draftInfo,
    setDraftInfo,
    handleSave
}: PageProps) {
    // Auth hook - all Firebase logic is now centralized
    const {
        alert,
        closeAlert,
        loginWithEmail,
        loginWithGoogle,
        isLoading
    } = useAuthActions()
    // Local state
    const [step, setStep] = useState<1 | 2>(1)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<UserRoleNumeric>(null)
    // Role selection
    const handleSelectRole = (selectedRole: UserRoleNumeric) => {
        setRole(selectedRole)
        setStep(2)
    }
    // Email login
    const handleEmailLogin = async (e: FormEvent) => {
        e.preventDefault()
        const result = await loginWithEmail({ email, password, role }, draftInfo)
        if (result.success && draftInfo && setDraftInfo && handleSave) {
            setDraftInfo({ ...draftInfo, draftPropietarioResidente: result.user?.uid || '' })
            handleSave()
        }
    }
    // Google login
    const handleGoogleLogin = async () => {
        const result = await loginWithGoogle(role, draftInfo)
        if (result.success && draftInfo && setDraftInfo && handleSave) {
            setDraftInfo({ ...draftInfo, draftPropietarioResidente: result.user?.uid || '' })
            handleSave()
        }
    }
    return (
        <Container fluid className={clsx(styles.Container, "p-0")}>
            <Row className={clsx(styles.MainRow, "m-0 w-100")}>
                {showLogo && (
                    <Col
                        className={clsx(styles.ImageSection, "d-flex align-items-start justify-content-center")}
                        lg={6} md={6} sm={12}
                    >
                        <Box style={{ top: '16vh', position: 'relative' }}>
                            <Typography className="text-white" variant="h4">
                                Bienvenido a
                            </Typography>
                        </Box>
                    </Col>
                )}
                <Col className={clsx(styles.FormWrapper, "m-0 p-0 mb-4 mt-4")} lg={4} md={5} sm={10} xs={10}>
                    <Paper elevation={16} className={clsx(styles.FormCard, "pt-4 pb-4")}>
                        <Form action="" className="p-4" onSubmit={handleEmailLogin}>
                            <Col className="d-flex flex-column align-items-center text-center pt-2 pb-2">
                                <h1 className="type-hero-title mb-3">
                                    Iniciar sesión
                                </h1>
                                {/* Step 1: Role Selection */}
                                {step === 1 && (
                                    <RoleSelector
                                        onSelect={handleSelectRole}
                                        selectedRole={role}
                                    />
                                )}
                                {/* Step 2: Login Form */}
                                {step === 2 && (
                                    <>
                                        <Form.Label className="mb-0 body-1 pt-2">
                                            {role === 1 ? 'Soy propietario/residente' : 'Soy comerciante calificado'}
                                        </Form.Label>
                                        <GoogleAuthButton
                                            onClick={handleGoogleLogin}
                                            label="Ingresar con Gmail"
                                        />
                                        <OrDivider />
                                        <Col className="d-flex flex-column align-items-center" lg={10} md={12} sm={10} xs={12}>
                                            <Form.Group className="pt-2 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-0 body-1">Email</Form.Label>
                                                <Form.Control
                                                    className={clsx(styles.Input)}
                                                    type="email"
                                                    placeholder="usa tu correo electrónico"
                                                    value={email}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-0 body-1">Contraseña</Form.Label>
                                                <Form.Control
                                                    className={clsx(styles.Input)}
                                                    type="password"
                                                    placeholder="usa tu contraseña"
                                                    value={password}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col className="pt-3 pb-2 d-flex flex-wrap justify-content-center gap-2">
                                            <Button
                                                onClick={() => setStep(1)}
                                                className="btn-round btn-middle w-auto"
                                                variant="secondary"
                                            >
                                                <KeyboardBackspaceIcon /> Volver atrás
                                            </Button>
                                            <Button
                                                className={clsx(styles.TealButton, "btn-buscador btn-round btn-high body-1")}
                                                variant="light"
                                                type="submit"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                                            </Button>
                                        </Col>
                                    </>
                                )}

                                {/* Permanent links visible on both Step 1 & Step 2 */}
                                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e2e8f0', width: '100%', textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                                        ¿No tienes una cuenta aún?{' '}
                                        <Link
                                            href="/registro/"
                                            className={clsx(styles.Link, styles.Green)}
                                            style={{ fontWeight: 700, textDecoration: 'underline' }}
                                        >
                                            Regístrate aquí
                                        </Link>
                                    </Typography>
                                    <Link
                                        href="/restaurar-contrasena/"
                                        className={clsx(styles.Link)}
                                        style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'underline' }}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </Box>
                            </Col>
                        </Form>
                    </Paper>
                </Col>
            </Row>
            {alert.open && (
                <SnackBarAlert
                    message={alert.message}
                    onClose={closeAlert}
                    severity={alert.severity}
                    open={alert.open}
                />
            )}
        </Container>
    )
}
