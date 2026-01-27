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
    type UserRoleNumeric,
    type DraftInfo,
} from '@features/auth'
// Components
import { SnackBarAlert } from '@components/common'
// Styles
import '@assets/css/ingreso.css'
// MUI
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
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
        <Container fluid className="p-0">
            <Row className="ingresoFormulario m-0 w-100">
                {showLogo && (
                    <Col
                        className="imagenIngreso d-flex align-items-start justify-content-center"
                        lg={6} md={6} sm={12}
                    >
                        <Box style={{ top: '16vh', position: 'relative' }}>
                            <Typography className="text-white" variant="h4">
                                Bienvenido a
                            </Typography>
                        </Box>
                    </Col>
                )}
                <Col className="ingresarFormulario m-0 p-0 mb-4 mt-4" lg={4} md={5} sm={10} xs={10}>
                    <Paper elevation={16} id="formularioIngreso" className="pt-4 pb-4">
                        <Form action="" className="p-4" onSubmit={handleEmailLogin}>
                            <Col className="d-flex pt-4 pb-4">
                                <Typography variant="h4" className="headline-xl">
                                    Iniciar sesión
                                </Typography>
                                {/* Step 1: Role Selection */}
                                {step === 1 && (
                                    <>
                                        <RoleSelector
                                            onSelect={handleSelectRole}
                                            selectedRole={role}
                                        />
                                        <p className="body-1 pt-2 m-0">
                                            <Link className="body-2 btn-TEXT textVerde2" href="/registro/">
                                                Registrarme
                                            </Link>
                                        </p>
                                        <Link className="body-2 btn-TEXT textVerde2" href="/restaurar-contrasena/">
                                            <Button className="textBlanco btn-TEXT btn-round btn-high" variant="primary">
                                                Olvidé mi contraseña
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                {/* Step 2: Login Form */}
                                {step === 2 && (
                                    <>
                                        <Form.Label className="mb-0 body-1 pt-4">
                                            {role === 1 ? 'Soy propietario/residente' : 'Soy comerciante calificado'}
                                        </Form.Label>
                                        <GoogleAuthButton
                                            onClick={handleGoogleLogin}
                                            label="Ingresar con Gmail"
                                        />
                                        <Col className="d-flex flex-column align-items-center" lg={10} md={12} sm={10} xs={12}>
                                            <Form.Group className="pt-2 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-0 body-1">Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="usa tu correo electrónico"
                                                    value={email}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-0 body-1">Contraseña</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="usa tu contraseña"
                                                    value={password}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col className="pt-4 pb-2">
                                            <Button
                                                onClick={() => setStep(1)}
                                                className="mb-4 btn-round btn-middle w-auto"
                                                variant="secondary"
                                            >
                                                <KeyboardBackspaceIcon /> Volver atrás
                                            </Button>
                                            <span className="mt-1" style={{ marginBottom: '1rem' }} />
                                            <Button
                                                className="btn-buscador btn-round btn-high body-1"
                                                variant="primary"
                                                type="submit"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                                            </Button>
                                        </Col>
                                    </>
                                )}
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
