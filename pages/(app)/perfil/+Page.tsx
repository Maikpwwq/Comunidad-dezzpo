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
import { PLATFORM_CONFIG } from '@utilities/socialUtils'
import type { ContactEmail, ContactPhone, SocialLink } from '@services/types'

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
    IconButton,
    Tooltip,
    Typography,
    Skeleton,
    Stack
} from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import MailIcon from '@mui/icons-material/Mail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import LinkIcon from '@mui/icons-material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

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
                            userCoverUrl: userData.userCoverUrl || '',
                            userId: userData.userId || '',
                            userMail: userData.userMail || '',
                            userName: userData.userName || '',
                            userGalleryUrl: userData.userGalleryUrl || [],
                            userJoined: userData.userJoined || '',
                            userProfession: userData.userProfession || '',
                            userExperience: userData.userExperience || '',
                            userCategoriesChips: chipsInfo,
                            userDirection: userData.userDirection || '',
                            userDirectionDetails: (userData as any).userDirectionDetails || '',
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
                        userCoverUrl: userData.userCoverUrl || '',
                        userId: userData.userId || '',
                        userMail: userData.userMail || '',
                        userName: userData.userName || '',
                        userGalleryUrl: userData.userGalleryUrl || [],
                        userJoined: userData.userJoined || '',
                        userProfession: userData.userProfession || '',
                        userExperience: userData.userExperience || '',
                        userCategoriesChips: chipsInfo,
                        userDirection: userData.userDirection || '',
                        userDirectionDetails: (userData as any).userDirectionDetails || '',
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
            <Col
                className={clsx(styles.GreenBackground, "col-12 w-100")}
                style={userInfo.userCoverUrl ? { backgroundImage: `url(${userInfo.userCoverUrl})` } : undefined}
            >
                {userInfo.userCoverUrl && <div className={styles.CoverOverlay} />}

                {isOwnProfile && currentUserId && (
                    <div className={styles.CoverActionContainer}>
                        <AdjuntarArchivos
                            name="coverPhoto"
                            multiple={false}
                            idPerson={currentUserId}
                            rol={viewerRole}
                            route={`profiles/${currentUserId}`}
                            functionState={setUserInfo}
                            state={userInfo}
                            variant="button"
                            buttonText={userInfo.userCoverUrl ? 'Editar imagen de portada' : '+ Agregar imagen de portada'}
                            tooltipTitle="Recomendado: 1584 x 396 px (Aspect Ratio 4:1)"
                            aspectRatioHint="1584 x 396 px"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                color: '#2e7d32',
                                '&:hover': {
                                    backgroundColor: '#ffffff',
                                    color: '#1b5e20',
                                }
                            }}
                        />
                    </div>
                )}

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
                        {userInfo?.userName || userInfo?.userRazonSocial || 'Usuario'}{' '}
                        {!!userInfo?.userWebSite && (
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, verticalAlign: 'middle' }}>
                                <Tooltip title="Copiar sitio web">
                                    <IconButton
                                        size="small"
                                        onClick={copyUserWebSiteLink}
                                        aria-label="Copiar enlace del sitio web"
                                        sx={{ color: 'inherit', p: 0.5 }}
                                    >
                                        <LinkIcon
                                            fontSize="medium"
                                            className={clsx(styles.LinkIcon)}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Visitar sitio web">
                                    <IconButton
                                        size="small"
                                        component="a"
                                        href={userInfo.userWebSite.match(/^https?:\/\//i) ? userInfo.userWebSite : `https://${userInfo.userWebSite}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Visitar sitio web en nueva pestaña"
                                        sx={{ color: 'inherit', p: 0.5 }}
                                    >
                                        <OpenInNewIcon
                                            fontSize="medium"
                                            className={clsx(styles.LinkIcon)}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Typography>
                    {userInfo?.userRazonSocial && userInfo?.userName && userInfo.userRazonSocial !== userInfo.userName && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: -0.5, mb: 0.5 }}>
                            {userInfo.userRazonSocial}
                        </Typography>
                    )}
                    {userInfo?.userContactName && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8 }}>
                            Contacto / Representante: <strong>{userInfo.userContactName}</strong>
                        </Typography>
                    )}
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

                {/* ── Chips Section ── */}
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

                                <div className={styles.ChipsSection || ''}>
                                    <ChipsCategories
                                        listadoCategorias={userInfo.userCategoriesChips}
                                        editableContent={false}
                                    />
                                </div>
                            </>
                        )}
                    </Col>
                </Row>

                {/* ── Datos de contacto & Redes Sociales Section ── */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col md={10} className="col-10 pt-4 pb-4">
                        <Row className="g-4 align-items-start">
                            {/* Datos de contacto (2/3 width on desktop) */}
                            <Col lg={8} md={7} xs={12}>
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle)}
                                    align="left"
                                >
                                    Datos de contacto
                                </Typography>
                                {(() => {
                                    const activeEmails = (userInfo.emails || []).filter((e) => e.address && e.address.trim() !== '')
                                    const displayEmails = activeEmails.length > 0
                                        ? activeEmails
                                        : (userInfo.userMail ? [{ address: userInfo.userMail, isPrimary: true, verified: false }] : [])

                                    const activePhones = (userInfo.phones || []).filter((p) => p.number && p.number.trim() !== '')
                                    const displayPhones = activePhones.length > 0
                                        ? activePhones
                                        : (userInfo.userPhone ? [{ number: userInfo.userPhone, isPrimary: true, type: 'personal' as const }] : [])

                                    const hasContacts = displayEmails.length > 0 || displayPhones.length > 0

                                    if (!hasContacts) {
                                        return (
                                            <Typography variant="body2" className="body-2" style={{ color: '#888' }}>
                                                No hay canales directos de contacto registrados
                                            </Typography>
                                        )
                                    }

                                    return (
                                        <Box className={clsx(styles.ContactCard)}>
                                            {displayEmails.length > 0 && (
                                                <div className={styles.ContactGroup}>
                                                    <span className={styles.ContactGroupTitle}>
                                                        Correos electrónicos
                                                    </span>
                                                    <div className={styles.ContactList}>
                                                        {displayEmails.map((email, idx) => (
                                                            <a
                                                                key={`email-${idx}`}
                                                                href={`mailto:${email.address}`}
                                                                className={styles.ContactItemLink}
                                                                aria-label={`Enviar correo a ${email.address}`}
                                                            >
                                                                <MailIcon className={styles.ContactItemIcon || ''} />
                                                                <span className={styles.ContactItemText}>{email.address}</span>
                                                                {email.isPrimary && (
                                                                    <span className={styles.ContactPrimaryBadge}>Principal</span>
                                                                )}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {displayPhones.length > 0 && (
                                                <div className={styles.ContactGroup}>
                                                    <span className={styles.ContactGroupTitle}>
                                                        Teléfonos de contacto
                                                    </span>
                                                    <div className={styles.ContactList}>
                                                        {displayPhones.map((phone, idx) => {
                                                            const cleanPhone = phone.number.replace(/\s+/g, '')
                                                            return (
                                                                <a
                                                                    key={`phone-${idx}`}
                                                                    href={`tel:${cleanPhone}`}
                                                                    className={styles.ContactItemLink}
                                                                    aria-label={`Llamar al teléfono ${phone.number}`}
                                                                >
                                                                    <PhoneIphoneIcon className={styles.ContactItemIcon || ''} />
                                                                    <span className={styles.ContactItemText}>{phone.number}</span>
                                                                    {phone.type === 'trabajo' && (
                                                                        <span className={styles.ContactTypeBadge}>Trabajo</span>
                                                                    )}
                                                                    {phone.isPrimary && (
                                                                        <span className={styles.ContactPrimaryBadge}>Principal</span>
                                                                    )}
                                                                </a>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </Box>
                                    )
                                })()}
                            </Col>

                            {/* Redes Sociales (1/3 width on desktop) */}
                            <Col lg={4} md={5} xs={12}>
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle)}
                                    align="left"
                                >
                                    Redes Sociales
                                </Typography>
                                {(() => {
                                    const visibleLinks = (userInfo.socialLinks || [])
                                        .filter((sl) => sl.isVisible)
                                        .sort((a, b) => a.priority - b.priority)

                                    if (visibleLinks.length === 0) {
                                        return (
                                            <Typography variant="body2" className="body-2" style={{ color: '#888' }}>
                                                No hay canales de comunicación configurados
                                            </Typography>
                                        )
                                    }

                                    return (
                                        <div className={styles.SocialLinksGrid || ''}>
                                            {visibleLinks.map((sl) => (
                                                <a
                                                    key={sl.id}
                                                    href={sl.url.match(/^https?:\/\//) ? sl.url : `https://${sl.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.SocialLinkChip || ''}
                                                >
                                                    <span className={styles.SocialLinkChipName || ''}>
                                                        {PLATFORM_CONFIG[sl.platform]?.name || sl.platform}
                                                    </span>
                                                    {sl.label && (
                                                        <span className={styles.SocialLinkChipLabel || ''}>
                                                            {sl.label}
                                                        </span>
                                                    )}
                                                    <OpenInNewIcon fontSize="small" />
                                                </a>
                                            ))}
                                        </div>
                                    )
                                })()}
                            </Col>
                        </Row>
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
                                <Row className="w-100 g-4 pb-4">
                                    {userInfo.userGalleryUrl.map((imagen: string, index: number) => (
                                         <Col key={index} lg={6} md={6} xs={12} className="d-flex justify-content-center">
                                             <Box className={clsx(styles.GalleryCard)}>
                                                 <Box
                                                     component="img"
                                                     src={imagen || ''}
                                                     alt={`Publicación ${index + 1} de ${userInfo.userName || 'comercio'}`}
                                                     className={clsx(styles.GalleryImage)}
                                                 />
                                             </Box>
                                         </Col>
                                    ))}

                                    {isOwnProfile && currentUserId && (
                                         <Col xs={12} className="mt-3">
                                             <AdjuntarArchivos
                                                 name={'galleryPhoto'}
                                                 multiple={true}
                                                 idPerson={currentUserId}
                                                 rol={viewerRole}
                                                 route={`profiles/${currentUserId}`}
                                                 functionState={setUserInfo}
                                                 state={userInfo}
                                             />
                                         </Col>
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
