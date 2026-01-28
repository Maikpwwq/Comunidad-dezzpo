import { useState, useContext, useEffect, useMemo } from 'react'
// import PropTypes from 'prop-types'
// import { sharingInformationService } from '@services/sharing-information'
// import { formatDistance, parse } from 'date-fns'
// import { es } from 'date-fns/locale'
import { getUser } from '@services/users'
import { auth } from '@services/firebase'
import { UserAuthContext } from '@providers/UserAuthProvider'
import { usePageContext } from '@hooks/usePageContext'

// Styles & Assets
// @ts-ignore
import ProfilePhoto from '@assets/img/Profile.png'
import clsx from 'clsx'
import styles from './Profile.module.scss'

// @ts-ignore
// @ts-ignore
import { Comentarios } from '@features/profile'
import { ChipsCategories, MapaPerfil, AdjuntarArchivos, CincoEstrellas } from '@components/common'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// UI Libs
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import MailIcon from '@mui/icons-material/Mail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import LinkIcon from '@mui/icons-material/Link'

// Types
import type { UserFirestoreDocument, UserRole } from '@services/types'



interface UserInfoState extends Partial<UserFirestoreDocument> {
    userCategoriesChips: any[]
    userVotes: {
        reviews: any[]
        mean: number
        votes: number
    }
    userLikes: {
        likedsProfiles: any[]
        likedsDrafts: any[]
    }
    // Explicitly add fields that might be missing or optional in the base type but used here
    userCreatedDrafts: any[]
    userGalleryUrl: string[]
}

