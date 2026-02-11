/**
 * Auth Page: Registro (Register)
 *
 * Refactored to use @features/auth components and hooks.
 * Original: 453 lines → Current: ~220 lines (51% reduction)
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
import styles from './Register.module.scss'
// MUI
import { Paper, Box, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import DownloadIcon from '@mui/icons-material/Download'
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
        registerWithEmail,
        registerWithGoogle,
        isLoading
    } = useAuthActions()
    // Local state
    const [step, setStep] = useState<1 | 2>(1)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState<UserRoleNumeric>(null)
    // Role selection
    const handleSelectRole = (selectedRole: UserRoleNumeric) => {
        setRole(selectedRole)
        setStep(2)
    }
    // Email signup
    const handleEmailSignup = async (e: FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            // Alert is handled by hook
            return
        }
        const result = await registerWithEmail(
            { name, email, password, confirmPassword, role },
            draftInfo
        )
        if (result.success && draftInfo && setDraftInfo && handleSave) {
            setDraftInfo({ ...draftInfo, draftPropietarioResidente: result.user?.uid || '' })
            handleSave()
        }
    }
    // Google signup
    const handleGoogleSignup = async () => {
        const result = await registerWithGoogle({ role }, draftInfo)
        if (result.success && draftInfo && setDraftInfo && handleSave) {
            setDraftInfo({ ...draftInfo, draftPropietarioResidente: result.user?.uid || '' })
            handleSave()
        }
    }

    const formContent = (
        <Col className={clsx(styles.FormWrapper, "m-0 p-0 mb-4 mt-4")} lg={4} md={5} sm={10} xs={10}>
            <Paper elevation={16} className={clsx(styles.FormCard, "pt-4 pb-4")}>
                <Form action="" className="p-2" onSubmit={handleEmailSignup}>
                    <Col className="d-flex pt-4 pb-4">
                        <h1 className="type-hero-title">
                            Registrate
                        </h1>
                        {/* Step 1: Role Selection */}
                        {step === 1 ? (
                            <RoleSelector
                                onSelect={handleSelectRole}
                                selectedRole={role}
                            />
                        ) : (
                            <>
                                {/* Step 2: Registration Form */}
                                <Form.Label className="mb-0 body-1 pt-4">
                                    {role === 1 ? 'Soy propietario/residente' : 'Soy comerciante calificado'}
                                </Form.Label>
                                <GoogleAuthButton
                                    onClick={handleGoogleSignup}
                                    label="Registrarse con Gmail"
                                />
                                <OrDivider />
                                <Col className="d-flex flex-column align-items-center" lg={10} md={12} sm={10} xs={12}>
                                    <Form.Group className="pt-2 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                        <Form.Label className="mb-0 body-1">Nombre de usuario</Form.Label>
                                        <Form.Control
                                            className={clsx(styles.Input)}
                                            type="text"
                                            placeholder="elija su usuario"
                                            value={name}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="w-80 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                        <Form.Label className="mb-0 body-1">Email</Form.Label>
                                        <Form.Control
                                            className={clsx(styles.Input)}
                                            type="email"
                                            placeholder="registre una cuenta de email válida"
                                            value={email}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="w-80 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                        <Form.Label className="mb-0 body-1">Contraseña</Form.Label>
                                        <Form.Control
                                            className={clsx(styles.Input)}
                                            type="password"
                                            placeholder="registre una clave"
                                            value={password}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="w-80 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                        <Form.Label className="mb-0 body-1">Confirmar contraseña</Form.Label>
                                        <Form.Control
                                            className={clsx(styles.Input)}
                                            type="password"
                                            placeholder="de nuevo la clave"
                                            value={confirmPassword}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col className="pt-4 pb-3">
                                    <a
                                        href="https://drive.google.com/file/d/1R3uRi3zZ0MmjN3VoUp3GvLGvZ3bCaT6e/view?usp=sharing"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <h3 className={clsx(styles.Link, styles.Green, "body-2 btn-TEXT")}>
                                            Aviso tratamiento de datos personales <DownloadIcon fontSize="small" />.
                                        </h3>
                                    </a>
                                    <br />
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
                                        {isLoading ? 'Cargando...' : 'Crear Cuenta'}
                                    </Button>
                                </Col>
                            </>
                        )}
                        <p className="body-1 pt-2">
                            <Link className={clsx(styles.Link, styles.Green, "body-2 btn-TEXT")} href="/ingreso/">
                                Ingresar
                            </Link>
                        </p>
                    </Col>
                </Form>
            </Paper>
        </Col>
    )

    if (!showLogo) {
        return formContent
    }

    return (
        <Container fluid className={clsx(styles.Container, "p-0")}>
            <Row className={clsx(styles.MainRow, "m-0")} id="registrate">
                <Col
                    className={clsx(styles.ImageSection, "m-0 d-flex align-items-center justify-content-start")}
                    md={6} sm={12}
                >
                    <Box style={{ top: '16vh', position: 'relative' }}>
                        <Typography className="text-white" variant="h4">
                            Bienvenido a
                        </Typography>
                    </Box>
                </Col>
                {formContent}
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
