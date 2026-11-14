import { useState, useEffect } from 'react'
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
import {
    ChipsCategories,
    MapaPerfil,
    CincoEstrellas,
    ComercianteBusinessCardModal,
} from '@components/common'

// UI Libs
import { Row, Col, Container } from 'react-bootstrap'
import { Box, Button, Typography } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import VerifiedIcon from '@mui/icons-material/Verified'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Chip } from '@mui/material'


export default function Page() {
    const pageContext = usePageContext()
    const currentUserId = useUserStore((state) => state.userId)
    const currentUserName = useUserStore((state) => state.displayName)
    const [openCardModal, setOpenCardModal] = useState(false)

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
        userCoverUrl = '',
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
        'image': userCoverUrl ? [userCoverUrl, userPhotoUrl] : userPhotoUrl,
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

    // Structured Projects & ImageGallery JSON-LD (ADR Option C + Google SEO)
    if (comerciante.structuredProjects && comerciante.structuredProjects.length > 0) {
        comerciante.structuredProjects.forEach((p: any) => {
            const images: string[] = []
            if (p.beforeAfterPairs && Array.isArray(p.beforeAfterPairs)) {
                p.beforeAfterPairs.forEach((pair: any) => {
                    if (pair.afterUrl) images.push(pair.afterUrl)
                    if (pair.beforeUrl) images.push(pair.beforeUrl)
                })
            }
            if (p.galleryUrls && Array.isArray(p.galleryUrls)) {
                images.push(...p.galleryUrls)
            }

            schemaGraph.push({
                '@type': 'CreativeWork',
                'name': p.title,
                'description': p.description,
                'genre': p.category,
                'image': images,
                'creator': {
                    '@type': 'Person',
                    'name': userRazonSocial || userName,
                },
            })
        })
    } else if (userGalleryUrl.length > 0) {
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

            <Col
                className={clsx(styles.GreenBackground, "col-12 w-100")}
                style={userCoverUrl ? { backgroundImage: `url(${userCoverUrl})` } : undefined}
            >
                {userCoverUrl && <div className={styles.CoverOverlay} />}
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
                            {comerciante.earnedBadges.map((badge: any, index: number) => {
                                const badgeLabel = badge.title || (badge.category ? `Certificado: ${badge.category}` : 'Insignia Verificada')
                                const badgeColor = badge.color || '#0f766e'
                                const badgeBg = badge.bgLight || '#f0fdfa'
                                const badgeBorder = badge.borderColor || '#ccfbf1'
                                return (
                                    <Chip
                                        key={index}
                                        icon={<VerifiedIcon sx={{ color: `${badgeColor} !important`, fontSize: '0.9rem' }} />}
                                        label={badgeLabel}
                                        sx={{
                                            bgcolor: badgeBg,
                                            color: badgeColor,
                                            fontWeight: 600,
                                            border: `1px solid ${badgeBorder}`,
                                            fontSize: '0.75rem',
                                            height: 26,
                                            '& .MuiChip-icon': {
                                                color: badgeColor,
                                            },
                                        }}
                                        size="small"
                                    />
                                )
                            })}
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

                {/* Call to Action: Solicitar cotización y Tarjeta Digital QR */}
                <Row className="p-0 m-0 w-100 d-flex justify-content-center">
                    <Col md={10} className="col-10 text-center py-3">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
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
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<QrCode2Icon />}
                                onClick={() => setOpenCardModal(true)}
                                sx={{
                                    borderRadius: '50px',
                                    borderColor: '#0f766e',
                                    color: '#0f766e',
                                    fontWeight: 700,
                                    py: 1.5,
                                    px: 3,
                                    '&:hover': {
                                        borderColor: '#0d9488',
                                        bgcolor: '#f0fdfa',
                                    },
                                }}
                            >
                                Tarjeta Digital & QR
                            </Button>
                        </Box>
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

                {/* Portfolio / Structured Projects (ADR Option C) */}
                <Row className="p-0 m-0 w-100 d-flex align-items-start">
                    <Col className="col-10 py-4 mx-auto">
                        {comerciante.structuredProjects && comerciante.structuredProjects.length > 0 ? (
                            <>
                                <Typography
                                    variant="h5"
                                    className={clsx(styles.SectionTitle, "pt-4 pb-3 w-100")}
                                    align="left"
                                >
                                    Proyectos destacados y obras realizadas
                                </Typography>
                                <Row className="w-100 pb-4">
                                    {comerciante.structuredProjects.map((project: any, pIndex: number) => (
                                        <Col key={project.projectId || pIndex} xs={12} className="mb-4">
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 3,
                                                    bgcolor: '#ffffff',
                                                    border: '1px solid #e2e8f0',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight={700} color="#0f172a">
                                                            {project.title}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                            {project.category && (
                                                                <Chip label={project.category} size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: '0.75rem' }} />
                                                            )}
                                                            {project.zone && (
                                                                <Chip label={project.zone.replace('bogota-', '').replace(/-/g, ' ')} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600, fontSize: '0.75rem' }} />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                    {project.clientConsent?.granted && (
                                                        <Chip
                                                            icon={<CheckCircleOutlineIcon sx={{ color: '#059669 !important', fontSize: '0.9rem' }} />}
                                                            label="Obra autorizada por el propietario"
                                                            size="small"
                                                            sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 600, fontSize: '0.72rem' }}
                                                        />
                                                    )}
                                                </Box>
                                                {project.description && (
                                                    <Typography variant="body2" color="#475569" sx={{ mb: 2 }}>
                                                        {project.description}
                                                    </Typography>
                                                )}

                                                {/* Before / After comparison if present */}
                                                {project.beforeAfterPairs && project.beforeAfterPairs.length > 0 && (
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography variant="subtitle2" fontWeight={700} color="#0f766e" sx={{ mb: 1 }}>
                                                            Transformación: Antes y Después
                                                        </Typography>
                                                        <Row>
                                                            {project.beforeAfterPairs.map((pair: any, pairIdx: number) => (
                                                                <Col key={pair.id || pairIdx} md={6} xs={12} className="mb-2">
                                                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                                        <Box sx={{ flex: 1, position: 'relative' }}>
                                                                            <Box
                                                                                component="img"
                                                                                src={pair.beforeUrl}
                                                                                alt="Antes de la obra"
                                                                                sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 2 }}
                                                                            />
                                                                            <Chip label="ANTES" size="small" sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.7)', color: '#fff', fontWeight: 800, fontSize: '0.7rem' }} />
                                                                        </Box>
                                                                        <Box sx={{ flex: 1, position: 'relative' }}>
                                                                            <Box
                                                                                component="img"
                                                                                src={pair.afterUrl}
                                                                                alt="Después de la obra"
                                                                                sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 2, border: '2px solid #0d9488' }}
                                                                            />
                                                                            <Chip label="DESPUÉS" size="small" sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: '#0d9488', color: '#fff', fontWeight: 800, fontSize: '0.7rem' }} />
                                                                        </Box>
                                                                    </Box>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </Box>
                                                )}

                                                {/* Additional Project Gallery Photos */}
                                                {project.galleryUrls && project.galleryUrls.length > 0 && (
                                                    <Row>
                                                        {project.galleryUrls.map((img: string, iIdx: number) => (
                                                            <Col key={iIdx} md={3} sm={6} xs={12} className="p-1">
                                                                <Box
                                                                    component="img"
                                                                    src={img}
                                                                    alt={`${project.title} - foto ${iIdx + 1}`}
                                                                    sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1.5 }}
                                                                />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                )}
                                            </Box>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        ) : userGalleryUrl.length > 0 ? (
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
                        ) : null}

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

            {/* Digital Business Card & QR Modal */}
            <ComercianteBusinessCardModal
                open={openCardModal}
                onClose={() => setOpenCardModal(false)}
                comerciante={comerciante}
            />
        </Container>
    )
}
