/**
 * Individual Blog Article Reader (/blog/@slug)
 *
 * Editorial reader view for blog posts with targeted CTA lead generation banners.
 */

import { useState, useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { usePageContext } from '@hooks/usePageContext'
import { Row, Col, Container, Spinner } from 'react-bootstrap'
import {
    Box,
    Typography,
    Paper,
    Chip,
    Avatar,
    Button,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ShareIcon from '@mui/icons-material/Share'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import EngineeringIcon from '@mui/icons-material/Engineering'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import { getBlogPostBySlug, incrementPostViews } from '@services/blogService'
import type { BlogPost } from '@services/types'

export default function Page() {
    const pageContext = usePageContext()
    const slug = pageContext.routeParams?.slug || ''

    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return
        const loadPost = async () => {
            setLoading(true)
            try {
                const item = await getBlogPostBySlug(slug)
                setPost(item)
                if (item?.id) {
                    incrementPostViews(item.id)
                }
            } catch (err) {
                console.error('Error loading article:', err)
            } finally {
                setLoading(false)
            }
        }
        loadPost()
    }, [slug])

    const handleShare = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            alert('¡Enlace copiado al portapapeles!')
        }
    }

    if (loading) {
        return (
            <Container className="py-5 text-center" style={{ minHeight: 400 }}>
                <Spinner animation="border" color="primary" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Cargando artículo...
                </Typography>
            </Container>
        )
    }

    if (!post) {
        return (
            <Container className="py-5 text-center" style={{ minHeight: 400 }}>
                <Paper elevation={0} sx={{ p: 6, borderRadius: 4, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                    <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                        Artículo no encontrado
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        El artículo que buscas no existe o ha sido movido.
                    </Typography>
                    <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/blog')}>
                        Volver al Blog
                    </Button>
                </Paper>
            </Container>
        )
    }

    const dateFormatted = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
          })
        : ''

    return (
        <div className="article-reader-wrapper">
            {/* Header / Meta */}
            <Box sx={{ bgcolor: '#0f172a', color: '#ffffff', py: 6 }}>
                <Container style={{ maxWidth: 860 }}>
                    <Button
                        variant="text"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/blog')}
                        sx={{ color: '#94a3b8', mb: 3, textTransform: 'none', fontWeight: 600 }}
                    >
                        Volver al Blog
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                        <Chip label={post.category} color="primary" sx={{ fontWeight: 800 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
                            <AccessTimeIcon fontSize="small" sx={{ fontSize: 16 }} />
                            <Typography variant="caption">{post.readTimeMinutes || 5} min de lectura</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                            • Publicado el {dateFormatted}
                        </Typography>
                    </Box>

                    <Typography variant="h3" fontWeight={800} sx={{ color: '#ffffff', mb: 3, lineHeight: 1.25 }}>
                        {post.title}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ color: '#cbd5e1', mb: 4, lineHeight: 1.6 }}>
                        {post.excerpt}
                    </Typography>

                    {/* Author Box */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, pt: 2, borderTop: '1px solid #334155' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={post.authorAvatar} sx={{ width: 44, height: 44, bgcolor: 'primary.main' }} />
                            <Box>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#ffffff', lineHeight: 1 }}>
                                    {post.authorName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                    {post.authorRole}
                                </Typography>
                            </Box>
                        </Box>

                        <Tooltip title="Copiar enlace del artículo">
                            <IconButton onClick={handleShare} sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}>
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Container>
            </Box>

            {/* Cover Image */}
            {post.coverImage && (
                <Container style={{ maxWidth: 960, marginTop: -32 }}>
                    <Box
                        component="img"
                        src={post.coverImage}
                        alt={post.title}
                        sx={{
                            width: '100%',
                            maxHeight: 460,
                            objectFit: 'cover',
                            borderRadius: 4,
                            boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
                        }}
                    />
                </Container>
            )}

            {/* Content Body */}
            <Container style={{ maxWidth: 840 }} className="py-5">
                <Box
                    sx={{
                        lineHeight: 1.8,
                        fontSize: '1.05rem',
                        color: '#334155',
                        '& h1': { fontSize: '2rem', fontWeight: 800, mt: 4, mb: 2, color: '#0f172a' },
                        '& h2': { fontSize: '1.4rem', fontWeight: 700, mt: 4, mb: 1.5, color: '#0f172a', borderBottom: '1px solid #e2e8f0', pb: 1 },
                        '& h3': { fontSize: '1.15rem', fontWeight: 700, mt: 3, mb: 1, color: '#1e293b' },
                        '& p': { mb: 2.5 },
                        '& ul, & ol': { mb: 2.5, pl: 3 },
                        '& li': { mb: 1 },
                        '& hr': { my: 4, borderColor: '#e2e8f0' },
                    }}
                >
                    {post.content.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                            return <Typography key={idx} variant="h4" fontWeight={800} sx={{ mt: 4, mb: 2, color: '#0f172a' }}>{line.replace('# ', '')}</Typography>
                        }
                        if (line.startsWith('## ')) {
                            return <Typography key={idx} variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1.5, color: '#0f172a', borderBottom: '1px solid #e2e8f0', pb: 0.5 }}>{line.replace('## ', '')}</Typography>
                        }
                        if (line.startsWith('- ')) {
                            return (
                                <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: 1, pl: 1 }}>
                                    <CheckCircleIcon sx={{ color: 'primary.main', fontSize: 18, mt: 0.4 }} />
                                    <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.7 }}>{line.replace('- ', '')}</Typography>
                                </Box>
                            )
                        }
                        if (line.trim() === '---') {
                            return <Divider key={idx} sx={{ my: 3 }} />
                        }
                        if (!line.trim()) return <Box key={idx} sx={{ height: 8 }} />
                        return (
                            <Typography key={idx} variant="body1" sx={{ mb: 2, color: '#334155', lineHeight: 1.8 }}>
                                {line}
                            </Typography>
                        )
                    })}
                </Box>

                {/* Dynamic Conversion CTA Banner */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 6,
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        bgcolor: post.targetAudience === 'comerciante' ? '#0f172a' : '#1e1b4b',
                        color: '#ffffff',
                        textAlign: 'center',
                    }}
                >
                    {post.targetAudience === 'comerciante' ? (
                        <>
                            <EngineeringIcon sx={{ fontSize: 48, color: '#38bdf8', mb: 1 }} />
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                                ¿Eres Profesional de la Construcción o Mantenimiento?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3, maxWidth: 600, mx: 'auto' }}>
                                Únete a la comunidad de comerciantes calificados de Dezzpo, certifícate por competencias y recibe solicitudes de proyectos en tu zona.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/comunidad-comerciantes')}
                                sx={{ fontWeight: 800, borderRadius: 2.5, px: 4, py: 1.2 }}
                            >
                                Registrarme como Comerciante Calificado
                            </Button>
                        </>
                    ) : (
                        <>
                            <HomeWorkIcon sx={{ fontSize: 48, color: '#a855f7', mb: 1 }} />
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                                ¿Tienes un Proyecto o Remodelación en Mente?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3, maxWidth: 600, mx: 'auto' }}>
                                Publica tu requerimiento gratis en Comunidad Dezzpo y recibe cotizaciones transparentes de comerciantes examinados.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/nuevo-proyecto')}
                                sx={{ fontWeight: 800, borderRadius: 2.5, px: 4, py: 1.2 }}
                            >
                                Publicar Proyecto Gratuito
                            </Button>
                        </>
                    )}
                </Paper>
            </Container>
        </div>
    )
}
