/**
 * Admin Blog Publications Workbench (/admin/blog)
 *
 * Allows administrators to create, edit, manage, draft, and publish
 * Inbound Marketing articles for Propietarios and Comerciantes.
 */

import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tabs,
    Tab,
    Tooltip,
    Card,
    CardContent,
} from '@mui/material'

import ArticleIcon from '@mui/icons-material/Article'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SaveIcon from '@mui/icons-material/Save'

import {
    getAllAdminBlogPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    slugify,
} from '@services/blogService'
import type { BlogPost } from '@services/types'
import { navigate } from 'vike/client/router'

const PRESET_COVERS = [
    { label: 'Propietarios / Construcción', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Comerciantes / Equipos', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Arquitectura / Diseño', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Herramientas / Trabajo', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80' },
]

export default function Page() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    // Editing modal state
    const [editorOpen, setEditorOpen] = useState(false)
    const [activePostId, setActivePostId] = useState<string | null>(null)

    // Form fields
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [content, setContent] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [category, setCategory] = useState<'Propietarios' | 'Comerciantes' | 'Casos de Éxito' | 'Noticias'>('Propietarios')
    const [targetAudience, setTargetAudience] = useState<'propietario' | 'comerciante' | 'general'>('propietario')
    const [authorName, setAuthorName] = useState('Equipo Dezzpo')
    const [authorRole, setAuthorRole] = useState('Especialistas en Gestión Inmobiliaria')
    const [readTimeMinutes, setReadTimeMinutes] = useState(5)
    const [status, setStatus] = useState<'published' | 'draft'>('published')

    const [formTab, setFormTab] = useState<'edit' | 'preview'>('edit')

    // Delete confirm dialog
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

    // Feedback
    const [snackbar, setSnackbar] = useState<{
        open: boolean
        message: string
        severity: 'success' | 'error'
    }>({ open: false, message: '', severity: 'success' })

    const loadPosts = async () => {
        setLoading(true)
        try {
            const list = await getAllAdminBlogPosts()
            setPosts(list)
        } catch (err) {
            console.error('Error loading admin blog posts:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPosts()
    }, [])

    const handleOpenCreate = () => {
        setActivePostId(null)
        setTitle('')
        setSlug('')
        setExcerpt('')
        setContent('# Título de la Guía\n\nEscribe el contenido formateado aquí...')
        setCoverImage(PRESET_COVERS[0]!.url)
        setCategory('Propietarios')
        setTargetAudience('propietario')
        setAuthorName('Equipo Dezzpo')
        setAuthorRole('Especialistas en Gestión Inmobiliaria')
        setReadTimeMinutes(5)
        setStatus('published')
        setFormTab('edit')
        setEditorOpen(true)
    }

    const handleOpenEdit = (post: BlogPost) => {
        setActivePostId(post.id || null)
        setTitle(post.title)
        setSlug(post.slug)
        setExcerpt(post.excerpt)
        setContent(post.content)
        setCoverImage(post.coverImage)
        setCategory(post.category)
        setTargetAudience(post.targetAudience)
        setAuthorName(post.authorName)
        setAuthorRole(post.authorRole)
        setReadTimeMinutes(post.readTimeMinutes || 5)
        setStatus(post.status)
        setFormTab('edit')
        setEditorOpen(true)
    }

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return

        const finalSlug = slug.trim() ? slugify(slug) : slugify(title)

        if (activePostId) {
            // Update
            const ok = await updateBlogPost(activePostId, {
                title: title.trim(),
                slug: finalSlug,
                excerpt: excerpt.trim(),
                content: content.trim(),
                coverImage: coverImage.trim() || PRESET_COVERS[0]!.url,
                category,
                targetAudience,
                authorName: authorName.trim() || 'Equipo Dezzpo',
                authorRole: authorRole.trim() || 'Colaborador',
                readTimeMinutes: Number(readTimeMinutes) || 5,
                status,
            })
            if (ok) {
                setSnackbar({ open: true, message: '¡Artículo actualizado con éxito!', severity: 'success' })
                setEditorOpen(false)
                loadPosts()
            }
        } else {
            // Create
            const id = await createBlogPost({
                title: title.trim(),
                slug: finalSlug,
                excerpt: excerpt.trim(),
                content: content.trim(),
                coverImage: coverImage.trim() || PRESET_COVERS[0]!.url,
                category,
                targetAudience,
                authorName: authorName.trim() || 'Equipo Dezzpo',
                authorRole: authorRole.trim() || 'Colaborador',
                readTimeMinutes: Number(readTimeMinutes) || 5,
                publishedAt: new Date().toISOString(),
                status,
                viewsCount: 0,
            })
            if (id) {
                setSnackbar({ open: true, message: '¡Artículo creado y publicado!', severity: 'success' })
                setEditorOpen(false)
                loadPosts()
            }
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return
        const ok = await deleteBlogPost(deleteTargetId)
        if (ok) {
            setSnackbar({ open: true, message: 'Artículo eliminado.', severity: 'success' })
            loadPosts()
        }
        setDeleteTargetId(null)
    }

    return (
        <Box sx={{ p: { xs: 1.5, sm: 2.5, md: 3 }, maxWidth: '100%', minWidth: 0, overflowX: 'hidden' }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <ArticleIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                    <Box>
                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{ fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.125rem' } }}
                        >
                            Gestión de Blog e Inbound Marketing
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Crea, edita y gestiona guías y artículos informativos para Propietarios y Comerciantes Calificados.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{ fontWeight: 700, borderRadius: 2.5, px: 3, py: 1, width: { xs: '100%', sm: 'auto' } }}
                >
                    Nuevo Artículo
                </Button>
            </Box>

            {/* Articles List / Table */}
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Artículos Registrados ({posts.length})
                </Typography>

                {/* MOBILE CARDS (< md) */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                    {posts.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {loading ? 'Cargando artículos...' : 'No hay artículos registrados.'}
                            </Typography>
                        </Box>
                    ) : (
                        posts.map((post) => (
                            <Card
                                key={post.id || post.slug}
                                sx={{
                                    borderRadius: 2.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 'none',
                                }}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, gap: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={800} color="#0A2540" sx={{ fontSize: '0.95rem' }}>
                                            {post.title}
                                        </Typography>
                                        <Chip
                                            label={post.status === 'published' ? 'Publicado' : 'Borrador'}
                                            size="small"
                                            color={post.status === 'published' ? 'success' : 'warning'}
                                            sx={{ height: 20, fontSize: '0.68rem', flexShrink: 0 }}
                                        />
                                    </Box>

                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                        {post.excerpt}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                                        <Chip label={post.category} size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: '0.68rem' }} />
                                        <Chip
                                            label={
                                                post.targetAudience === 'propietario'
                                                    ? 'Propietarios'
                                                    : post.targetAudience === 'comerciante'
                                                    ? 'Comerciantes'
                                                    : 'General'
                                            }
                                            size="small"
                                            color={post.targetAudience === 'propietario' ? 'secondary' : 'info'}
                                            variant="outlined"
                                            sx={{ height: 20, fontSize: '0.68rem' }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            👁️ {post.viewsCount || 0} lecturas
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton size="small" onClick={() => navigate(`/blog/${post.slug}`)}>
                                                <VisibilityIcon fontSize="small" color="action" />
                                            </IconButton>
                                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(post)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => setDeleteTargetId(post.id || null)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>

                {/* DESKTOP TABLE (>= md) */}
                <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Artículo & Extracto</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Categoría</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Audiencia</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Lecturas</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {posts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        {loading ? 'Cargando artículos...' : 'No hay artículos registrados.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                posts.map((post) => (
                                    <TableRow key={post.id || post.slug}>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ maxWidth: 300 }}>
                                                {post.excerpt}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={post.category} size="small" variant="outlined" color="primary" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={
                                                    post.targetAudience === 'propietario'
                                                        ? 'Propietarios'
                                                        : post.targetAudience === 'comerciante'
                                                        ? 'Comerciantes'
                                                        : 'General'
                                                }
                                                size="small"
                                                color={post.targetAudience === 'propietario' ? 'secondary' : 'info'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={post.status === 'published' ? 'Publicado' : 'Borrador'}
                                                size="small"
                                                color={post.status === 'published' ? 'success' : 'warning'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{post.viewsCount || 0}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Ver en vivo">
                                                <IconButton size="small" onClick={() => navigate(`/blog/${post.slug}`)}>
                                                    <VisibilityIcon fontSize="small" color="action" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Editar">
                                                <IconButton size="small" onClick={() => handleOpenEdit(post)}>
                                                    <EditIcon fontSize="small" color="primary" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton size="small" onClick={() => setDeleteTargetId(post.id || null)}>
                                                    <DeleteIcon fontSize="small" color="error" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create/Edit Modal Workbench */}
            <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
                    <Typography variant="h6" fontWeight={800}>
                        {activePostId ? 'Editar Artículo' : 'Nuevo Artículo del Blog'}
                    </Typography>
                    <Tabs value={formTab} onChange={(_, v) => setFormTab(v)}>
                        <Tab label="Editor" value="edit" sx={{ fontWeight: 700 }} />
                        <Tab label="Vista Previa" value="preview" sx={{ fontWeight: 700 }} />
                    </Tabs>
                </DialogTitle>

                <DialogContent dividers>
                    {formTab === 'edit' ? (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                            <TextField
                                label="Título del Artículo"
                                fullWidth
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    if (!slug || slug === slugify(title)) {
                                        setSlug(slugify(e.target.value))
                                    }
                                }}
                                required
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="URL Slug (Permanente)"
                                        fullWidth
                                        size="small"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        helperText="Ej: guia-publicar-proyecto-propietario"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Categoría</InputLabel>
                                        <Select
                                            value={category}
                                            label="Categoría"
                                            onChange={(e) => setCategory(e.target.value as any)}
                                        >
                                            <MenuItem value="Propietarios">Propietarios</MenuItem>
                                            <MenuItem value="Comerciantes">Comerciantes</MenuItem>
                                            <MenuItem value="Casos de Éxito">Casos de Éxito</MenuItem>
                                            <MenuItem value="Noticias">Noticias</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Audiencia Destino</InputLabel>
                                        <Select
                                            value={targetAudience}
                                            label="Audiencia Destino"
                                            onChange={(e) => setTargetAudience(e.target.value as any)}
                                        >
                                            <MenuItem value="propietario">Propietarios</MenuItem>
                                            <MenuItem value="comerciante">Comerciantes</MenuItem>
                                            <MenuItem value="general">General</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <TextField
                                label="Extracto / Resumen Corto"
                                fullWidth
                                multiline
                                rows={2}
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Aparece en la tarjeta del blog y meta descripción SEO..."
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        label="URL de Imagen de Portada"
                                        fullWidth
                                        size="small"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Presets de Imagen</InputLabel>
                                        <Select
                                            value=""
                                            label="Presets de Imagen"
                                            onChange={(e) => setCoverImage(e.target.value)}
                                        >
                                            {PRESET_COVERS.map((preset) => (
                                                <MenuItem key={preset.label} value={preset.url}>
                                                    {preset.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Nombre del Autor"
                                        fullWidth
                                        size="small"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Rol del Autor"
                                        fullWidth
                                        size="small"
                                        value={authorRole}
                                        onChange={(e) => setAuthorRole(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        label="Lectura (min)"
                                        type="number"
                                        fullWidth
                                        size="small"
                                        value={readTimeMinutes}
                                        onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Estado</InputLabel>
                                        <Select
                                            value={status}
                                            label="Estado"
                                            onChange={(e) => setStatus(e.target.value as any)}
                                        >
                                            <MenuItem value="published">Publicado</MenuItem>
                                            <MenuItem value="draft">Borrador</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <TextField
                                label="Contenido del Artículo (Markdown / HTML)"
                                fullWidth
                                multiline
                                rows={12}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Usa formato Markdown con # Títulos, ## Secciones, - Listas..."
                            />
                        </Box>
                    ) : (
                        <Box sx={{ p: 2, bgcolor: '#ffffff', color: '#0f172a', minHeight: 400, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
                                {title || 'Sin Título'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                Por {authorName} ({authorRole}) • {readTimeMinutes} min de lectura
                            </Typography>
                            {coverImage && (
                                <Box
                                    component="img"
                                    src={coverImage}
                                    sx={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 3, mb: 3 }}
                                />
                            )}
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                                {content}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setEditorOpen(false)}>Cancelar</Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={!title.trim() || !content.trim()}>
                        Guardar Artículo
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete confirm dialog */}
            <Dialog open={Boolean(deleteTargetId)} onClose={() => setDeleteTargetId(null)}>
                <DialogTitle fontWeight={700}>Eliminar Artículo</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">¿Estás seguro de que deseas eliminar este artículo permanentemente?</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setDeleteTargetId(null)}>Cancelar</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}
