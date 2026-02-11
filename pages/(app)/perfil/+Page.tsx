/**
 * Profile Page
 * 
 * Displays user profile - either own profile (authenticated) or another user's (public view).
 * SSR-safe: Uses Zustand store instead of UserAuthContext, lazy Firebase loading.
 */
import { useState, useEffect } from 'react'
import { getUser, getUserByUsername } from '@services/users'
import { useUserStore } from '@stores/userStore'
import { usePageContext } from '@hooks/usePageContext'

// Styles & Assets
// @ts-ignore
import ProfilePhoto from '@assets/img/Profile.png'
import clsx from 'clsx'
import styles from './Profile.module.scss'

// @ts-ignore
import { Comentarios } from '@features/profile'
import { ChipsCategories, MapaPerfil, AdjuntarArchivos, CincoEstrellas } from '@components/common'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// UI Libs
import { Row, Col, Container } from 'react-bootstrap'
import {
    Box,
    Button,
    Tooltip,
    Typography,
    Skeleton,
    Stack
} from '@mui/material'
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
    userCreatedDrafts: any[]
    userGalleryUrl: string[]
}

/**
 * Loading skeleton for profile
 */
function ProfileSkeleton() {
    return (
        <Container fluid className="p-4">
            <Stack spacing={2}>
                <Skeleton variant="circular" width={120} height={120} />
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="rectangular" width="100%" height={200} />
            </Stack>
        </Container>
    )
}

