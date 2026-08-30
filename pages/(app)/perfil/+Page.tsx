/**
 * Profile Page
 * 
 * Displays user profile - either own profile (authenticated) or another user's (public view).
 * SSR-safe: Uses Zustand store instead of UserAuthContext, lazy Firebase loading.
 * Orchestrator pattern: delegates display concerns to modular profile components.
 */
import { useState, useEffect } from 'react'
import { resolveUserByIdOrSlug } from '@services/users'
import { useUserStore } from '@stores/userStore'
import { usePageContext } from '@hooks/usePageContext'
import type { ContactEmail, ContactPhone, SocialLink } from '@services/types'
import type { CategoryItem } from '@components/common/ChipsCategories'
import { slugify } from '@services/utils/slugify'

// Styles & Assets
// @ts-ignore
import ProfilePhoto from '@assets/img/Profile.png'
import clsx from 'clsx'
import styles from './Profile.module.scss'

// Modular Profile Components
import {
    Comentarios,
    MicrositeShareCard,
    ContactInfoCard,
    SocialLinksCard,
    ProfileHeader,
    ProfileGallery
} from '@features/profile'
import { ChipsCategories, MapaPerfil } from '@components/common'
import { ListadoCategorias } from '@assets/data/ListadoCategorias'

// UI Libs
import { Row, Col, Container } from 'react-bootstrap'
import {
    Button,
    Typography,
    Skeleton,
    Stack
} from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

export interface UserInfoState {
    userId: string
    userName: string
    userMail: string
    userPhone: string
    userJoined: string
    userChannelUrl: string
    userPhotoUrl: string
    userCoverUrl: string
    userGalleryUrl: string[]
    userCreatedDrafts: string[]
    userProfession: string
    userExperience: string
    userCategories: string[]
    userCategoriesChips: CategoryItem[]
    userDirection: string
    userDirectionDetails: string
    userCiudad: string
    userCodigoPostal: string
    userRazonSocial: string
    userContactName: string
    userIdentification: string
    userDescription: string
    userWebSite: string
    userVotes: {
        reviews: unknown[]
        mean: number
        votes: number
    }
    userLikes: {
        likedsProfiles: unknown[]
        likedsDrafts: unknown[]
    }
    emails: ContactEmail[]
    phones: ContactPhone[]
    socialLinks: SocialLink[]
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

    // Determine which profile to show
    const targetIdentifier = routeUsername || routeId || currentUserId
    const viewerRole = currentUserRol

    const [userInfo, setUserInfo] = useState<UserInfoState>({
        userName: '',
        userMail: '',
        userPhone: '',
        userChannelUrl: '',
        userPhotoUrl: ProfilePhoto,
        userCoverUrl: '',
        userGalleryUrl: [],
        userCreatedDrafts: [],
        userId: '',
        userJoined: '',
        userProfession: '',
        userExperience: '',
        userCategories: [],
        userCategoriesChips: [],
        userDirection: '',
        userDirectionDetails: '',
        userCiudad: '',
        userCodigoPostal: '',
        userRazonSocial: '',
        userContactName: '',
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
        emails: [],
        phones: [],
        socialLinks: [],
    })

