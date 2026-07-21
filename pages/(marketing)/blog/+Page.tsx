/**
 * Public Blog Portal (/blog)
 *
 * Inbound Marketing Content Hub for Propietarios and Comerciantes.
 */

import { useState, useEffect, useMemo } from 'react'
import { navigate } from 'vike/client/router'
import { Row, Col, Container, Spinner } from 'react-bootstrap'
import {
    Box,
    Typography,
    Paper,
    TextField,
    Chip,
    Avatar,
    Card,
    CardContent,
    CardMedia,
    Button,
    Tabs,
    Tab,
    InputAdornment,
    Grid,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CampaignIcon from '@mui/icons-material/Campaign'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import EngineeringIcon from '@mui/icons-material/Engineering'
import HomeWorkIcon from '@mui/icons-material/HomeWork'

import { getPublishedBlogPosts } from '@services/blogService'
import type { BlogPost } from '@services/types'

export default function Page() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<string>('all')

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            try {
                const list = await getPublishedBlogPosts()
                setPosts(list)
            } catch (err) {
                console.error('Error fetching blog posts:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const featuredPost = useMemo(() => {
        return posts.find((p) => p.featured) || posts[0] || null
    }, [posts])

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const matchesTab =
                activeTab === 'all' ||
                (activeTab === 'propietario' && post.targetAudience === 'propietario') ||
                (activeTab === 'comerciante' && post.targetAudience === 'comerciante') ||
                (activeTab === 'exito' && post.category === 'Casos de Éxito')

            const matchesSearch =
                !searchTerm.trim() ||
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesTab && matchesSearch
        })
    }, [posts, activeTab, searchTerm])

    return (
        <div className="blog-portal-wrapper">
            {/* Header Hero */}
            <Container fluid className="p-0">
                <Row
                    className="blog-titulo m-0 w-100 p-5 d-flex align-items-center"
                    style={{
                        minHeight: '280px',
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%)',
                    }}
                >
                    <Col className="text-center">
                        <Chip
                            icon={<CampaignIcon sx={{ color: '#38bdf8 !important' }} />}
                            label="Blog & Recursos de la Comunidad"
                            sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#ffffff', fontWeight: 700, mb: 2 }}
                        />
                        <h1 className="type-hero-title text-blanco text-center mb-2">Conocimiento e Inbound Dezzpo</h1>
                        <Typography variant="body1" sx={{ color: '#cbd5e1', maxWidth: 680, mx: 'auto' }}>
                            Guías paso a paso, consejos de mantenimiento, mejores prácticas para contratistas e historias de éxito de nuestra comunidad.
                        </Typography>
                    </Col>
                </Row>
            </Container>

            {/* Featured Post Banner */}
            {featuredPost && !loading && (
                <Container className="pt-5">
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            bgcolor: '#0f172a',
                            color: '#ffffff',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        }}
                    >
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src={featuredPost.coverImage}
                                    alt={featuredPost.title}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        minHeight: 320,
                                        maxHeight: 440,
                                        objectFit: 'cover',
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <Chip label="Artículo Destacado" color="primary" size="small" sx={{ fontWeight: 800 }} />
                                    <Chip label={featuredPost.category} size="small" variant="outlined" sx={{ color: '#38bdf8', borderColor: '#38bdf8' }} />
                                </Box>

                                <Typography variant="h4" fontWeight={800} sx={{ mb: 2, color: '#ffffff', lineHeight: 1.25 }}>
                                    {featuredPost.title}
                                </Typography>

                                <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3, lineHeight: 1.6 }}>
                                    {featuredPost.excerpt}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar src={featuredPost.authorAvatar} sx={{ width: 38, height: 38 }} />
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#f8fafc', lineHeight: 1 }}>
                                                {featuredPost.authorName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                {featuredPost.authorRole}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                                        sx={{ fontWeight: 700, borderRadius: 2.5, px: 3, py: 1.2 }}
                                    >
                                        Leer Guía Completa
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            )}

            {/* Filter Tabs & Search Bar */}
            <Container className="py-5">
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, val) => setActiveTab(val)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' },
                        }}
                    >
                        <Tab label={`Todos los artículos (${posts.length})`} value="all" />
                        <Tab
                            icon={<HomeWorkIcon fontSize="small" />}
                            iconPosition="start"
                            label="Para Propietarios"
                            value="propietario"
                        />
                        <Tab
                            icon={<EngineeringIcon fontSize="small" />}
                            iconPosition="start"
                            label="Para Comerciantes"
                            value="comerciante"
                        />
                        <Tab
                            icon={<VerifiedUserIcon fontSize="small" />}
                            iconPosition="start"
                            label="Casos de Éxito"
                            value="exito"
                        />
                    </Tabs>

                    <TextField
                        placeholder="Buscar artículos..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: 260 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Articles Grid */}
                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Spinner animation="border" color="primary" />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            Cargando publicaciones del blog...
                        </Typography>
                    </Box>
                ) : filteredPosts.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
                        <Typography variant="h6" fontWeight={700}>
                            No se encontraron artículos en esta categoría
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Prueba ajustando el término de búsqueda o seleccionando otra pestaña.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3.5}>
                        {filteredPosts.map((post) => {
                            const dateFormatted = post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString('es-CO', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                  })
                                : ''

                            return (
                                <Grid item key={post.id || post.slug} xs={12} sm={6} md={4}>
                                    <Card
                                        onClick={() => navigate(`/blog/${post.slug}`)}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 4,
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                            border: '1px solid #e2e8f0',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                                            },
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={post.coverImage}
                                            alt={post.title}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                                    <Chip
                                                        label={post.category}
                                                        size="small"
                                                        color={post.targetAudience === 'propietario' ? 'secondary' : 'primary'}
                                                        variant="outlined"
                                                        sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                                                    />
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                                        <AccessTimeIcon fontSize="small" sx={{ fontSize: 16 }} />
                                                        <Typography variant="caption">{post.readTimeMinutes || 5} min</Typography>
                                                    </Box>
                                                </Box>

                                                <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ mb: 1.5, lineHeight: 1.3 }}>
                                                    {post.title}
                                                </Typography>

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {post.excerpt}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {dateFormatted}
                                                </Typography>

                                                <Typography variant="caption" color="primary" fontWeight={800}>
                                                    Leer artículo →
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                )}
            </Container>
        </div>
    )
}
