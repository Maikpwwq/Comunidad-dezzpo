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
import type { UserRole } from '@services/types'

// Components
import { Ubicacion } from '@features/marketing'
import { SnackBarAlert, ChipsCategories } from '@components/common'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// MUI
import {
    Button,
    TextField,
    TextareaAutosize,
    Modal,
} from '@mui/material'

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
    userCiudad: string
    userCodigoPostal: string
    userRazonSocial: string
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

    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'success',
    })

    const [locationModalOpen, setLocationModalOpen] = useState(false)

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
        userCiudad: '',
        userCodigoPostal: '',
        userRazonSocial: '',
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
                        userCiudad: userData.userCiudad || '',
                        userCodigoPostal: userData.userCodigoPostal || '',
                        userRazonSocial: userData.userRazonSocial || '',
                        userIdentification: (userData as any).userIdentification || '',
                        userDescription: (userData as any).userDescription || '',
                        userWebSite: (userData as any).userWebSite || '',
                    })
                    setIsLoaded(true)
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
                            onClick={() => handleSaveSection([
                                'userName', 'userPhone', 'userIdentification',
                                'userWebSite', 'userRazonSocial',
                                ...(isComerciante ? ['userProfession', 'userExperience'] : []),
                            ])}
                        >
                            Guardar
                        </Button>
                    </div>

                    {/* Read-only info */}
                    <div className={styles['info-pills']}>
                        <div className={styles['info-pill']}>
                            <span className={styles['info-pill__label']}>Correo</span>
                            <span className={styles['info-pill__value']}>{userEditInfo.userMail || '—'}</span>
                        </div>
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
                            label="Nombre de usuario"
                            value={userEditInfo.userName}
                            onChange={handleChange}
                            size="small"
                            fullWidth
                        />
                        <div className={styles['field-row']}>
                            <TextField
                                id="userPhone"
                                name="userPhone"
                                label="Celular"
                                value={userEditInfo.userPhone}
                                onChange={handleChange}
                                size="small"
                            />
                            <TextField
                                id="userIdentification"
                                name="userIdentification"
                                label="Identificación"
                                value={userEditInfo.userIdentification}
                                onChange={handleChange}
                                size="small"
                            />
                        </div>
                        <TextField
                            id="userWebSite"
                            name="userWebSite"
                            label="Sitio web"
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
                                    value={userEditInfo.userRazonSocial}
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                />
                                <div className={styles['field-row']}>
                                    <TextField
                                        id="userProfession"
                                        name="userProfession"
                                        label="Profesión"
                                        value={userEditInfo.userProfession}
                                        onChange={handleChange}
                                        size="small"
                                    />
                                    <TextField
                                        id="userExperience"
                                        name="userExperience"
                                        label="Experiencia"
                                        value={userEditInfo.userExperience}
                                        onChange={handleChange}
                                        size="small"
                                    />
                                </div>
                            </>
                        )}
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
                                'userDirection', 'userCiudad', 'userCodigoPostal',
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

                    <div className={styles['location-row']}>
                        <TextField
                            id="userDirection"
                            name="userDirection"
                            label="Dirección"
                            value={userEditInfo.userDirection}
                            onChange={handleChange}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            id="userCiudad"
                            name="userCiudad"
                            label="Ciudad"
                            value={userEditInfo.userCiudad}
                            onChange={handleChange}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            id="userCodigoPostal"
                            name="userCodigoPostal"
                            label="Código Postal"
                            value={userEditInfo.userCodigoPostal}
                            onChange={handleChange}
                            size="small"
                            sx={{ width: 150 }}
                        />
                        <Button
                            className="btn-round btn-low"
                            size="small"
                            onClick={() => setLocationModalOpen(true)}
                        >
                            Registrar en mapa
                        </Button>
                    </div>

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

                {/* ===================== Card 4: Identidad ===================== */}
                <div className={styles['settings-card']}>
                    <div className={styles['card-header']}>
                        <h2 className={styles['card-title']}>Confirma tu Identidad</h2>
                    </div>
                    <p className="type-body">
                        Adjunta tu documento de identificación para verificar tu cuenta
                        y acceder a funcionalidades avanzadas.
                    </p>
                    <Button className="btn-round btn-low" size="small" disabled>
                        Próximamente
                    </Button>
                </div>
            </div>

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
