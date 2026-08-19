/**
 * Ajustes (Settings) Page
 *
 * Card-based grid layout with per-section save buttons.
 * Desktop: 2-column grid. Mobile: single column.
 *
 * Cards:
 * 1. Datos de Contacto — name, email, phone, identification, website
 * 2. Presentación / Servicios — description, categories
 * 3. Ubicación — direction, city, postal code, map modal
 */
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@hooks/useAuth'

// Services
import { getUser, updateUser } from '@services/users'
import type { UserRole, ContactEmail, ContactPhone, SocialLink, Property, UserLocationItem } from '@services/types'
import { storage } from '@services/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { createEmptyEmail, createEmptyPhone } from '@utilities/contactUtils'
import {
    createEmptySocialLink,
    validateSocialUrl,
    PLATFORM_CONFIG,
    PLATFORM_LIST,
} from '@utilities/socialUtils'

// Components
import { Ubicacion } from '@features/marketing'
import PropertiesManager from '@features/profile/components/PropertiesManager'
import { SnackBarAlert, ChipsCategories } from '@components/common'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'
import { zones, zoneNames } from '@assets/data/ListadoZonas'

// MUI
import {
    Button,
    TextField,
    TextareaAutosize,
    Modal,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormControlLabel,
    Switch,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip,
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import ErrorIcon from '@mui/icons-material/Error'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

// Hooks & Services
import { useDuplicateNameCheck } from '@hooks/useDuplicateNameCheck'
import { DuplicateNameAlert } from '@components/common'

// Styles
import styles from './Ajustes.module.scss'

interface UserEditInfo {
    userName: string
    userMail: string
    userPhone: string
    userPhotoUrl: string
    userGalleryUrl: string[]
    userCreatedDrafts: any[]
    userId: string
    userJoined: string
    userProfession: string
    userExperience: string
    userChannelUrl: string
    userCategories: any[]
    userDirection: string
    userDirectionDetails?: string
    userCiudad: string
    userCodigoPostal: string
    userRazonSocial: string
    userContactName?: string
    userIdentificationType: string
    userIdentification: string
    userDescription: string
    userWebSite: string
    [key: string]: any
}

interface AlertState {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
}

export default function Page() {
    const { currentUser } = useAuth()
    const userAuthID = currentUser?.userId || ''

    const [isLoaded, setIsLoaded] = useState(false)
    const [userRol, setUserRol] = useState<{ rol: UserRole | undefined }>({
        rol: currentUser?.rol as UserRole | undefined,
    })

    // Duplicate name validation hook for merchants
    const nameCheck = useDuplicateNameCheck({
        type: 'comerciante',
        excludeId: userAuthID,
    })

    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'success',
    })

    const [locationModalOpen, setLocationModalOpen] = useState(false)

    // Identity verification state
    const [idDocType, setIdDocType] = useState<string>('cedula')
    const [idDocUrl, setIdDocUrl] = useState<string>('')
    const [idVerificationStatus, setIdVerificationStatus] = useState<'none' | 'pending' | 'verified' | 'rejected'>('none')
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState(false)

    // Multi-channel contacts & multi-location state (default 1 active phone entry)
    const [emails, setEmails] = useState<ContactEmail[]>([])
    const [phones, setPhones] = useState<ContactPhone[]>([{ number: '', isPrimary: true, type: 'personal' }])
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [socialUrlErrors, setSocialUrlErrors] = useState<Record<string, boolean>>({})
    const [properties, setProperties] = useState<Property[]>([])
    const [locations, setLocations] = useState<UserLocationItem[]>([])
    const [activeLocationIdxForMap, setActiveLocationIdxForMap] = useState<number | null>(null)

    // Coverage zones state (comerciante only)
    const [coverageZones, setCoverageZones] = useState<string[]>([])
    const [coverageCityWide, setCoverageCityWide] = useState(false)
    const [isAvailableNow, setIsAvailableNow] = useState(false)

    const [userEditInfo, setUserEditInfo] = useState<UserEditInfo>({
        userName: '',
        userMail: '',
        userPhone: '',
        userPhotoUrl: '',
        userGalleryUrl: [],
        userCreatedDrafts: [],
        userId: '',
        userJoined: '',
        userProfession: '',
        userExperience: '',
        userChannelUrl: '',
        userCategories: [],
        userDirection: '',
        userDirectionDetails: '',
        userCiudad: '',
        userCodigoPostal: '',
        userRazonSocial: '',
        userContactName: '',
        userIdentificationType: 'CC',
        userIdentification: '',
        userDescription: '',
        userWebSite: '',
    })

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userAuthID) return

            let roleToUse: UserRole | undefined = userRol.rol
            if (!roleToUse) {
                const localRole = localStorage.getItem('role')
                if (localRole) {
                    const parsed = parseInt(JSON.parse(localRole))
                    if (!isNaN(parsed)) roleToUse = parsed as UserRole
                }
            }
            if (!roleToUse) return

            try {
                const userData = await getUser({ userId: userAuthID, role: roleToUse })
                if (userData) {
                    setUserEditInfo({
                        userName: userData.userName || '',
                        userMail: userData.userMail || '',
                        userPhone: (userData as any).userPhone || '',
                        userPhotoUrl: (userData as any).userPhotoUrl || '',
                        userGalleryUrl: (userData as any).userGalleryUrl || [],
                        userCreatedDrafts: userData.userCreatedDrafts || [],
                        userId: userData.userId || userAuthID,
                        userJoined: userData.userJoined || '',
                        userProfession: (userData as any).userProfession || '',
                        userExperience: (userData as any).userExperience || '',
                        userChannelUrl: userData.userChannelUrl || '',
                        userCategories: userData.userCategories || [],
                        userDirection: userData.userDirection || '',
                        userDirectionDetails: (userData as any).userDirectionDetails || '',
                        userCiudad: userData.userCiudad || '',
                        userCodigoPostal: userData.userCodigoPostal || '',
                        userRazonSocial: userData.userRazonSocial || '',
                        userContactName: userData.userContactName || (userData as any).userContactName || '',
                        userIdentificationType: (userData as any).userIdentificationType || 'CC',
                        userIdentification: (userData as any).userIdentification || '',
                        userDescription: (userData as any).userDescription || '',
                        userWebSite: (userData as any).userWebSite || '',
                    })

                    // Load multi-channel contacts & multi-location
                    setEmails(userData.emails || [])
                    const loadedPhones = userData.phones || []
                    if (loadedPhones.length > 0) {
                        setPhones(loadedPhones)
                    } else {
                        const legacyPhone = (userData as any).userPhone || (userData as any).userTel || ''
                        setPhones([{ number: legacyPhone, isPrimary: true, type: 'personal' }])
                    }
                    setSocialLinks(userData.socialLinks || [])
                    setProperties(userData.properties || [])

                    const rawLocations: UserLocationItem[] = (userData as any).userLocations || []
                    if (rawLocations.length > 0) {
                        setLocations(rawLocations)
                    } else {
                        setLocations([
                            {
                                id: 'loc_1',
                                nombre: 'Ubicación Principal',
                                direccion: userData.userDirection || '',
                                ciudad: userData.userCiudad || 'Bogotá, Colombia',
                                codigoPostal: userData.userCodigoPostal || '',
                                isPrimary: true,
                            },
                        ])
                    }

                    // Load coverage zones
                    setCoverageZones(userData.userZonasCobertura || [])
                    setCoverageCityWide(userData.coberturaTodaLaCiudad || false)
                    setIsAvailableNow(userData.isAvailableNow || false)

                    setIsLoaded(true)

                    // Load identity verification data if present
                    const idVerification = (userData as any).identityVerification
                    if (idVerification) {
                        setIdDocType(idVerification.docType || 'cedula')
                        setIdDocUrl(idVerification.docUrl || '')
                        setIdVerificationStatus(idVerification.status || 'none')
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        if (!userRol.rol) {
            const localRole = localStorage.getItem('role')
            if (localRole) {
                const selectRole = parseInt(JSON.parse(localRole))
                if (!isNaN(selectRole)) {
                    setUserRol({ rol: selectRole as UserRole })
                }
            }
        }

        if (!isLoaded && userAuthID) {
            fetchUserData()
        }
    }, [isLoaded, userAuthID, userRol.rol])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserEditInfo({
            ...userEditInfo,
            [event.target.name]: event.target.value,
        })
    }

    // Save specific section fields
    const handleSaveSection = useCallback(async (fields: string[]) => {
        if (!userRol.rol) {
            setAlert({ open: true, message: 'Error: Rol no identificado.', severity: 'error' })
            return
        }

        const sectionData: Partial<UserEditInfo> = {}
        for (const field of fields) {
            sectionData[field] = userEditInfo[field]
        }

        try {
            await updateUser({
                userId: userAuthID,
                role: userRol.rol,
                data: sectionData,
            })
            setAlert({ open: true, message: '¡Información actualizada correctamente!', severity: 'success' })
        } catch (error) {
            console.error('Error updating user:', error)
            setAlert({ open: true, message: 'Error al actualizar. Intenta de nuevo.', severity: 'error' })
        }
    }, [userAuthID, userRol.rol, userEditInfo])

    // ── Contact list handlers ──────────────────────────────────────────────
    const handleEmailChange = (index: number, value: string) => {
        setEmails((prev) => prev.map((e, i) => (i === index ? { ...e, address: value } : e)))
    }

    const handlePhoneChange = (index: number, field: 'number' | 'type', value: string) => {
        setPhones((prev) =>
            prev.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            )
        )
    }

    const handleSetPrimaryEmail = (index: number) => {
        setEmails((prev) => prev.map((e, i) => ({ ...e, isPrimary: i === index })))
    }

    const handleSetPrimaryPhone = (index: number) => {
        setPhones((prev) => prev.map((p, i) => ({ ...p, isPrimary: i === index })))
    }

    const handleAddEmail = () => setEmails((prev) => [...prev, createEmptyEmail()])
    const handleAddPhone = () => setPhones((prev) => [...prev, createEmptyPhone()])

    const handleRemoveEmail = (index: number) => {
        if (emails[index]?.isPrimary) return
        setEmails((prev) => prev.filter((_, i) => i !== index))
    }

    const handleRemovePhone = (index: number) => {
        if (phones[index]?.isPrimary) return
        setPhones((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSaveContacts = useCallback(async () => {
        if (!userRol.rol) {
            setAlert({ open: true, message: 'Error: Rol no identificado.', severity: 'error' })
            return
        }

        // Build combined payload: regular fields + contact arrays
        const contactFields = [
            'userName', 'userIdentificationType', 'userIdentification', 'userWebSite', 'userRazonSocial', 'userContactName',
            ...(userRol.rol === 2 ? ['userProfession', 'userExperience'] : []),
        ]
        const sectionData: Record<string, any> = {}
        for (const field of contactFields) {
            sectionData[field] = userEditInfo[field]
        }
        sectionData.emails = emails
        sectionData.phones = phones

        try {
            await updateUser({
                userId: userAuthID,
                role: userRol.rol,
                data: sectionData,
            })
            setAlert({ open: true, message: '¡Información actualizada correctamente!', severity: 'success' })
        } catch (error) {
            console.error('Error updating contacts:', error)
            setAlert({ open: true, message: 'Error al actualizar. Intenta de nuevo.', severity: 'error' })
        }
    }, [userAuthID, userRol.rol, userEditInfo, emails, phones])

    // ── Location handlers ────────────────────────────────────────────────
    const handleAddLocation = () => {
        const newLoc: UserLocationItem = {
            id: `loc_${Date.now()}_${locations.length + 1}`,
            nombre: locations.length === 0 ? 'Ubicación Principal' : `Sede / Ubicación ${locations.length + 1}`,
            direccion: '',
            ciudad: userEditInfo.userCiudad || 'Bogotá, Colombia',
            codigoPostal: '',
            isPrimary: locations.length === 0,
        }
        setLocations((prev) => [...prev, newLoc])
    }

    const handleLocationChange = (index: number, field: keyof UserLocationItem, value: any) => {
        setLocations((prev) =>
            prev.map((loc, i) => (i === index ? { ...loc, [field]: value } : loc))
        )
    }

    const handleSetPrimaryLocation = (index: number) => {
        setLocations((prev) =>
            prev.map((loc, i) => ({ ...loc, isPrimary: i === index }))
        )
    }

    const handleRemoveLocation = (index: number) => {
        if (locations[index]?.isPrimary && locations.length > 1) {
            return
        }
        setLocations((prev) => prev.filter((_, i) => i !== index))
    }

    const handleMapLocationSelected = (locInfo: any) => {
        if (activeLocationIdxForMap !== null && locations[activeLocationIdxForMap]) {
            const updatedDir = locInfo.userDirection || locInfo.street || locations[activeLocationIdxForMap].direccion
            const updatedCity = locInfo.userCiudad || locInfo.city || locations[activeLocationIdxForMap].ciudad
            const updatedPostal = locInfo.userCodigoPostal || locInfo.postalCode || locations[activeLocationIdxForMap].codigoPostal

            setLocations((prev) =>
                prev.map((loc, i) =>
                    i === activeLocationIdxForMap
                        ? {
                            ...loc,
                            direccion: updatedDir,
                            ciudad: updatedCity,
                            codigoPostal: updatedPostal,
                            lat: locInfo.lat || loc.lat,
                            lng: locInfo.lng || loc.lng,
                        }
                        : loc
                )
            )
        }
        setLocationModalOpen(false)
        setActiveLocationIdxForMap(null)
    }

    const handleSaveLocations = useCallback(async () => {
        if (!userRol.rol) {
            setAlert({ open: true, message: 'Error: Rol no identificado.', severity: 'error' })
            return
        }

        const primaryLoc = locations.find((l) => l.isPrimary) || locations[0]

        try {
            await updateUser({
                userId: userAuthID,
                role: userRol.rol,
                data: {
                    userLocations: locations,
                    userDirection: primaryLoc?.direccion || '',
                    userCiudad: primaryLoc?.ciudad || '',
                    userCodigoPostal: primaryLoc?.codigoPostal || '',
                },
            })

            setUserEditInfo((prev) => ({
                ...prev,
                userDirection: primaryLoc?.direccion || '',
                userCiudad: primaryLoc?.ciudad || '',
                userCodigoPostal: primaryLoc?.codigoPostal || '',
            }))

            setAlert({ open: true, message: '¡Ubicaciones actualizadas correctamente!', severity: 'success' })
        } catch (error) {
            console.error('Error updating locations:', error)
            setAlert({ open: true, message: 'Error al actualizar ubicaciones. Intenta de nuevo.', severity: 'error' })
        }
    }, [userAuthID, userRol.rol, locations])

    // ── Social links handlers ────────────────────────────────────────────
    const handleSocialChange = (id: string, field: string, value: any) => {
        setSocialLinks((prev) =>
            prev.map((sl) => {
                if (sl.id !== id) return sl
                const updated = { ...sl, [field]: value }
                // Real-time URL validation when URL or platform changes
                if (field === 'url' || field === 'platform') {
                    const platform = field === 'platform' ? value : sl.platform
                    const url = field === 'url' ? value : sl.url
                    setSocialUrlErrors((prev) => ({
                        ...prev,
                        [id]: url ? !validateSocialUrl(platform, url) : false,
                    }))
                }
                return updated
            })
        )
    }

    const handleAddSocial = () => {
        const maxPriority = socialLinks.reduce((max, sl) => Math.max(max, sl.priority), -1)
        setSocialLinks((prev) => [...prev, createEmptySocialLink(maxPriority + 1)])
    }

    const handleRemoveSocial = (id: string) => {
        setSocialLinks((prev) => prev.filter((sl) => sl.id !== id))
        setSocialUrlErrors((prev) => {
            const next = { ...prev }
            delete next[id]
            return next
        })
    }

    const handleSaveSocial = useCallback(async () => {
        if (!userRol.rol) {
            setAlert({ open: true, message: 'Error: Rol no identificado.', severity: 'error' })
            return
        }

        // Check for validation errors before saving
        const hasErrors = Object.values(socialUrlErrors).some(Boolean)
        if (hasErrors) {
            setAlert({ open: true, message: 'Corrige las URLs inválidas antes de guardar.', severity: 'warning' })
            return
        }

        try {
            await updateUser({
                userId: userAuthID,
                role: userRol.rol,
                data: { socialLinks } as any,
            })
            setAlert({ open: true, message: '¡Redes sociales actualizadas!', severity: 'success' })
        } catch (error) {
            console.error('Error updating social links:', error)
            setAlert({ open: true, message: 'Error al actualizar. Intenta de nuevo.', severity: 'error' })
        }
    }, [userAuthID, userRol.rol, socialLinks, socialUrlErrors])

    // ── Coverage zone handlers (comerciante) ─────────────────────────────
    const handleToggleZone = (zone: string) => {
        setCoverageZones((prev) =>
            prev.includes(zone)
                ? prev.filter((z) => z !== zone)
                : [...prev, zone]
        )
    }

    const handleSaveCoverage = useCallback(async () => {
        if (!userRol.rol) {
            setAlert({ open: true, message: 'Error: Rol no identificado.', severity: 'error' })
            return
        }

        try {
            await updateUser({
                userId: userAuthID,
                role: userRol.rol,
                data: {
                    userZonasCobertura: coverageZones,
                    coberturaTodaLaCiudad: coverageCityWide,
                    isAvailableNow,
                } as any,
            })
            setAlert({ open: true, message: '¡Zonas de cobertura actualizadas!', severity: 'success' })
        } catch (error) {
            console.error('Error updating coverage zones:', error)
            setAlert({ open: true, message: 'Error al actualizar cobertura.', severity: 'error' })
        }
    }, [userAuthID, userRol.rol, coverageZones, coverageCityWide, isAvailableNow])

    const isComerciante = userRol.rol === 2

    return (
        <div className={styles['settings-page']}>
            <h1 className={`type-hero-title ${styles['settings-title']}`}>Ajustes</h1>

            {alert.open && (
                <SnackBarAlert
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, open: false })}
                    severity={alert.severity}
                    open={alert.open}
                />
            )}

            <div className={styles['card-grid']}>
                {/* ===================== Card 1: Contact Info ===================== */}
                <div className={styles['settings-card']}>
                    <div className={styles['card-header']}>
                        <h2 className={styles['card-title']}>Datos de Contacto</h2>
                        <Button
                            className="btn btn-primary"
                            size="small"
                            onClick={handleSaveContacts}
                        >
                            Guardar
                        </Button>
                    </div>

                    {/* Read-only info */}
                    <div className={styles['info-pills']}>
                        <div className={styles['info-pill']}>
                            <span className={styles['info-pill__label']}>Activo desde</span>
                            <span className={styles['info-pill__value']}>{userEditInfo.userJoined || '—'}</span>
                        </div>
                    </div>

                    {/* Editable fields */}
                    <div className={styles['field-group']}>
                        <TextField
                            id="userName"
                            name="userName"
                            label={isComerciante ? 'Nombre de usuario / Nombre Comercial' : 'Nombre de usuario'}
                            value={userEditInfo.userName}
                            onChange={(e) => {
                                handleChange(e as any)
                                if (nameCheck.status !== 'idle') nameCheck.reset()
                            }}
                            onBlur={(e) => {
                                if (isComerciante) {
                                    nameCheck.handleBlur(e.target.value)
                                }
                            }}
                            size="small"
                            fullWidth
                        />

                        {isComerciante && (
                            <DuplicateNameAlert
                                status={nameCheck.status}
                                isChecking={nameCheck.isChecking}
                                matches={nameCheck.matches}
                                exactMatch={nameCheck.exactMatch}
                                type="comerciante"
                                checkedValue={nameCheck.checkedValue}
                            />
                        )}

                        {isComerciante && (
                            <>
                                <TextField
                                    id="userProfession"
                                    name="userProfession"
                                    label="Profesión / Slogan"
                                    placeholder="Ej: Automatización de espacios o Ingeniero Electrónico"
                                    value={userEditInfo.userProfession}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                />
                            </>
                        )}

                        {/* ── Identification Document ── */}
                        <div className={styles['field-row']} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel id="id-type-select-label">Tipo Doc.</InputLabel>
                                <Select
                                    labelId="id-type-select-label"
                                    id="userIdentificationType"
                                    name="userIdentificationType"
                                    label="Tipo Doc."
                                    value={userEditInfo.userIdentificationType || 'CC'}
                                    onChange={(e) =>
                                        setUserEditInfo((prev) => ({
                                            ...prev,
                                            userIdentificationType: e.target.value,
                                        }))
                                    }
                                >
                                    <MenuItem value="CC">C.C.</MenuItem>
                                    <MenuItem value="NIT">NIT</MenuItem>
                                    <MenuItem value="CE">C.E.</MenuItem>
                                    <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                                    <MenuItem value="Otro">Otro</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                id="userIdentification"
                                name="userIdentification"
                                label="Número de Identificación"
                                placeholder="Ej: 1020304050 o 900123456-1"
                                value={userEditInfo.userIdentification}
                                onChange={handleChange}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                        </div>

                        {/* ── Website (ocupa renglón completo) ── */}
                        <TextField
                            id="userWebSite"
                            name="userWebSite"
                            label="Sitio web"
                            placeholder="https://..."
                            value={userEditInfo.userWebSite}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                        />

                        {isComerciante && (
                            <>
                                <TextField
                                    id="userRazonSocial"
                                    name="userRazonSocial"
                                    label="Razón Social"
                                    placeholder="Ej: Prime Domotics S.A.S. o Constructora Dezzpo"
                                    value={userEditInfo.userRazonSocial}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                />
                                <div className={styles['field-row']}>
                                    <TextField
                                        id="userContactName"
                                        name="userContactName"
                                        label="Nombre de contacto / Representante"
                                        placeholder="Ej: Juan Perez"
                                        value={userEditInfo.userContactName}
                                        onChange={handleChange}
                                        size="small"
                                        sx={{ flex: 1 }}
                                    />
                                    <TextField
                                        id="userExperience"
                                        name="userExperience"
                                        label="Experiencia"
                                        placeholder="Ej: 15 años"
                                        value={userEditInfo.userExperience}
                                        onChange={handleChange}
                                        size="small"
                                        sx={{ flex: 1 }}
                                    />
                                </div>
                            </>
                        )}

                        {/* ── Phones dynamic list ── */}
                        <span className={styles['contact-section-label']}>Teléfonos</span>
                        <div className={styles['contact-list']}>
                            {phones.map((phone, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles['contact-row']} ${phone.isPrimary ? styles['contact-row--primary'] : ''}`}
                                >
                                    <TextField
                                        className={styles['contact-row__input'] || ''}
                                        value={phone.number}
                                        onChange={(e) => handlePhoneChange(idx, 'number', e.target.value)}
                                        placeholder="+57 300 000 0000"
                                        size="small"
                                        type="tel"
                                    />
                                    <FormControl size="small" className={styles['contact-row__type'] || ''}>
                                        <Select
                                            value={phone.type}
                                            onChange={(e) => handlePhoneChange(idx, 'type', e.target.value)}
                                        >
                                            <MenuItem value="personal">Personal</MenuItem>
                                            <MenuItem value="trabajo">Trabajo</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Tooltip title={phone.isPrimary ? 'Teléfono principal' : 'Establecer como principal'}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleSetPrimaryPhone(idx)}
                                            className={phone.isPrimary ? (styles['primary-indicator'] || '') : (styles['primary-indicator--inactive'] || '')}
                                        >
                                            {phone.isPrimary ? <StarIcon /> : <StarBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={phone.isPrimary ? 'No puedes eliminar el principal' : 'Eliminar'}>
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemovePhone(idx)}
                                                disabled={phone.isPrimary}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </div>
                            ))}
                            <Button
                                variant="outlined"
                                size="small"
                                className={styles['contact-add-btn'] || ''}
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleAddPhone}
                            >
                                Agregar teléfono
                            </Button>
                        </div>

                        {/* ── Emails dynamic list ── */}
                        <span className={styles['contact-section-label']}>Correos electrónicos</span>
                        <div className={styles['contact-list']}>
                            {emails.map((email, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles['contact-row']} ${email.isPrimary ? styles['contact-row--primary'] : ''}`}
                                >
                                    <TextField
                                        className={styles['contact-row__input'] || ''}
                                        value={email.address}
                                        onChange={(e) => handleEmailChange(idx, e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        size="small"
                                        type="email"
                                    />
                                    <Tooltip title={email.isPrimary ? 'Correo principal' : 'Establecer como principal'}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleSetPrimaryEmail(idx)}
                                            className={email.isPrimary ? (styles['primary-indicator'] || '') : (styles['primary-indicator--inactive'] || '')}
                                        >
                                            {email.isPrimary ? <StarIcon /> : <StarBorderIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={email.isPrimary ? 'No puedes eliminar el principal' : 'Eliminar'}>
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveEmail(idx)}
                                                disabled={email.isPrimary}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </div>
                            ))}
                            <Button
                                variant="outlined"
                                size="small"
                                className={styles['contact-add-btn'] || ''}
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={handleAddEmail}
                            >
                                Agregar correo
                            </Button>
                        </div>

                    </div>
                </div>

                {/* ===================== Card 2: Presentación / Servicios ===================== */}
                <div className={styles['settings-card']}>
                    <div className={styles['card-header']}>
                        <h2 className={styles['card-title']}>
                            {isComerciante ? 'Servicios Ofrecidos' : 'Presentación'}
                        </h2>
                        <Button
                            className="btn btn-primary"
                            size="small"
                            onClick={() => handleSaveSection(['userDescription', 'userCategories'])}
                        >
                            Guardar
                        </Button>
                    </div>

                    <div className={styles['field-group']}>
                        <TextareaAutosize
                            value={userEditInfo.userDescription}
                            onChange={handleChange}
                            name="userDescription"
                            id="ofertaServicios"
                            placeholder={
                                isComerciante
                                    ? 'Registra los servicios que ofreces (máx. 400 caracteres).'
                                    : 'Registra tu presentación (máx. 400 caracteres).'
                            }
                            minRows={4}
                            className={styles['description-textarea']}
                        />

                        {isComerciante && (
                            <div>
                                <p className="type-body" style={{ marginBottom: '0.5rem' }}>
                                    Selecciona hasta cuatro categorías para mostrar en tu perfil
                                </p>
                                <ChipsCategories
                                    setUserEditInfo={setUserEditInfo}
                                    userEditInfo={userEditInfo}
                                    listadoCategorias={ListadoCategorias as any[]}
                                    saved={true}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* ===================== Card 3: Ubicación (full-width) ===================== */}
                <div className={`${styles['settings-card']} ${styles['settings-card--full']}`}>
                    <div className={styles['card-header']}>
                        <h2 className={styles['card-title']}>Ubicación</h2>
                        <Button
                            className="btn btn-primary"
                            size="small"
                            onClick={() => handleSaveSection([
                                'userDirection', 'userDirectionDetails', 'userCiudad', 'userCodigoPostal',
                            ])}
                        >
                            Guardar
                        </Button>
                    </div>

                    <div className={styles['info-pills']}>
                        <div className={styles['info-pill']}>
                            <span className={styles['info-pill__label']}>Dirección</span>
                            <span className={styles['info-pill__value']}>
                                {userEditInfo.userDirection || '—'}
                            </span>
                        </div>
                        <div className={styles['info-pill']}>
                            <span className={styles['info-pill__label']}>Detalles</span>
                            <span className={styles['info-pill__value']}>
                                {userEditInfo.userDirectionDetails || '—'}
                            </span>
                        </div>
                        <div className={styles['info-pill']}>
                            <span className={styles['info-pill__label']}>Ciudad</span>
                            <span className={styles['info-pill__value']}>
                                {userEditInfo.userCiudad || '—'}
                            </span>
                        </div>
                        <div className={styles['info-pill']}>
                            <span className={styles['info-pill__label']}>Código postal</span>
                            <span className={styles['info-pill__value']}>
                                {userEditInfo.userCodigoPostal || '—'}
                            </span>
                        </div>
                    </div>

                    <div className={styles['location-row']} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <TextField
                            id="userDirection"
                            name="userDirection"
                            label="Dirección exacta"
                            value={userEditInfo.userDirection}
                            onChange={handleChange}
                            size="small"
                            sx={{ flex: 2, minWidth: 220 }}
                        />
                        <TextField
                            id="userCiudad"
                            name="userCiudad"
                            label="Ciudad"
                            value={userEditInfo.userCiudad}
                            onChange={handleChange}
                            size="small"
                            sx={{ flex: 1, minWidth: 160 }}
                        />
                        <TextField
                            id="userCodigoPostal"
                            name="userCodigoPostal"
                            label="Código Postal"
                            value={userEditInfo.userCodigoPostal}
                            onChange={handleChange}
                            size="small"
                            sx={{ width: 140 }}
                        />
                        <Button
                            className="btn-round btn-low"
                            size="small"
                            onClick={() => setLocationModalOpen(true)}
                            sx={{ whiteSpace: 'nowrap' }}
                        >
                            Registrar en mapa
                        </Button>
                    </div>

                    <TextField
                        id="userDirectionDetails"
                        name="userDirectionDetails"
                        label="Detalles de ubicación física (Opcional)"
                        placeholder="Ej: Oficina 402, Piso 4, Local esquinero, Edificio Prime, Torre 2"
                        value={userEditInfo.userDirectionDetails || ''}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        helperText="Indica referencias adicionales como piso, oficina, local o puntos de referencia para facilitar la llegada"
                    />

                    <Modal
                        open={locationModalOpen}
                        onClose={() => setLocationModalOpen(false)}
                    >
                        <Ubicacion
                            setLocInfo={setUserEditInfo as any}
                            locInfo={userEditInfo}
                            setOpen={setLocationModalOpen}
                        />
                    </Modal>
                </div>

                {/* ===================== Card 4: Zonas de Cobertura (Comerciante only) ===================== */}
                {isComerciante && (
                    <div className={`${styles['settings-card']} ${styles['settings-card--full']} ${styles['coverage-card']}`}>
                        <div className={styles['card-header']}>
                            <h2 className={styles['card-title']}>Zonas de Cobertura</h2>
                            <Button
                                className="btn btn-primary"
                                size="small"
                                onClick={handleSaveCoverage}
                            >
                                Guardar
                            </Button>
                        </div>
                        <p className="type-body" style={{ marginBottom: '0.5rem' }}>
                            Selecciona las zonas donde prestas servicio. Aparecerás en los resultados de búsqueda de cada zona seleccionada.
                        </p>

                        <div className={styles['coverage-toggle-row']} style={{ marginBottom: '1rem' }}>
                            <FlashOnIcon sx={{ color: 'var(--background-main-green-color, #4caf50)' }} />
                            <span className={styles['coverage-toggle-label']}>
                                ¡Disponible ahora mismo! (Urgencias)
                            </span>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isAvailableNow}
                                        onChange={(e) => setIsAvailableNow(e.target.checked)}
                                        color="success"
                                    />
                                }
                                label=""
                            />
                        </div>

                        <div className={styles['coverage-toggle-row']}>
                            <PublicIcon sx={{ color: 'var(--background-main-green-color, #4caf50)' }} />
                            <span className={styles['coverage-toggle-label']}>
                                Toda la ciudad y área metropolitana
                            </span>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={coverageCityWide}
                                        onChange={(e) => setCoverageCityWide(e.target.checked)}
                                        color="success"
                                    />
                                }
                                label=""
                            />
                        </div>

                        {!coverageCityWide && (
                            <>
                                <div className={styles['coverage-chip-grid']}>
                                    {zones.map((zone) => (
                                        <Chip
                                            key={zone}
                                            label={zoneNames[zone]}
                                            onClick={() => handleToggleZone(zone)}
                                            color={coverageZones.includes(zone) ? 'success' : 'default'}
                                            variant={coverageZones.includes(zone) ? 'filled' : 'outlined'}
                                            size="small"
                                        />
                                    ))}
                                </div>
                                <span className={styles['coverage-count']}>
                                    {coverageZones.length} zona{coverageZones.length !== 1 ? 's' : ''} seleccionada{coverageZones.length !== 1 ? 's' : ''}
                                </span>
                            </>
                        )}
                    </div>
                )}

                {/* ===================== Card 5: Identidad ===================== */}
                <div className={styles['settings-card']}>
                    <div className={styles['card-header']}>
                        <h2 className={styles['card-title']}>Confirma tu Identidad</h2>
                        {idVerificationStatus === 'verified' && (
                            <Chip icon={<CheckCircleIcon />} label="Verificado" color="success" size="small" />
                        )}
                        {idVerificationStatus === 'pending' && (
                            <Chip icon={<HourglassBottomIcon />} label="En revisión" color="warning" size="small" />
                        )}
                        {idVerificationStatus === 'rejected' && (
                            <Chip icon={<ErrorIcon />} label="Rechazado" color="error" size="small" />
                        )}
                    </div>
                    <p className="type-body" style={{ marginBottom: '1rem' }}>
                        Adjunta tu documento de identificación para verificar tu cuenta
                        y acceder a funcionalidades avanzadas.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="id-doc-type-label">Tipo de documento</InputLabel>
                            <Select
                                labelId="id-doc-type-label"
                                value={idDocType}
                                label="Tipo de documento"
                                onChange={(e) => setIdDocType(e.target.value)}
                                disabled={idVerificationStatus === 'verified'}
                            >
                                <MenuItem value="cedula">Cédula de Ciudadanía</MenuItem>
                                <MenuItem value="pasaporte">Pasaporte</MenuItem>
                                <MenuItem value="cedula_extranjeria">Cédula de Extranjería</MenuItem>
                                <MenuItem value="nit">NIT</MenuItem>
                            </Select>
                        </FormControl>

                        {idDocUrl && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                                <img
                                    src={idDocUrl}
                                    alt="Documento"
                                    style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <p className="type-body" style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Documento cargado</p>
                                    <p className="type-body" style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{idDocType === 'cedula' ? 'Cédula de Ciudadanía' : idDocType === 'pasaporte' ? 'Pasaporte' : idDocType === 'cedula_extranjeria' ? 'Cédula de Extranjería' : 'NIT'}</p>
                                </div>
                            </div>
                        )}

                        {isUploading && (
                            <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 2 }} />
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <Button
                                component="label"
                                className="btn-round btn-low"
                                size="small"
                                startIcon={<UploadFileIcon />}
                                disabled={isUploading || idVerificationStatus === 'verified'}
                            >
                                {idDocUrl ? 'Reemplazar documento' : 'Subir documento'}
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    hidden
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file || !storage || !userAuthID) return

                                        setIsUploading(true)
                                        setUploadProgress(0)

                                        const ext = file.name.split('.').pop()
                                        const storageRef = ref(storage, `identity-docs/${userAuthID}/${idDocType}.${ext}`)
                                        const uploadTask = uploadBytesResumable(storageRef, file)

                                        uploadTask.on(
                                            'state_changed',
                                            (snapshot) => {
                                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                                setUploadProgress(progress)
                                            },
                                            (error) => {
                                                console.error('Upload error:', error)
                                                setAlert({ open: true, message: 'Error al subir el documento', severity: 'error' })
                                                setIsUploading(false)
                                            },
                                            async () => {
                                                const url = await getDownloadURL(uploadTask.snapshot.ref)
                                                setIdDocUrl(url)
                                                setIdVerificationStatus('pending')
                                                setIsUploading(false)

                                                // Save metadata to Firestore
                                                if (userRol.rol) {
                                                    await updateUser({
                                                        userId: userAuthID,
                                                        role: userRol.rol,
                                                        data: {
                                                            identityVerification: {
                                                                docType: idDocType,
                                                                docUrl: url,
                                                                status: 'pending',
                                                                submittedAt: new Date().toISOString(),
                                                            },
                                                        } as any,
                                                    })
                                                }

                                                setAlert({ open: true, message: '¡Documento cargado! En revisión.', severity: 'success' })
                                            },
                                        )
                                    }}
                                />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ===================== Card 5: Redes Sociales ===================== */}
                <div className={`${styles['settings-card']} ${styles['settings-card--full']} ${styles['social-card']}`}>
                    <div className={styles['card-header']}>
                        <h2 className={styles['card-title']}>Redes Sociales</h2>
                        <Button
                            className="btn btn-primary"
                            size="small"
                            onClick={handleSaveSocial}
                        >
                            Guardar
                        </Button>
                    </div>
                    <p className="type-body" style={{ marginBottom: '1rem' }}>
                        Agrega tus redes sociales y canales de comunicación. Los visitantes solo verán las que estén visibles.
                    </p>

                    <div className={styles['contact-list']}>
                        {socialLinks.map((link) => (
                            <div key={link.id}>
                                <div className={styles['social-row']}>
                                    <FormControl size="small" className={styles['social-row__platform'] || ''}>
                                        <Select
                                            value={link.platform}
                                            onChange={(e) => handleSocialChange(link.id, 'platform', e.target.value)}
                                        >
                                            {PLATFORM_LIST.map((p) => (
                                                <MenuItem key={p} value={p}>{PLATFORM_CONFIG[p].name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        className={styles['social-row__url'] || ''}
                                        value={link.url}
                                        onChange={(e) => handleSocialChange(link.id, 'url', e.target.value)}
                                        placeholder={PLATFORM_CONFIG[link.platform].placeholder}
                                        size="small"
                                        error={socialUrlErrors[link.id] ?? false}
                                    />
                                    <TextField
                                        className={styles['social-row__label'] || ''}
                                        value={link.label || ''}
                                        onChange={(e) => handleSocialChange(link.id, 'label', e.target.value)}
                                        placeholder="Etiqueta"
                                        size="small"
                                    />
                                    <Tooltip title={link.isVisible ? 'Visible en perfil' : 'Oculto en perfil'}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleSocialChange(link.id, 'isVisible', !link.isVisible)}
                                            className={
                                                link.isVisible
                                                    ? (styles['social-visibility-toggle'] || '')
                                                    : (styles['social-visibility-toggle--hidden'] || '')
                                            }
                                        >
                                            {link.isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveSocial(link.id)}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                {socialUrlErrors[link.id] && (
                                    <span className={styles['social-url-error'] || ''}>
                                        URL no válida para {PLATFORM_CONFIG[link.platform].name}
                                    </span>
                                )}
                            </div>
                        ))}
                        <Button
                            variant="contained"
                            size="small"
                            className={styles['social-add-btn'] || ''}
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={handleAddSocial}
                        >
                            Agregar red social
                        </Button>
                    </div>
                </div>
            </div>

            {/* Propietario Only: Properties Manager */}
            {userRol.rol === 1 && (
                <PropertiesManager
                    userId={userAuthID}
                    initialProperties={properties}
                />
            )}

            {/* Mobile sticky save footer */}
            <div className={styles['mobile-save-footer']}>
                <Button
                    className="btn btn-primary"
                    fullWidth
                    onClick={() => handleSaveSection(Object.keys(userEditInfo))}
                >
                    Guardar todos los cambios
                </Button>
            </div>
        </div>
    )
}
