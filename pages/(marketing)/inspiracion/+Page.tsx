import { useState, useEffect } from 'react'
import {
    Container,
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import FilterListIcon from '@mui/icons-material/FilterList'
import { InspirationProjectCard } from '@components/common'
import {
    getCuratedInspirationProjects,
    buildInspirationThemeTitle,
} from '@services/inspiration'
import type { ProjectFirestoreDocument } from '@services/projects'
import { ListadoCategorias } from '@/assets/data/ListadoCategorias'
import { HOME_ZONE_OPTIONS } from '@/assets/data/ListadoZonas'
import { navigate } from 'vike/client/router'

export default function InspiracionPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [selectedZone, setSelectedZone] = useState<string>('bogota')
    const [projects, setProjects] = useState<ProjectFirestoreDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        async function fetchProjects() {
            setIsLoading(true)
            try {
                const filterParams: Parameters<typeof getCuratedInspirationProjects>[0] = {
                    limitCount: 20,
                    ...(selectedCategory ? { category: selectedCategory } : {}),
                    ...(selectedZone ? { zone: selectedZone } : {}),
                }
                const res = await getCuratedInspirationProjects(filterParams)
                if (isMounted && res.success && res.data) {
                    setProjects(res.data)
                }
            } catch (err) {
                console.warn('[Inspiracion] Error fetching:', err)
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        fetchProjects()
        return () => {
            isMounted = false
        }
    }, [selectedCategory, selectedZone])

    const pageTitle = buildInspirationThemeTitle(
        selectedCategory || 'Remodelación y Acabados',
        selectedZone
    )

    return (
        <Container maxWidth="xl" sx={{ py: 5 }}>
            {/* Hero Header */}
            <Box
                sx={{
                    textAlign: 'center',
                    py: { xs: 4, md: 6 },
                    px: 3,
                    bgcolor: '#0f172a',
                    color: 'white',
                    borderRadius: 4,
                    mb: 5,
                }}
            >
                <Chip
                    icon={<AutoAwesomeIcon style={{ color: '#2dd4bf' }} />}
                    label="Libros de Ideas UGC · Proyectos Reales"
                    sx={{ bgcolor: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', fontWeight: 600, mb: 2 }}
                />
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                    {pageTitle}
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 650, mx: 'auto', mb: 3 }}>
                    Inspírate con obras ejecutadas por contratistas verificados en Bogotá. Compara el antes y después, guarda referencias en tus tableros y cotiza con los creadores.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate('/nuevo-proyecto')}
                    sx={{
                        bgcolor: '#0d9488',
                        '&:hover': { bgcolor: '#0f766e' },
                        fontWeight: 'bold',
                        px: 3.5,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: 'none',
                    }}
                >
                    Publicar mi Requerimiento Gratis
                </Button>
            </Box>

            {/* Filter Bar */}
            <Box
                sx={{
                    p: 2.5,
                    bgcolor: '#f8fafc',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    mb: 4,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterListIcon color="action" />
                    <Typography variant="subtitle2" fontWeight="bold">
                        Filtrar por:
                    </Typography>
                </Box>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="category-filter-label">Todos los Oficios</InputLabel>
                    <Select
                        labelId="category-filter-label"
                        value={selectedCategory}
                        label="Todos los Oficios"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="">Todos los oficios</MenuItem>
                        {ListadoCategorias.slice(0, 30).map((cat) => (
                            <MenuItem key={cat.key} value={cat.label}>
                                {cat.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="zone-filter-label">Zona o Localidad</InputLabel>
                    <Select
                        labelId="zone-filter-label"
                        value={selectedZone}
                        label="Zona o Localidad"
                        onChange={(e) => setSelectedZone(e.target.value)}
                    >
                        {HOME_ZONE_OPTIONS.map((opt) => (
                            <MenuItem key={opt.slug} value={opt.slug}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {(selectedCategory || selectedZone !== 'bogota') && (
                    <Button
                        size="small"
                        onClick={() => {
                            setSelectedCategory('')
                            setSelectedZone('bogota')
                        }}
                        sx={{ textTransform: 'none', color: '#64748b' }}
                    >
                        Limpiar filtros
                    </Button>
                )}
            </Box>

            {/* Project Grid */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={36} color="primary" />
                </Box>
            ) : projects.length === 0 ? (
                <Alert severity="info" sx={{ my: 4, borderRadius: 2 }}>
                    Aún no hay proyectos estructurados en esta categoría y zona. Sé el primer profesional en publicar tus fotos Antes/Después con la <strong>Membresía Anual</strong>.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.projectId}>
                            <InspirationProjectCard project={project} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