    // isOwnProfile resolves true if visiting own profile route without params,
    // or if the route param matches currentUserId, or if the loaded profile UID matches currentUserId.
    const isOwnProfile = (!routeId && !routeUsername) ||
        Boolean(currentUserId && (
            (routeId && routeId === currentUserId) ||
            (userInfo.userId && userInfo.userId === currentUserId)
        ))

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!targetIdentifier) {
                setIsLoading(false)
                setError('No user ID provided')
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const resolved = await resolveUserByIdOrSlug(targetIdentifier)
                if (resolved) {
                    const { user: userData } = resolved
                    const chipsInfo: CategoryItem[] = []
                    if (userData.userCategories && Array.isArray(userData.userCategories)) {
                        userData.userCategories.forEach(chip => {
                            const found = ListadoCategorias.find((cat) => cat.label === chip)
                            if (found) {
                                chipsInfo.push(found as CategoryItem)
                            }
                        })
                    }

                    setUserInfo({
                        userChannelUrl: userData.userChannelUrl || '',
                        userPhone: userData.userPhone || '',
                        userPhotoUrl: userData.userPhotoUrl || ProfilePhoto,
                        userCoverUrl: userData.userCoverUrl || '',
                        userId: userData.userId || '',
                        userMail: userData.userMail || '',
                        userName: userData.userName || '',
                        userGalleryUrl: userData.userGalleryUrl || [],
                        userJoined: userData.userJoined || '',
                        userProfession: userData.userProfession || '',
                        userExperience: userData.userExperience || '',
                        userCategories: userData.userCategories || [],
                        userCategoriesChips: chipsInfo,
                        userDirection: userData.userDirection || '',
                        userDirectionDetails: (userData as unknown as { userDirectionDetails?: string }).userDirectionDetails || '',
                        userCiudad: userData.userCiudad || '',
                        userCodigoPostal: userData.userCodigoPostal || '',
                        userRazonSocial: userData.userRazonSocial || '',
                        userContactName: userData.userContactName || '',
                        userIdentification: userData.userIdentification || '',
                        userDescription: userData.userDescription || '',
                        userWebSite: userData.userWebSite || '',
                        userCreatedDrafts: [],
                        userVotes: { reviews: [], mean: 0, votes: 0 },
                        userLikes: { likedsProfiles: [], likedsDrafts: [] },
                        emails: userData.emails || [],
                        phones: userData.phones || [],
                        socialLinks: userData.socialLinks || [],
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
    }, [targetIdentifier])

    // ── Computed Microsite URL & Slug ──
    const micrositeSlug = userInfo?.userName
        ? slugify(userInfo.userName)
        : userInfo?.userRazonSocial
            ? slugify(userInfo.userRazonSocial)
            : userInfo?.userId || ''

    const micrositeUrl = micrositeSlug
        ? `https://dezzpo.com/app/perfil/${micrositeSlug}`
        : ''

    const profileName = userInfo?.userName || userInfo?.userRazonSocial || 'Profesional'

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
        <Container fluid className={clsx(styles.Container, 'p-0')}>
            {/* Hero / Cover / Avatar / Name Section */}
            <ProfileHeader
                userName={userInfo.userName}
                userRazonSocial={userInfo.userRazonSocial}
                userContactName={userInfo.userContactName}
                userProfession={userInfo.userProfession}
                userExperience={userInfo.userExperience}
                userWebSite={userInfo.userWebSite}
                userPhotoUrl={userInfo.userPhotoUrl}
                userCoverUrl={userInfo.userCoverUrl}
                votesCount={userInfo.userVotes?.votes || 0}
                isOwnProfile={isOwnProfile}
                currentUserId={currentUserId}
                viewerRole={viewerRole}
                onUpdateUserInfo={setUserInfo}
                userInfoState={userInfo as unknown as Record<string, unknown>}
            />

            <Col className="col mx-auto pt-4" md={10} sm={12}>
                {/* ── Datos de contacto, Micrositio, Habilidades y Redes Sociales ── */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col xs={12} className="pt-4 pb-4">
                        <Row className="g-4 align-items-start">
                            {/* Columna Izquierda: Contacto + Micrositio (2/3 en desktop) */}
                            <Col lg={8} md={7} xs={12}>
                                {/* MOBILE BADGES FOR CONTACT SECTION */}

                                {/* ── Acerca de mi ── */}
                                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                                    <Col xs={12} className="p-0">
                                        <Row className="m-0 d-flex w-100 justify-content-start">
                                            <Typography
                                                variant="h5"
                                                className={clsx(styles.SectionTitle, 'w-auto pt-4 pb-4')}
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

                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle)}
                                    align="left"
                                >
                                    Datos de contacto
                                </Typography>

                                <ContactInfoCard
                                    emails={userInfo.emails}
                                    phones={userInfo.phones}
                                    userMail={userInfo.userMail}
                                    userPhone={userInfo.userPhone}
                                />

                                {micrositeUrl && (
                                    <MicrositeShareCard
                                        micrositeUrl={micrositeUrl}
                                        micrositeSlug={micrositeSlug}
                                        profileName={profileName}
                                    />
                                )}
                            </Col>

                            {/* Columna Derecha: Habilidades + Redes Sociales (1/3 en desktop) */}
                            <Col lg={4} md={5} xs={12}>
                                {userInfo.userCategoriesChips.length > 0 && (
                                    <Row className="p-0 m-0 w-100 d-flex align-items-start">
                                        <Col xs={12} className="p-0 py-2">
                                            <Typography
                                                variant="h5"
                                                className={clsx(styles.SectionTitle, 'py-4')}
                                                align="left"
                                            >
                                                Habilidades
                                            </Typography>

                                            <div className={styles.ChipsSection || ''}>
                                                <ChipsCategories
                                                    listadoCategorias={userInfo.userCategoriesChips}
                                                    editableContent={false}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                )}

                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle)}
                                    align="left"
                                >
                                    Redes Sociales
                                </Typography>

                                <SocialLinksCard socialLinks={userInfo.socialLinks} />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* ── Portafolio, Ubicación y Comentarios ── */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col xs={12} className="py-4">
                        <ProfileGallery
                            images={userInfo.userGalleryUrl}
                            userName={userInfo.userName}
                            isOwnProfile={isOwnProfile}
                            currentUserId={currentUserId}
                            viewerRole={viewerRole}
                            onUpdateUserInfo={setUserInfo}
                            userInfoState={userInfo as unknown as Record<string, unknown>}
                        />

                        {userInfo.userDirection && (
                            <Col xs={12}>
                                <Row className="m-0 d-flex w-100 justify-content-start">
                                    <Typography
                                        variant="h5"
                                        className={clsx(styles.SectionTitle, 'w-auto pt-4 pb-4')}
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
                                    className={clsx(styles.SectionTitle, 'pt-4 pb-4 w-100')}
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
