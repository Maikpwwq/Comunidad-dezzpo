import { useEffect } from 'react'
import { usePageContext } from '@hooks/usePageContext'
import { Container } from 'react-bootstrap'
import { Typography, Button } from '@mui/material'
import styles from './Discovery.module.scss'
import { CincoEstrellas } from '@components/common'
// @ts-ignore
import ProfilePhoto from '@assets/img/Profile.png'

export default function Page() {
    const pageContext = usePageContext()
    const data = pageContext.data as any

    useEffect(() => {
        if (data && data.category) {
            import('@utils/analytics').then(({ trackSearch }) => {
                trackSearch(
                    data.serviceName || '',
                    data.zoneName || '',
                    (data.directMatches?.length || 0) + (data.otherMatches?.length || 0)
                )
            })
        }
    }, [data])

    if (!data || !data.category) {
        return (
            <Container className="py-5 text-center">
                <Typography variant="h4" color="error">Servicio no encontrado</Typography>
                <p className="mt-3">La categoría o zona solicitada no está disponible en este momento.</p>
                <Button variant="contained" color="success" href="/" style={{ borderRadius: '50px' }}>
                    Volver al inicio
                </Button>
            </Container>
        )
    }

    const {
        serviceName,
        rolName,
        zoneName,
        directMatches = [],
        otherMatches = [],
        faqs = []
    } = data

    // Generate FAQ JSON-LD
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map((faq: any) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
            }
        }))
    }

    // Render a comerciante card
    const renderComercianteCard = (comerciante: any) => {
        const {
            userId,
            userName = '',
            userRazonSocial = '',
            userProfession = '',
            userExperience = '',
            userDescription = '',
            userPhotoUrl = ProfilePhoto,
            userSlug,
            profileTier
        } = comerciante

        const isDestacado = profileTier === 'destacado'
        const hasFastResponse = comerciante.responseTime === 'fast' || comerciante.fastResponse === true || comerciante.isFastResponder || comerciante.userChannelUrl
        const hasVerifiedPortfolio = comerciante.portfolioVerified === true || (comerciante.userGalleryUrl && comerciante.userGalleryUrl.length > 0)

        // Public profile url
        const profileUrl = userSlug ? `/comerciante/${userSlug}` : `/app/perfil/${userId}`

        return (
            <div key={userId} className={`${styles.Card} ${isDestacado ? styles.CardDestacado : ''}`}>
                {isDestacado && (
                    <div className={styles.DestacadoBadge}>
                        <span>⭐ Destacado</span>
                    </div>
                )}
                <div className={styles.CardHeader}>
                    <img src={userPhotoUrl} alt={userName} className={styles.Avatar} />
                    <div>
                        <h3 className={styles.BusinessName}>{userRazonSocial || userName}</h3>
                        <div className={styles.Profession}>{userProfession || serviceName}</div>
                    </div>
                </div>
                <div className={styles.CardBody}>
                    {userExperience && (
                        <div className={styles.Experience}>
                            <strong>Experiencia:</strong> {userExperience}
                        </div>
                    )}
                    <CincoEstrellas />
                    
                    {(hasFastResponse || hasVerifiedPortfolio) && (
                        <div className={styles.TrustBadges}>
                            {hasFastResponse && (
                                <span className={styles.BadgeRespuestaRapida} title="Responde rápido a las consultas">
                                    ⚡ Respuesta Rápida
                                </span>
                            )}
                            {hasVerifiedPortfolio && (
                                <span className={styles.BadgePortafolioVerificado} title="Portafolio de fotos verificado">
                                    🛡️ Portafolio Verificado
                                </span>
                            )}
                        </div>
                    )}

                    <p className={styles.Description}>
                        {userDescription || 'Profesional calificado y verificado miembro del gremio Comunidad Dezzpo.'}
                    </p>
                </div>
                <div className={styles.CardFooter}>
                    <Button
                        variant="outlined"
                        className={styles.BtnOutline || ''}
                        href={profileUrl}
                    >
                        Ver Perfil
                    </Button>
                    <Button
                        variant="contained"
                        className={styles.BtnPrimary || ''}
                        href={`/nuevo-proyecto?comercianteId=${userId}&category=${serviceName}`}
                    >
                        Cotizar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.Container}>
            {/* Inject FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Hero Section */}
            <section className={styles.HeroSection}>
                <Container>
                    <h1 className={styles.HeroTitle}>
                        {rolName} en {zoneName}
                    </h1>
                    <p className={styles.HeroSubtitle}>
                        Encuentra y contacta directamente a los mejores profesionales en {serviceName.toLowerCase()} calificados de la zona de {zoneName}, Bogotá. Sin intermediarios ni costos ocultos.
                    </p>
                </Container>
            </section>

            {/* Content List */}
            <Container className="py-5">
                {/* Direct Matches */}
                <Typography variant="h2" className={styles.SectionTitle || ''}>
                    {rolName} disponibles en {zoneName}
                </Typography>

                {directMatches.length > 0 ? (
                    <div className={styles.Grid}>
                        {directMatches.map(renderComercianteCard)}
                    </div>
                ) : (
                    <div className={styles.NoResults}>
                        <Typography variant="h6">No hay profesionales registrados directamente en {zoneName}</Typography>
                        <p className="mb-0 text-muted">A continuación te mostramos profesionales disponibles en otras zonas de Bogotá que prestan servicio a domicilio.</p>
                    </div>
                )}

                {/* Other Matches */}
                {otherMatches.length > 0 && (
                    <div className="mt-5">
                        <Typography variant="h2" className={styles.SectionTitle || ''}>
                            Otros profesionales en {serviceName.toLowerCase()} en Bogotá
                        </Typography>
                        <div className={styles.Grid}>
                            {otherMatches.map(renderComercianteCard)}
                        </div>
                    </div>
                )}

                {/* FAQ Accordion Section */}
                {faqs.length > 0 && (
                    <div className={styles.FaqSection}>
                        <Typography variant="h2" className={styles.SectionTitle || ''} style={{ marginTop: 0 }}>
                            Preguntas frecuentes sobre {serviceName.toLowerCase()} en {zoneName}
                        </Typography>
                        <div>
                            {faqs.map((faq: any, idx: number) => (
                                <div key={idx} className={styles.FaqItem}>
                                    <h3 className={styles.FaqQuestion}>{faq.question}</h3>
                                    <p className={styles.FaqAnswer}>{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </div>
    )
}