export default function Page() {
    const pageContext = usePageContext()

    // Zustand selectors for auth state
    const currentUserId = useUserStore((state) => state.userId)
    const currentUserName = useUserStore((state) => state.displayName)
    const currentUserRol = useUserStore((state) => state.rol)

    // Route params - the profile ID or username we want to view
    const routeId = pageContext.routeParams?.id
    const routeUsername = pageContext.routeParams?.username

    // State
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Determine which profile to show and if viewing own profile
    const targetUserId = routeUsername ? undefined : (routeId || currentUserId)
    const isOwnProfile = !routeId && !routeUsername || routeId === currentUserId
    const viewerRole = currentUserRol

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

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            // Handle vanity URL (username lookup)
            if (routeUsername) {
                setIsLoading(true)
                setError(null)
                try {
                    const result = await getUserByUsername(routeUsername)
                    if (result) {
                        const { user: userData } = result
                        // Map categories to chips
                        let chipsInfo: any[] = []
                        if (userData.userCategories && Array.isArray(userData.userCategories)) {
                            chipsInfo = userData.userCategories.map(chip => {
                                const found = ListadoCategorias.find((cat: any) => cat.label === chip)
                                return found || null
                            }).filter(item => item !== null)
                        }

                        setUserInfo({
                            userChannelUrl: userData.userChannelUrl || '',
                            userPhone: userData.userPhone || '',
                            userPhotoUrl: userData.userPhotoUrl || ProfilePhoto,
                            userId: userData.userId || '',
                            userMail: userData.userMail || '',
                            userName: userData.userName || '',
                            userGalleryUrl: userData.userGalleryUrl || [],
                            userJoined: userData.userJoined || '',
                            userProfession: userData.userProfession || '',
                            userExperience: userData.userExperience || '',
                            userCategoriesChips: chipsInfo,
                            userDirection: userData.userDirection || '',
                            userCiudad: userData.userCiudad || '',
                            userCodigoPostal: userData.userCodigoPostal || '',
                            userRazonSocial: userData.userRazonSocial || '',
                            userIdentification: userData.userIdentification || '',
                            userDescription: userData.userDescription || '',
                            userWebSite: userData.userWebSite || '',
                            userCreatedDrafts: [],
                            userVotes: { reviews: [], mean: 0, votes: 0 },
                            userLikes: { likedsProfiles: [], likedsDrafts: [] },
                        })
                    } else {
                        setError('User not found')
                    }
                } catch (err) {
                    console.error('Error fetching profile by username:', err)
                    setError('Error loading profile')
                } finally {
                    setIsLoading(false)
                }
                return
            }

            // Handle ID-based lookup (existing logic)
            if (!targetUserId) {
                setIsLoading(false)
                setError('No user ID provided')
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                // Try both roles to find the user (2 = Comerciante, 1 = Propietario)
                const rolesToTry: UserRole[] = isOwnProfile && viewerRole
                    ? [viewerRole]
                    : [2, 1]

                let userData: UserFirestoreDocument | null = null

                for (const role of rolesToTry) {
                    userData = await getUser({ userId: targetUserId, role })
                    if (userData) break
                }

                if (userData) {
                    let chipsInfo: any[] = []
                    if (userData.userCategories && Array.isArray(userData.userCategories)) {
                        chipsInfo = userData.userCategories.map(chip => {
                            const found = ListadoCategorias.find((cat: any) => cat.label === chip)
                            return found || null
                        }).filter(item => item !== null)
                    }

                    setUserInfo({
                        userChannelUrl: userData.userChannelUrl || '',
                        userPhone: userData.userPhone || '',
                        userPhotoUrl: userData.userPhotoUrl || ProfilePhoto,
                        userId: userData.userId || '',
                        userMail: userData.userMail || '',
                        userName: userData.userName || '',
                        userGalleryUrl: userData.userGalleryUrl || [],
                        userJoined: userData.userJoined || '',
                        userProfession: userData.userProfession || '',
                        userExperience: userData.userExperience || '',
                        userCategoriesChips: chipsInfo,
                        userDirection: userData.userDirection || '',
                        userCiudad: userData.userCiudad || '',
                        userCodigoPostal: userData.userCodigoPostal || '',
                        userRazonSocial: userData.userRazonSocial || '',
                        userIdentification: userData.userIdentification || '',
                        userDescription: userData.userDescription || '',
                        userWebSite: userData.userWebSite || '',
                        userCreatedDrafts: [],
                        userVotes: { reviews: [], mean: 0, votes: 0 },
                        userLikes: { likedsProfiles: [], likedsDrafts: [] },
                    })
                } else {
                    setError('User not found')
                }
            } catch (err) {
                console.error('Error fetching profile:', err)
                setError('Error loading profile')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [targetUserId, routeUsername, isOwnProfile, viewerRole])

    const copyUserWebSiteLink = () => {
        if (userInfo?.userWebSite) {
            navigator.clipboard.writeText(userInfo.userWebSite)
        }
    }

    // Show loading state
    if (isLoading) {
        return <ProfileSkeleton />
    }

    // Show error state
    if (error) {
        return (
            <Container fluid className="p-4 text-center">
                <Typography variant="h5" color="error">{error}</Typography>
                <Typography variant="body1" className="mt-2">
                    The profile you're looking for could not be found.
                </Typography>
            </Container>
        )
    }

    return (
        <Container fluid className={clsx(styles.Container, "p-0")}>
            <Col className={clsx(styles.GreenBackground, "col-12 w-100")}>
                <Row className={clsx(styles.HeaderRow)}>
                    <div className={clsx(styles.ProfileImageContainer)}>
                        <img
                            src={userInfo.userPhotoUrl || ''}
                            alt="imagen de perfil"
                            className={styles.ProfileImage}
                        />

                        {isOwnProfile && currentUserId && (
                            <AdjuntarArchivos
                                name={'profilePhoto'}
                                multiple={false}
                                idPerson={currentUserId}
                                rol={viewerRole}
                                route={`profiles/${currentUserId}`}
                                functionState={setUserInfo}
                                state={userInfo}
                            />
                        )}
                    </div>
                </Row>
            </Col>
            <Col className="col mx-auto pt-4" md={10} sm={12}>
                <Box className={clsx(styles.UserInfoBox)}>
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
                        variant="body2"
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
                        <Box className={clsx(styles.ContactCard)}>
                            <Typography
                                variant="body2"
                                className={clsx(styles.InfoPill, "body-2")}
                            >
                                <MailIcon fontSize="large" />{' '}
                                {userInfo.userMail}
                            </Typography>

                            <Typography
                                variant="body2"
                                className={clsx(styles.InfoPill, "body-2")}
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
                            >
                                {userInfo.userJoined}
                            </Typography>
                        </Row>
                        <Typography
                            className="body-1"
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
                        {(userInfo.userGalleryUrl.length > 0 || isOwnProfile) && (
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

                                    {isOwnProfile && currentUserId && (
                                        <AdjuntarArchivos
                                            name={'galleryPhoto'}
                                            multiple={true}
                                            idPerson={currentUserId}
                                            rol={viewerRole}
                                            route={`profiles/${currentUserId}`}
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
                                    userID={currentUserId || ''}
                                    nickname={currentUserName || ''}
                                />
                            </>
                        )}
                    </Col>
                </Row>
            </Col>
        </Container>
    )
}
