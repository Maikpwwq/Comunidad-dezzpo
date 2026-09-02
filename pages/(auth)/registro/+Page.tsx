/**
 * Auth Page: Registro (Register)
 *
 * Refactored to use @features/auth components and hooks with SMS OTP & Email support.
 */
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from '@hooks'
import { useDuplicateNameCheck } from '@hooks/useDuplicateNameCheck'
// Auth feature components & hooks
import {
    useAuthActions,
    RoleSelector,
    GoogleAuthButton,
    OrDivider,
    AuthMethodTabs,
    OTPCodeInput,
    type UserRoleNumeric,
    type DraftInfo,
    type AuthMethod,
} from '@features/auth'
import type { ConfirmationResult } from 'firebase/auth'
import { formatPhoneDisplay } from '@services/utils/phoneUtils'
// Components
import { SnackBarAlert, DuplicateNameAlert } from '@components/common'
// Styles
import clsx from 'clsx'
import styles from './Register.module.scss'
// MUI
import { Paper, Box, Typography } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import EditIcon from '@mui/icons-material/Edit'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
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
    // Auth hook - all Firebase logic is centralized
    const {
        alert,
        showAlert,
        closeAlert,
        registerWithEmail,
        registerWithGoogle,
        sendPhoneSMSCode,
        verifyPhoneSMSCodeAndRegister,
        isLoading
    } = useAuthActions()

    // Local state
    const [step, setStep] = useState<1 | 2>(1)
    const [authMethod, setAuthMethod] = useState<AuthMethod>('phone')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState<UserRoleNumeric>(null)
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

    // Phone Auth specific state
    const [phoneNumber, setPhoneNumber] = useState('')
    const [countryCode, setCountryCode] = useState('+57')
    const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input')
    const [otpCode, setOtpCode] = useState('')
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    // Duplicate check for merchant name
    const nameCheck = useDuplicateNameCheck({
        type: 'comerciante',
    })

    // Role selection
    const handleSelectRole = (selectedRole: UserRoleNumeric) => {
        setRole(selectedRole)
        nameCheck.reset()
        setStep(2)
        setPhoneStep('input')
        setOtpCode('')
    }

    // Email signup
    const handleEmailSignup = async (e: FormEvent) => {
        e.preventDefault()
        if (!acceptedPrivacy) {
            showAlert('Debes aceptar el Aviso de Privacidad y Tratamiento de Datos.', 'warning')
            return
        }
        if (password !== confirmPassword) {
            showAlert('Las contraseñas no coinciden.', 'warning')
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
        if (!acceptedPrivacy) {
            showAlert('Debes aceptar el Aviso de Privacidad y Tratamiento de Datos para registrarte.', 'warning')
            return
        }
        const result = await registerWithGoogle({ role, name: name || undefined }, draftInfo)
        if (result.success && draftInfo && setDraftInfo && handleSave) {
            setDraftInfo({ ...draftInfo, draftPropietarioResidente: result.user?.uid || '' })
            handleSave()
        }
    }

    // Phone Auth: Send SMS OTP
    const handleSendSMS = async (e?: FormEvent) => {
        if (e) e.preventDefault()

        if (!name || name.trim().length < 2) {
            showAlert('Por favor ingresa tu nombre o el de tu empresa.', 'info')
            return
        }
        if (!phoneNumber || phoneNumber.trim().length < 7) {
            showAlert('Por favor ingresa un número de teléfono celular válido.', 'info')
            return
        }
        if (!acceptedPrivacy) {
            showAlert('Debes aceptar el Aviso de Privacidad y Tratamiento de Datos.', 'warning')
            return
        }

        const fullPhone = `${countryCode}${phoneNumber.trim()}`
        const res = await sendPhoneSMSCode(fullPhone, 'recaptcha-container')

        if (res.success && res.confirmationResult) {
            setConfirmationResult(res.confirmationResult)
            setPhoneStep('otp')
            setOtpCode('')
        }
    }

    // Phone Auth: Resend SMS OTP
    const handleResendSMS = async () => {
        const fullPhone = `${countryCode}${phoneNumber.trim()}`
        const res = await sendPhoneSMSCode(fullPhone, 'recaptcha-container')
        if (res.success && res.confirmationResult) {
            setConfirmationResult(res.confirmationResult)
        }
    }

    // Phone Auth: Verify OTP and Register
    const handleVerifyPhoneOTP = async (codeToVerify?: string) => {
        const code = codeToVerify || otpCode
        if (!confirmationResult) {
            showAlert('Sesión de verificación expirada. Solicita un nuevo código.', 'error')
            setPhoneStep('input')
            return
        }
        if (!code || code.trim().length !== 6) {
            showAlert('Ingresa el código de 6 dígitos que recibiste por SMS.', 'info')
            return
        }

        const fullPhone = `${countryCode}${phoneNumber.trim()}`
        const result = await verifyPhoneSMSCodeAndRegister(
            confirmationResult,
            code,
            { name, phoneNumber: fullPhone, role },
            draftInfo
        )

        if (result.success && draftInfo && setDraftInfo && handleSave) {
            setDraftInfo({ ...draftInfo, draftPropietarioResidente: result.user?.uid || '' })
            handleSave()
        }
    }

    const formContent = (
        <Col className={clsx(styles.FormWrapper, "m-0 p-0 mb-4 mt-4")} lg={4} md={5} sm={10} xs={10}>
            <Paper elevation={16} className={clsx(styles.FormCard, "pt-4 pb-4")}>
                {/* Invisible reCAPTCHA container */}
                <div id="recaptcha-container"></div>

                <Form action="" className="p-2" onSubmit={authMethod === 'phone' ? handleSendSMS : handleEmailSignup}>
                    <Col className="d-flex pt-4 pb-4">
                        <h1 className="type-hero-title">
                            Regístrate
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
                                <Form.Label className="mb-0 body-1 pt-2">
                                    {role === 1 ? 'Soy propietario/residente' : 'Soy comerciante calificado'}
                                </Form.Label>

                                <GoogleAuthButton
                                    onClick={handleGoogleSignup}
                                    label="Registrarse con Gmail"
                                />

                                <OrDivider />

                                {/* Method Switcher: Phone vs Email */}
                                <AuthMethodTabs
                                    method={authMethod}
                                    onChange={(m) => {
                                        setAuthMethod(m)
                                        setPhoneStep('input')
                                        setOtpCode('')
                                    }}
                                />

                                {authMethod === 'phone' ? (
                                    /* =================== PHONE AUTH FLOW =================== */
                                    phoneStep === 'input' ? (
                                        /* Step 2A: Phone & Name Input */
                                        <>
                                            <Col className="d-flex flex-column align-items-center" lg={10} md={12} sm={10} xs={12}>
                                                <Form.Group className="pt-2 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                    <Form.Label className="mb-1 body-1 font-weight-bold">
                                                        {role === 2 ? 'Nombre de usuario / Marca o Empresa' : 'Nombre de usuario'}
                                                    </Form.Label>
                                                    <Form.Control
                                                        className={clsx(styles.Input)}
                                                        type="text"
                                                        placeholder={role === 2 ? 'nombre de su empresa o marca comercial' : 'elija su usuario o nombre'}
                                                        value={name}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            setName(e.target.value)
                                                            if (nameCheck.status !== 'idle') nameCheck.reset()
                                                        }}
                                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                            if (role === 2) {
                                                                nameCheck.handleBlur(e.target.value)
                                                            }
                                                        }}
                                                    />
                                                    {role === 2 && (
                                                        <Box sx={{ width: '100%' }}>
                                                            <DuplicateNameAlert
                                                                status={nameCheck.status}
                                                                isChecking={nameCheck.isChecking}
                                                                matches={nameCheck.matches}
                                                                exactMatch={nameCheck.exactMatch}
                                                                type="comerciante"
                                                                checkedValue={nameCheck.checkedValue}
                                                            />
                                                        </Box>
                                                    )}
                                                </Form.Group>

                                                <Form.Group className="w-80 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                    <Form.Label className="mb-1 body-1 font-weight-bold">Número de Celular</Form.Label>
                                                    <div className={styles.PhoneInputGroup}>
                                                        <select
                                                            className={styles.CountrySelect}
                                                            value={countryCode}
                                                            onChange={(e) => setCountryCode(e.target.value)}
                                                        >
                                                            <option value="+57">🇨🇴 +57</option>
                                                            <option value="+1">🇺🇸 +1</option>
                                                            <option value="+52">🇲🇽 +52</option>
                                                            <option value="+34">🇪🇸 +34</option>
                                                            <option value="+54">🇦🇷 +54</option>
                                                            <option value="+56">🇨🇱 +56</option>
                                                            <option value="+51">🇵🇪 +51</option>
                                                        </select>
                                                        <input
                                                            className={styles.PhoneInput}
                                                            type="tel"
                                                            inputMode="tel"
                                                            placeholder="ej. 320 484 2897"
                                                            value={phoneNumber}
                                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value.replace(/[^\d\s-]/g, ''))}
                                                        />
                                                    </div>
                                                    <Typography sx={{ fontSize: '0.78rem', color: '#64748b', mt: 0.8, textAlign: 'left' }}>
                                                        Te enviaremos un código SMS de 6 dígitos para validar tu cuenta.
                                                    </Typography>
                                                </Form.Group>
                                            </Col>

                                            <Col className="pt-2 pb-3 d-flex flex-column align-items-center">
                                                <Form.Group className="mb-3 text-start w-100 px-2" style={{ maxWidth: 360 }}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="accept-privacy-checkbox-phone"
                                                        checked={acceptedPrivacy}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAcceptedPrivacy(e.target.checked)}
                                                        label={
                                                            <span className="body-2" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                                                                He leído y acepto el{' '}
                                                                <a
                                                                    href="/legal?doc=aviso-privacidad"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={clsx(styles.Link, styles.Green)}
                                                                    style={{ textDecoration: 'underline', fontWeight: 700 }}
                                                                >
                                                                    Aviso de Privacidad y Autorización para el Tratamiento de Datos Personales
                                                                </a>
                                                                . <span style={{ color: '#ef4444' }}>*</span>
                                                            </span>
                                                        }
                                                    />
                                                </Form.Group>

                                                <Button
                                                    onClick={() => setStep(1)}
                                                    className="mb-3 btn-round btn-middle w-auto"
                                                    variant="secondary"
                                                >
                                                    <KeyboardBackspaceIcon /> Volver atrás
                                                </Button>
                                                <Button
                                                    className={styles.PrimaryAuthButton}
                                                    type="submit"
                                                    disabled={isLoading || !acceptedPrivacy || !phoneNumber || !name}
                                                >
                                                    <PhoneIphoneIcon sx={{ fontSize: 20 }} />
                                                    {isLoading ? 'Enviando código...' : 'Enviar Código por SMS'}
                                                </Button>
                                            </Col>
                                        </>
                                    ) : (
                                        /* Step 2B: OTP Verification */
                                        <Col className="d-flex flex-column align-items-center px-2" lg={11} md={12} sm={11} xs={12}>
                                            <Box sx={{ bgcolor: 'rgba(4, 131, 101, 0.06)', borderRadius: '12px', p: 2, my: 1, width: '100%', textAlign: 'center' }}>
                                                <Typography sx={{ fontSize: '0.9rem', color: '#1f2937' }}>
                                                    Código enviado al número:
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 0.5 }}>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary-color, #048365)' }}>
                                                        {formatPhoneDisplay(`${countryCode}${phoneNumber}`)}
                                                    </Typography>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        onClick={() => setPhoneStep('input')}
                                                        className="p-0 text-muted"
                                                        title="Modificar número"
                                                    >
                                                        <EditIcon sx={{ fontSize: 16 }} />
                                                    </Button>
                                                </Box>
                                            </Box>

                                            <OTPCodeInput
                                                value={otpCode}
                                                onChange={setOtpCode}
                                                onComplete={(code) => handleVerifyPhoneOTP(code)}
                                                onResend={handleResendSMS}
                                                isLoading={isLoading}
                                            />

                                            <Col className="pt-2 pb-3 d-flex flex-column align-items-center w-100">
                                                <Button
                                                    onClick={() => setPhoneStep('input')}
                                                    className="mb-3 btn-round btn-middle w-auto"
                                                    variant="secondary"
                                                >
                                                    <KeyboardBackspaceIcon /> Cambiar número
                                                </Button>
                                                <Button
                                                    className={clsx(styles.PrimaryAuthButton, "w-100")}
                                                    type="button"
                                                    onClick={() => handleVerifyPhoneOTP()}
                                                    disabled={isLoading || otpCode.length !== 6}
                                                >
                                                    {isLoading ? 'Verificando...' : 'Verificar y Crear Cuenta'}
                                                </Button>
                                            </Col>
                                        </Col>
                                    )
                                ) : (
                                    /* =================== EMAIL AUTH FLOW =================== */
                                    <>
                                        <Col className="d-flex flex-column align-items-center" lg={10} md={12} sm={10} xs={12}>
                                            <Form.Group className="pt-2 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-1 body-1">
                                                    {role === 2 ? 'Nombre de usuario / Marca o Empresa' : 'Nombre de usuario'}
                                                </Form.Label>
                                                <Form.Control
                                                    className={clsx(styles.Input)}
                                                    type="text"
                                                    placeholder={role === 2 ? 'nombre de su empresa o marca comercial' : 'elija su usuario'}
                                                    value={name}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        setName(e.target.value)
                                                        if (nameCheck.status !== 'idle') nameCheck.reset()
                                                    }}
                                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                        if (role === 2) {
                                                            nameCheck.handleBlur(e.target.value)
                                                        }
                                                    }}
                                                />
                                                {role === 2 && (
                                                    <Box sx={{ width: '100%' }}>
                                                        <DuplicateNameAlert
                                                            status={nameCheck.status}
                                                            isChecking={nameCheck.isChecking}
                                                            matches={nameCheck.matches}
                                                            exactMatch={nameCheck.exactMatch}
                                                            type="comerciante"
                                                            checkedValue={nameCheck.checkedValue}
                                                        />
                                                    </Box>
                                                )}
                                            </Form.Group>
                                            <Form.Group className="w-80 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-1 body-1">Email</Form.Label>
                                                <Form.Control
                                                    className={clsx(styles.Input)}
                                                    type="email"
                                                    placeholder="registre una cuenta de email válida"
                                                    value={email}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="w-80 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-1 body-1">Contraseña</Form.Label>
                                                <Form.Control
                                                    className={clsx(styles.Input)}
                                                    type="password"
                                                    placeholder="registre una clave"
                                                    value={password}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="w-80 mb-2 d-flex flex-column align-items-start" style={{ width: 'inherit' }}>
                                                <Form.Label className="mb-1 body-1">Confirmar contraseña</Form.Label>
                                                <Form.Control
                                                    className={clsx(styles.Input)}
                                                    type="password"
                                                    placeholder="de nuevo la clave"
                                                    value={confirmPassword}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col className="pt-2 pb-3 d-flex flex-column align-items-center">
                                            <Form.Group className="mb-3 text-start w-100 px-2" style={{ maxWidth: 360 }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    id="accept-privacy-checkbox-email"
                                                    checked={acceptedPrivacy}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAcceptedPrivacy(e.target.checked)}
                                                    label={
                                                        <span className="body-2" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                                                            He leído y acepto el{' '}
                                                            <a
                                                                href="/legal?doc=aviso-privacidad"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={clsx(styles.Link, styles.Green)}
                                                                style={{ textDecoration: 'underline', fontWeight: 700 }}
                                                            >
                                                                Aviso de Privacidad y Autorización para el Tratamiento de Datos Personales
                                                            </a>
                                                            . <span style={{ color: '#ef4444' }}>*</span>
                                                        </span>
                                                    }
                                                />
                                            </Form.Group>

                                            <Button
                                                onClick={() => setStep(1)}
                                                className="mb-3 btn-round btn-middle w-auto"
                                                variant="secondary"
                                            >
                                                <KeyboardBackspaceIcon /> Volver atrás
                                            </Button>
                                            <Button
                                                className={styles.PrimaryAuthButton}
                                                type="submit"
                                                disabled={isLoading || !acceptedPrivacy}
                                            >
                                                {isLoading ? 'Cargando...' : 'Crear Cuenta'}
                                            </Button>
                                        </Col>
                                    </>
                                )}
                            </>
                        )}
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e2e8f0', width: '100%', textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                ¿Ya tienes una cuenta?{' '}
                                <Link
                                    href="/ingreso/"
                                    className={clsx(styles.Link, styles.Green)}
                                    style={{ fontWeight: 700, textDecoration: 'underline' }}
                                >
                                    Inicia sesión aquí
                                </Link>
                            </Typography>
                        </Box>
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
                    className={clsx(styles.ImageSection, "m-0 d-flex flex-column align-items-center justify-content-center")}
                    lg={6} md={6} sm={12}
                >
                    <div className={styles.GreetingWrapper}>
                        <h2 className={styles.GreetingText}>
                            Bienvenido a
                        </h2>
                        <img
                            src="/assets/img/logo/LOGO-11.png"
                            alt="Comunidad Dezzpo"
                            className={styles.LogoImage}
                        />
                    </div>
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
