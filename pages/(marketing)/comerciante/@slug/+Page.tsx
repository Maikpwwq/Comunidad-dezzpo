import { useEffect } from 'react'
import { usePageContext } from '@hooks/usePageContext'
import { useUserStore } from '@stores/userStore'
import { getPrimaryEmail, getPrimaryPhone } from '@utilities/contactUtils'
import { PLATFORM_CONFIG } from '@utilities/socialUtils'

// Styles & Assets
// @ts-ignore
import ProfilePhoto from '@assets/img/Profile.png'
import clsx from 'clsx'
import styles from './ProfilePublic.module.scss'

import { Comentarios } from '@features/profile'
import { ChipsCategories, MapaPerfil, CincoEstrellas } from '@components/common'

// UI Libs
import { Row, Col, Container } from 'react-bootstrap'
import { Box, Button, Typography } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import VerifiedIcon from '@mui/icons-material/Verified'
import { Chip } from '@mui/material'


export default function Page() {
    const pageContext = usePageContext()
    const currentUserId = useUserStore((state) => state.userId)
    const currentUserName = useUserStore((state) => state.displayName)

    const data = pageContext.data as any
    const comerciante = data?.comerciante

    useEffect(() => {
        if (comerciante) {
            import('@utils/analytics').then(({ trackViewProfile }) => {
                trackViewProfile(
                    comerciante.userId || '',
                    comerciante.userName || comerciante.userRazonSocial || '',
                    comerciante.profileTier || 'free'
                )
            })
        }
    }, [comerciante])

    if (!comerciante) {
        return (
            <Container fluid className="p-4 text-center">
                <Typography variant="h5" color="error">Perfil no encontrado</Typography>
                <Typography variant="body1" className="mt-2">
                    El comerciante que estás buscando no existe o fue desactivado.
                </Typography>
            </Container>
        )
    }

    const {
        userName = '',
        userMail = '',
        userPhone = '',
        userPhotoUrl = ProfilePhoto,
        userGalleryUrl = [],
        userJoined = '',
        userProfession = '',
        userExperience = '',
        userDirection = '',
        userRazonSocial = '',
        userDescription = '',
        userCategoriesChips = [],
        emails = [],
        phones = [],
        socialLinks = [],
        userChannelUrl = ''
    } = comerciante

    const emailDisplay = getPrimaryEmail(emails) || userMail || '—'
    const phoneDisplay = getPrimaryPhone(phones) || userPhone || '—'

    // JSON-LD Structured Data (Phase 3: Enhanced with ImageGallery + Trust)
    const zonasCobertura = comerciante.userZonasCobertura || []
    const trustScore = typeof comerciante.trustScore === 'number' ? comerciante.trustScore : null

    const localBusiness: Record<string, unknown> = {
        '@type': 'LocalBusiness',
        'name': userRazonSocial || userName,
        'description': userDescription,
        'image': userPhotoUrl,
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': userDirection || 'Bogotá',
            'addressCountry': 'CO'
        },
        'telephone': phoneDisplay,
    }

    // Inject aggregateRating from trustScore when available
    if (trustScore !== null && trustScore > 0) {
        const ratingValue = Math.round((trustScore / 20) * 10) / 10 // Map 0-100 → 0-5
        localBusiness['aggregateRating'] = {
            '@type': 'AggregateRating',
            'ratingValue': Math.max(1, Math.min(5, ratingValue)),
            'bestRating': 5,
            'worstRating': 1,
            'ratingCount': 1
        }
    }

    // Inject areaServed from coverage zones
    if (zonasCobertura.length > 0) {
        localBusiness['areaServed'] = zonasCobertura.map((z: string) => ({
            '@type': 'City',
            'name': z.replace('bogota-', '').replace(/-/g, ' ')
        }))
    }

    const schemaGraph: Record<string, unknown>[] = [
        {
            '@type': 'ProfilePage',
            'mainEntity': localBusiness
        }
    ]

    // ImageGallery JSON-LD for portfolio
    if (userGalleryUrl.length > 0) {
        schemaGraph.push({
            '@type': 'ImageGallery',
            'name': `Portafolio de ${userRazonSocial || userName}`,
            'image': userGalleryUrl.map((url: string, i: number) => ({
                '@type': 'ImageObject',
                'url': url,
                'name': `Trabajo ${i + 1} de ${userName}`
            }))
        })
    }

    const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': schemaGraph
    }

    return (
        <Container fluid className={clsx(styles.Container, "p-0")}>
            {/* Inject JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
            />

            <Col className={clsx(styles.GreenBackground, "col-12 w-100")}>
                <Row className={clsx(styles.HeaderRow)}>
                    <div className={clsx(styles.ProfileImageContainer)}>
                        <img
                            src={userPhotoUrl || ''}
                            alt={`Foto de perfil de ${userName}`}
                            className={styles.ProfileImage}
                        />
                    </div>
                </Row>
            </Col>
            
            <Col className="col mx-auto pt-5" md={10} sm={12}>
                <Box className={clsx(styles.UserInfoBox)}>
                    <Typography
                        variant="h3"
                        id="userRazonSocial"
                        sx={{ maxWidth: '480px' }}
                        className={clsx(styles.BusinessName)}
                    >
                        {userRazonSocial || userName}
                    </Typography>
                    <Typography
                        variant="h5"
                        id="userProfession"
                        className={clsx(styles.Profession)}
                    >
                        {userProfession}
                    </Typography>
                    <Typography
                        variant="body2"
                        id="userExperience"
                        className={clsx(styles.Experience)}
                    >
                        Experiencia: {userExperience}
                    </Typography>
                    <CincoEstrellas />
                    <span className={clsx(styles.Experience, "fs-6")}>
                        Activo desde: {userJoined}
                    </span>
                    {comerciante.earnedBadges && comerciante.earnedBadges.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                            {comerciante.earnedBadges.map((badge: any, index: number) => (
                                <Chip
                                    key={index}
                                    icon={<VerifiedIcon sx={{ color: '#0d9488 !important', fontSize: '0.9rem' }} />}
                                    label={`Certificado: ${badge.category}`}
                                    sx={{
                                        bgcolor: '#f0fdfa',
                                        color: '#0f766e',
                                        fontWeight: 600,
                                        border: '1px solid #ccfbf1',
                                        fontSize: '0.75rem',
                                        height: 26,
                                        '& .MuiChip-icon': {
                                            color: '#0d9488',
                                        }
                                    }}
                                    size="small"
                                />
                            ))}
                        </Box>
                    )}
                </Box>


                {/* Visible Contact Info (Visible to guest/anonymous users) */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col md={10} className="col-10 pt-4 pb-4 mx-auto">
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
                                <a 
                                    href={`mailto:${emailDisplay}`} 
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                    onClick={() => {
                                        import('@utils/analytics').then(({ trackContact }) => {
                                            trackContact(comerciante.userId || '', 'email')
                                        })
                                    }}
                                >
                                    {emailDisplay}
                                </a>
                            </Typography>

                            <Typography
                                variant="body2"
                                className={clsx(styles.InfoPill, "body-2")}
                            >
                                <PhoneIphoneIcon fontSize="large" />{' '}
                                <a 
                                    href={`tel:${phoneDisplay}`} 
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                    onClick={() => {
                                        import('@utils/analytics').then(({ trackContact }) => {
                                            trackContact(comerciante.userId || '', 'phone')
                                        })
                                    }}
                                >
                                    {phoneDisplay}
                                </a>
                            </Typography>
                        </Box>
                    </Col>
                </Row>

                {/* Call to Action: Solicitar cotización */}
                <Row className="p-0 m-0 w-100 d-flex justify-content-center">
                    <Col md={10} className="col-10 text-center py-3">
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            className="btn-primary-gradient py-3 px-5 text-white"
                            style={{ borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold' }}
                            href={`/nuevo-proyecto?comercianteId=${comerciante.userId}&category=${comerciante.userCategories?.[0] || ''}`}
                        >
                            Solicitar Cotización Gratis
                        </Button>
                    </Col>
                </Row>

                {/* Social Links Section */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col md={10} className="col-10 pt-2 pb-4 mx-auto">
                        <Typography
                            variant="h5"
                            className={clsx(styles.SectionTitle)}
                            align="left"
                        >
                            Canales de comunicación
                        </Typography>
                        {(() => {
                            const visibleLinks = (socialLinks as any[] || [])
                                .filter((sl: any) => sl.isVisible)
                                .sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0))

                            if (visibleLinks.length === 0) {
                                return (
                                    <Typography variant="body2" className="body-2" style={{ color: '#888' }}>
                                        No hay canales de comunicación configurados.
                                    </Typography>
                                )
                            }

                            return (
                                <div className={styles.SocialLinksGrid || ''}>
                                    {visibleLinks.map((sl: any) => (
                                        <a
                                            key={sl.id}
                                            href={sl.url?.match(/^https?:\/\//) ? sl.url : `https://${sl.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.SocialLinkChip || ''}
                                            onClick={() => {
                                                import('@utils/analytics').then(({ trackContact }) => {
                                                    trackContact(comerciante.userId || '', sl.platform || 'social')
                                                })
                                            }}
                                        >
                                            <span className={styles.SocialLinkChipName || ''}>
                                                {(PLATFORM_CONFIG as any)[sl.platform]?.name || sl.platform}
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

                {/* About me */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col className="p-0 col-10 mx-auto">
                        <Typography
                            variant="h5"
                            className={clsx(styles.SectionTitle, "pt-4 pb-4")}
                            align="left"
                        >
                            Acerca de mi
                        </Typography>
                        <Typography
                            className="body-1"
                            style={{
                                textAlign: 'justify',
                            }}
                        >
                            {userDescription || 'Este comerciante no ha ingresado una descripción todavía.'}
                        </Typography>
                        <Button className="p-4 mt-3" variant="outlined" color="success" style={{ borderRadius: '12px' }}>
                            <PictureAsPdfIcon className="me-2" /> Descargar portafolio de servicios
                        </Button>
                    </Col>
                </Row>

                {/* Skills Section */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col md={10} className="col-10 py-4 mx-auto">
                        {userCategoriesChips.length > 0 && (
                            <>
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle, "py-4")}
                                    align="left"
                                >
                                    Habilidades y Especialidades
                                </Typography>

                                <div className={styles.ChipsSection || ''}>
                                    <ChipsCategories
                                        listadoCategorias={userCategoriesChips}
                                        editableContent={false}
                                    />
                                </div>
                            </>
                        )}
                    </Col>
                </Row>

                {/* Portfolio / Gallery */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col className="col-10 py-4 mx-auto">
                        {userGalleryUrl.length > 0 && (
                            <>
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle, "pt-4 pb-4 w-100")}
                                    align="left"
                                >
                                    Portafolio de trabajos realizados
                                </Typography>
                                <Row className="w-100 pb-4">
                                    {userGalleryUrl.map((imagen: string, index: number) => (
                                        <Col key={index} md={4} sm={6} xs={12} className="p-2">
                                            <Box
                                                component="img"
                                                src={imagen || ''}
                                                alt={`Trabajo realizado ${index + 1} de ${userName}`}
                                                className={clsx(styles.GalleryImage)}
                                                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}

                        {/* Location */}
                        {userDirection && (
                            <Col className="col-12 py-4">
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle, "pt-4 pb-4")}
                                    align="left"
                                >
                                    Ubicación de servicio
                                </Typography>
                                <MapaPerfil userInfo={comerciante} />
                            </Col>
                        )}

                        {/* Sendbird Comments Section */}
                        {userChannelUrl && (
                            <Col className="col-12 py-4">
                                <Typography
                                    variant="h5"
                                    align="left"
                                    className={clsx(styles.SectionTitle, "pt-4 pb-4 w-100")}
                                >
                                    Opiniones de clientes
                                </Typography>
                                <Comentarios
                                    channelUrl={userChannelUrl}
                                    userID={currentUserId || ''}
                                    nickname={currentUserName || ''}
                                />
                            </Col>
                        )}
                    </Col>
                </Row>
            </Col>
        </Container>
    )
}
