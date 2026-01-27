import { useState, useEffect } from 'react'
import { usePageContext } from '@hooks/usePageContext'
import { useAuth } from '@hooks/useAuth'

// Services
import { getUser, updateUser } from '@services/users'
import type { UserRole } from '@services/types'

// Components
import Ubicacion from '@index/components/ubicacion/Ubicacion'
import SnackBarAlert from '@index/components/SnackBarAlert'
import ChipsCategories from '@app/components/ChipsCategories'
import { ListadoCategorias } from '@index/components/ListadoCategorias'

// Styles
import '@assets/cssPrivateApp/ajustes.css'

// UI Libs
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormGroup from '@mui/material/FormGroup'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

export const documentProps = {
    title: 'Ajustes | Comunidad Dezzpo',
    description: 'Configura tu cuenta en Comunidad Dezzpo.',
}

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
    severity: 'success' | 'error' | 'warning' | 'info' | 'default'
}

export default function Page() {
    const { currentUser } = useAuth()
    const pageContext = usePageContext()

    // Safety check for routeParams
    const id = pageContext.routeParams?.id as string | undefined

    const userAuthID = currentUser?.userId || id || ''

    const [isLoaded, setIsLoaded] = useState(false)
    const [saved, setSaved] = useState(true)

    const [userRol, setUserRol] = useState<{ rol: UserRole | undefined }>({
        rol: currentUser?.rol as UserRole | undefined,
    })

    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        severity: 'success',
    })

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

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

    /*
    const determineDistanceTime = (metadata: any) => {
        const creationTime = metadata.creationTime
        const formatedTime = parse(creationTime, 'dd-MM-yyyy', new Date())
        
        const distanceTime = formatDistance(
            formatedTime,
            new Date(),
            { addSuffix: true, locale: es }
        )
        return distanceTime
    }
    */

    const fetchUserData = async () => {
        if (!userAuthID) return;

        try {
            let roleToUse: UserRole | undefined = userRol.rol;

            if (!roleToUse) {
                const localRole = localStorage.getItem('role')
                if (localRole) {
                    const parsed = parseInt(JSON.parse(localRole))
                    if (!isNaN(parsed)) roleToUse = parsed as UserRole
                }
            }

            if (!roleToUse) return;

            const userData = await getUser({
                userId: userAuthID,
                role: roleToUse
            });

            if (userData) {
                const {
                    userName,
                    userMail,
                    userPhone,
                    userPhotoUrl,
                    userGalleryUrl,
                    userCreatedDrafts,
                    userId,
                    userJoined,
                    userProfession,
                    userExperience,
                    userChannelUrl,
                    userCategories,
                    userDirection,
                    userCiudad,
                    userCodigoPostal,
                    userRazonSocial,
                    userIdentification,
                    userDescription,
                    userWebSite,
                } = userData;

                setUserEditInfo({
                    ...userEditInfo,
                    userName: userName || '',
                    userMail: userMail || '',
                    userPhone: userPhone || '',
                    userPhotoUrl: userPhotoUrl || '',
                    userGalleryUrl: userGalleryUrl || [],
                    userCreatedDrafts: userCreatedDrafts || [],
                    userId: userId || userAuthID,
                    userJoined: userJoined || '',
                    userProfession: userProfession || '',
                    userExperience: userExperience || '',
                    userChannelUrl: userChannelUrl || '',
                    userCategories: userCategories || [],
                    userDirection: userDirection || '',
                    userCiudad: userCiudad || '',
                    userCodigoPostal: userCodigoPostal || '',
                    userRazonSocial: userRazonSocial || '',
                    userIdentification: userIdentification || '',
                    userDescription: userDescription || '',
                    userWebSite: userWebSite || '',
                });

                setIsLoaded(true);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        // Initialize role from local storage if not present
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
            fetchUserData();
        }
    }, [isLoaded, userAuthID, userRol.rol])

    const handleAlert = (message: string, severity: AlertState['severity']) => {
        setAlert({ ...alert, open: true, message: message, severity: severity })
    }

    const handleCloseAlert = (_event: any, reason?: string) => {
        if (reason === 'clickaway') {
            return
        } else {
            setAlert({ ...alert, open: false, message: '' })
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // console.log(event)
        setUserEditInfo({
            ...userEditInfo,
            [event.target.name]: event.target.value,
        })
    }

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (!userRol.rol) {
            handleAlert('Error: Role not identified.', 'error');
            return;
        }

        try {
            await updateUser({
                userId: userAuthID,
                role: userRol.rol,
                data: userEditInfo
            });

            handleAlert('Se actualizó correctamente su información!', 'success')
            setSaved(true)

        } catch (error) {
            console.error('Error updating user:', error)
            handleAlert(
                'No se actualizó correctamente su información, intente de nuevo!',
                'error'
            )
        }
    }

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start pb-4 pt-4">
                    <Typography
                        variant="h6"
                        className="p-description pb-4 pt-4 w-100"
                    >
                        Datos de contacto
                    </Typography>
                    <Col className="col-10 cardFrame">
                        {alert.open && (
                            <SnackBarAlert
                                message={alert.message}
                                onClose={handleCloseAlert}
                                severity={alert.severity}
                                open={alert.open}
                            />
                        )}
                        <Row className="p-0 pt-4">
                            <FormGroup
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                className="pt-4"
                            >
                                <Row className="m-0 w-100 d-flex flex-row pb-4 pt-4">
                                    <Col
                                        className="mb-4"
                                        style={{ width: '33%' }}
                                        xs={12} sm={12} md={6} lg={4}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Correo de usuario
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                        >
                                            {userEditInfo.userMail}
                                        </Typography>
                                    </Col>
                                    <Col
                                        className="mb-4"
                                        style={{ width: '33%' }}
                                        xs={12} sm={12} md={6} lg={4}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Activo desde
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                        >
                                            {userEditInfo.userJoined}
                                        </Typography>
                                    </Col>
                                    <Col
                                        className="mb-4"
                                        style={{ width: '33%' }}
                                        xs={12} sm={12} md={6} lg={4}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Ubicación
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                        >
                                            {userEditInfo.userDirection}
                                        </Typography>
                                    </Col>
                                    <Col
                                        className="mb-4"
                                        style={{ width: '33%' }}
                                        xs={12} sm={12} md={6} lg={4}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            className="w-auto"
                                        >
                                            Ciudad
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="ps-3 pe-3 detail-pill w-auto"
                                        >
                                            {userEditInfo.userCiudad}
                                        </Typography>
                                    </Col>
                                </Row>
                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userName"
                                    name="userName"
                                    label="Nombre de usuario"
                                    value={userEditInfo.userName}
                                    onChange={handleChange}
                                    className="mb-4 me-4 fondoBlanco"
                                />
                                {userRol.rol === 2 ? (
                                    <>
                                        <TextField
                                            style={{ borderRadius: '30px' }}
                                            id="userProfession"
                                            name="userProfession"
                                            label="Profesión"
                                            value={userEditInfo.userProfession}
                                            onChange={handleChange}
                                            className="mb-4 me-4 fondoBlanco"
                                        />
                                        <TextField
                                            style={{ borderRadius: '30px' }}
                                            id="userExperience"
                                            name="userExperience"
                                            label="Experiencia"
                                            value={userEditInfo.userExperience}
                                            onChange={handleChange}
                                            className="mb-4 me-4 fondoBlanco"
                                        />
                                        <TextField
                                            style={{ borderRadius: '30px' }}
                                            id="userRazonSocial"
                                            name="userRazonSocial"
                                            label="Razón Social"
                                            value={userEditInfo.userRazonSocial}
                                            onChange={handleChange}
                                            className="mb-4 me-4 fondoBlanco"
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userWebSite"
                                    name="userWebSite"
                                    label="Sitio web"
                                    value={userEditInfo.userWebSite}
                                    onChange={handleChange}
                                    className="mb-4 me-4 fondoBlanco"
                                />

                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userPhone"
                                    label="Celular"
                                    name="userPhone"
                                    value={userEditInfo.userPhone}
                                    onChange={handleChange}
                                    className="mt-2 mb-4 me-4 fondoBlanco"
                                />

                                <TextField
                                    style={{ borderRadius: '30px' }}
                                    id="userIdentification"
                                    name="userIdentification"
                                    label="Identificación"
                                    value={userEditInfo.userIdentification}
                                    onChange={handleChange}
                                    className="mb-4 me-4 fondoBlanco"
                                />

                                <Row className="pb-4 w-100">
                                    <Col className="col-6">
                                        <Button
                                            className="body-2"
                                            onClick={handleOpen}
                                        >
                                            {'Registrar ubicación'}
                                        </Button>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Ubicacion
                                                setLocInfo={setUserEditInfo}
                                                locInfo={userEditInfo}
                                                setOpen={setOpen}
                                            />
                                        </Modal>
                                    </Col>
                                    <Col className="col-6">
                                        <Button
                                            type="submit"
                                            className="btn btn-primary"
                                            onClick={handleSave}
                                        >
                                            Guardar cambios
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Row>
                    </Col>
                    <Col className="col-10">
                        <Row className="">
                            <Typography
                                variant="h6"
                                className="p-description pb-4 pt-4 w-100"
                            >
                                {userRol.rol === 2
                                    ? 'Servicios ofrecidos'
                                    : 'Presentación'}
                            </Typography>
                            <TextareaAutosize
                                value={userEditInfo.userDescription}
                                onChange={handleChange}
                                name="userDescription"
                                id="ofertaServicios"
                                placeholder={
                                    userRol.rol === 2
                                        ? 'Registra los servicios que ofreces (max. 400 caracteres).'
                                        : 'Registra tu presentación (max. 400 caracteres).'
                                }
                                minRows={4}
                                className="w-100"
                                style={{ borderRadius: '30px' }}
                            />
                            {userRol.rol === 2 ? (
                                <Col className="pt-2">
                                    <p className="body-1 m-0">
                                        Selecciona hasta cuatro categorias para
                                        mostrar en tu perfil de usuario
                                    </p>
                                    <ChipsCategories
                                        setUserEditInfo={setUserEditInfo}
                                        userEditInfo={userEditInfo}
                                        listadoCategorias={ListadoCategorias}
                                        saved={saved}
                                    />
                                </Col>
                            ) : null}
                            <Row className="pb-2 pt-2 w-100">
                                <Col className="">
                                    <Button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={handleSave}
                                    >
                                        Guardar cambios
                                    </Button>
                                </Col>
                            </Row>
                        </Row>
                    </Col>
                    <Col className="col-10">
                        <Typography
                            variant="h6"
                            className="p-description pb-4 pt-4 w-100"
                        >
                            Confirma tu identidad
                        </Typography>

                        <Typography variant="body1" className="body-1">
                            Adjunta tu documento de identificación para...
                        </Typography>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