export default function Page() {
    const { currentUser } = useContext(UserAuthContext)
    const pageContext = usePageContext()

    // Safety check for auth
    const userAuth = useMemo(() => auth?.currentUser, [])
    const userAuthID = currentUser?.userId
    const userAuthName = currentUser?.displayName

    const [isLoaded, setIsLoaded] = useState(false)

    // Route params can be empty if matching /app/perfil
    const id = pageContext.routeParams?.id

    const [userRol] = useState<{ rol: UserRole | null }>({
        rol: currentUser?.rol as UserRole || null,
    })

    // Logic to determine which profile to show
    const userId = id
    const consult = (userId && userId !== userAuthID) ? true : false
    const userConsultId = consult ? userId : userAuthID

    const [userInfo, setUserInfo] = useState<UserInfoState>({
        userName: '',
        userMail: '',
        userPhone: '',
        userChannelUrl: '',
        userPhotoUrl: ProfilePhoto,
        userGalleryUrl: [],
        userCreatedDrafts: [],
        userId: '',
        userJoined: '',
        userProfession: '',
        userExperience: '',
        userCategories: [],
        userCategoriesChips: [],
        userDirection: '',
        userCiudad: '',
        userCodigoPostal: '',
        userRazonSocial: '',
        userIdentification: '',
        userDescription: '',
        userVotes: {
            reviews: [],
            mean: 0,
            votes: 0,
        },
        userLikes: {
            likedsProfiles: [],
            likedsDrafts: [],
        },
        userWebSite: '',
    })

    /*
    const determineDistanceTime = (metadata: any) => {
        if (!metadata || !metadata.creationTime) return ''
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

    useEffect(() => {
        /*
        const LoadAuthData = (userAuth: any) => {
            const {
                uid,
                email,
                displayName,
                phoneNumber,
                photoURL,
            } = userAuth

            setUserInfo(prev => ({
                ...prev,
                userPhone: phoneNumber || prev.userPhone,
                userPhotoUrl: photoURL || prev.userPhotoUrl,
                userId: uid || prev.userId,
                userMail: email || prev.userMail,
                userName: displayName || prev.userName,
            }))
        }
        */

        const LoadCurrentData = (userData: UserFirestoreDocument) => {
            const {
                userJoined,
                userCategories,
                userChannelUrl,
                userPhone,
                userPhotoUrl,
                userId,
                userMail,
                userName,
                userGalleryUrl,
                userProfession,
                userExperience,
                // userGrade,
                userDirection,
                userCiudad,
                userCodigoPostal,
                userRazonSocial,
                userIdentification,
                userDescription,
                userWebSite,
            } = userData

            let chipsInfo: any[] = []
            if (userCategories && Array.isArray(userCategories)) {
                // Map categories to chips
                chipsInfo = userCategories.map(chip => {
                    const found = ListadoCategorias.find((cat: any) => cat.label === chip)
                    return found || null
                }).filter(item => item !== null)
            }

            setUserInfo(prev => ({
                ...prev,
                userChannelUrl: userChannelUrl || '',
                userPhone: userPhone || '',
                userPhotoUrl: userPhotoUrl || ProfilePhoto,
                userId: userId || '',
                userMail: userMail || '',
                userName: userName || '',
                userGalleryUrl: userGalleryUrl || [],
                userJoined: userJoined || '',
                userProfession: userProfession || '',
                userExperience: userExperience || '',
                userCategoriesChips: chipsInfo,
                // userGrade: userGrade,
                userDirection: userDirection || '',
                userCiudad: userCiudad || '',
                userCodigoPostal: userCodigoPostal || '',
                userRazonSocial: userRazonSocial || '',
                userIdentification: userIdentification || '',
                userDescription: userDescription || '',
                userWebSite: userWebSite || '',
            }))
        }

        const fetchUserProfile = async () => {
            if (userConsultId && userRol.rol) {
                try {
                    // Using the new getUser service
                    const user = await getUser({ userId: userConsultId, role: userRol.rol })
                    if (user) {
                        LoadCurrentData(user)
                        setIsLoaded(true)
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error)
                }
            }
        }

        if (!isLoaded && userConsultId) {
            fetchUserProfile()
        }
    }, [isLoaded, userConsultId, userRol.rol, userAuth])

    const copyUserWebSiteLink = () => {
        if (userInfo?.userWebSite) {
            navigator.clipboard.writeText(userInfo.userWebSite)
        }
    }

    return (
        <Container fluid className={clsx(styles.Container, "p-0")}>
            <Col className={clsx(styles.GreenBackground, "col-12 w-100")}>
                <Row
                    className={clsx(styles.HeaderRow)}
                // sx={{ flexDirection: { sm: 'col' } }} // React-bootstrap Row doesn't support sx like MUI
                >
                    <div
                        className={clsx(styles.ProfileImageContainer)}
                    >
                        <img
                            src={userInfo.userPhotoUrl || ''}
                            alt="imagen de perfil"
                            className={styles.ProfileImage}
                        />

                        {!consult && (
                            <AdjuntarArchivos
                                name={'profilePhoto'}
                                multiple={false}
                                idPerson={userConsultId || ''}
                                rol={userRol.rol}
                                route={`profiles/${userConsultId}`}
                                functionState={setUserInfo}
                                state={userInfo}
                            />
                        )}
                    </div>
                </Row>
            </Col>
            <Col className="col mx-auto pt-4" md={10} sm={12}>
                <Box
                    className={clsx(styles.UserInfoBox)}
                >
                    <Typography
                        variant="h3"
                        id="userRazonSocial"
                        sx={{ maxWidth: '480px' }}
                        className={clsx(styles.BusinessName)}
                    >
                        {userInfo?.userRazonSocial}{' '}
                        {!!userInfo?.userWebSite && (
                            <Tooltip title="Copiar sitio web">
                                <LinkIcon
                                    onClick={copyUserWebSiteLink}
                                    fontSize="large"
                                    className={clsx(styles.LinkIcon)}
                                />
                            </Tooltip>
                        )}
                    </Typography>
                    <Typography
                        variant="h5"
                        id="userProfession"
                        className={clsx(styles.Profession)}
                    >
                        {userInfo.userProfession}
                    </Typography>
                    <Typography
                        variant="body2" // corrected 'body-2' to 'body2'
                        id="userExperience"
                        className={clsx(styles.Experience)}
                    >
                        Experiencia: {userInfo.userExperience}
                    </Typography>
                    <CincoEstrellas />
                    <span className={clsx(styles.Experience, "fs-6")}>
                        {userInfo.userVotes.votes} Personas votaron
                    </span>
                </Box>

                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col md={10} className="col-10 pt-4 pb-4">
                        <Typography
                            variant="h5"
                            className={clsx(styles.SectionTitle)}
                            align="left"
                        >
                            Datos de contacto
                        </Typography>
                        <Box
                            className={clsx(styles.ContactCard)}
                        >
                            <Typography
                                variant="body2"
                                className={clsx(styles.InfoPill)}
                            // name="userMail" // Typography doesn't support name prop usually
                            >
                                <MailIcon fontSize="large" />{' '}
                                {userInfo.userMail}
                            </Typography>

                            <Typography
                                variant="body2"
                                className={clsx(styles.InfoPill)}
                            // name="userPhone"
                            >
                                <PhoneIphoneIcon fontSize="large" />{' '}
                                {userInfo.userPhone}
                            </Typography>
                        </Box>
                    </Col>
                </Row>

                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col className="p-0 col-10">
                        <Row className="m-0 d-flex w-100 justify-content-start">
                            <Typography
                                variant="h5"
                                className={clsx(styles.SectionTitle, "w-auto pt-4 pb-4")}
                                align="left"
                            >
                                Acerca de mi
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                className="w-auto"
                            >
                                Activo desde
                            </Typography>
                            <Typography
                                variant="body2"
                                className="ps-3 pe-3 w-auto"
                            // name="userJoined"
                            >
                                {userInfo.userJoined}
                            </Typography>
                        </Row>
                        <Typography
                            className="body-1" // Assuming this involves a global CSS class
                            style={{
                                textAlign: 'justify',
                            }}
                        >
                            {userInfo.userDescription}
                        </Typography>
                        <Button className="p-4">
                            <PictureAsPdfIcon /> Portafolio de servicios
                        </Button>
                    </Col>
                </Row>

                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col md={10} className="col-10 py-4">
                        {userInfo.userCategoriesChips.length > 0 && (
                            <>
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle, "py-4")}
                                    align="left"
                                >
                                    Habilidades
                                </Typography>

                                <ChipsCategories
                                    listadoCategorias={userInfo.userCategoriesChips}
                                    editableContent={false}
                                />
                            </>
                        )}
                    </Col>
                </Row>

                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col className="col-10 py-4">
                        {(userInfo.userGalleryUrl.length > 0 || !consult) && (
                            <>
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle, "pt-4 pb-4 w-100")}
                                    align="left"
                                >
                                    Portafolio
                                </Typography>
                                <Row className="w-100 pb-4">
                                    {userInfo.userGalleryUrl.map((imagen: string, index: number) => (
                                        <Box
                                            key={index}
                                            component="img"
                                            src={imagen || ''}
                                            alt="galleria-usuario"
                                            className={clsx(styles.GalleryImage)}
                                        />
                                    ))}

                                    {!consult && (
                                        <AdjuntarArchivos
                                            name={'galleryPhoto'}
                                            multiple={true}
                                            idPerson={userConsultId || ''}
                                            rol={userRol.rol}
                                            route={`profiles/${userConsultId}`}
                                            functionState={setUserInfo}
                                            state={userInfo}
                                        />
                                    )}
                                </Row>
                            </>
                        )}

                        {userInfo.userDirection && (
                            <Col className="col-12">
                                <Row className="m-0 d-flex w-100 justify-content-start">
                                    <Typography
                                        variant="h5"
                                        className={clsx(styles.SectionTitle, "w-auto pt-4 pb-4")}
                                        align="left"
                                    >
                                        Ubicación
                                    </Typography>
                                </Row>
                                <MapaPerfil userInfo={userInfo} />
                            </Col>
                        )}

                        {userInfo.userChannelUrl && (
                            <>
                                <Typography
                                    variant="h5"
                                    align="left"
                                    className={clsx(styles.SectionTitle, "pt-4 pb-4 w-100")}
                                >
                                    Comentarios
                                </Typography>

                                <Comentarios
                                    channelUrl={userInfo.userChannelUrl || ''}
                                    userID={userAuthID || ''}
                                    nickname={userAuthName || ''}
                                />
                            </>
                        )}
                    </Col>
                </Row>
            </Col>
        </Container >
    )
}
