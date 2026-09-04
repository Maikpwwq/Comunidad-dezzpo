import { useState, useEffect, useMemo } from 'react'
import {
    Container,
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    MenuItem,
    Chip,
    Stack,
    Paper,
    ToggleButtonGroup,
    ToggleButton,
    CircularProgress,
    Snackbar,
} from '@mui/material'
import StorefrontIcon from '@mui/icons-material/Storefront'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import MapIcon from '@mui/icons-material/Map'
import SearchIcon from '@mui/icons-material/Search'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import ClearIcon from '@mui/icons-material/Clear'
import InfoIcon from '@mui/icons-material/Info'
import { zoneNames } from '@assets/data/ListadoZonas'
import { ListadoCategoriasTiendas } from '@assets/data/ListadoCategoriasTiendas'
import { getTiendas, createTienda, type TiendaDocument, type CreateTiendaInput } from '@services/tiendas'
import { TiendaCard, TiendasMap, TiendaFormModal } from '@features/tiendas'

export default function Page() {
    const [tiendas, setTiendas] = useState<TiendaDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

    // Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [selectedZone, setSelectedZone] = useState<string>('')

    // Form Modal
    const [modalOpen, setModalOpen] = useState(false)
    const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null)

    // Load Tiendas
    const loadTiendas = async () => {
        setLoading(true)
        const res = await getTiendas({ estado: 'aprobado' })
        if (res.success && res.data) {
            setTiendas(res.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadTiendas()
    }, [])

    // Filter logic
    const filteredTiendas = useMemo(() => {
        return tiendas.filter((item) => {
            // Category filter
            if (selectedCategory && !item.categorias.includes(selectedCategory)) {
                return false
            }
            // Zone filter
            if (selectedZone) {
                const targetZone = selectedZone.toLowerCase()
                const matchesZone = item.sedes.some((s) => s.zona.toLowerCase() === targetZone)
                if (!matchesZone) return false
            }
            // Search text query
            if (searchQuery.trim()) {
                const term = searchQuery.trim().toLowerCase()
                const matchesName =
                    item.nombre.toLowerCase().includes(term) ||
                    item.razonSocial?.toLowerCase().includes(term) ||
                    item.nit?.toLowerCase().includes(term)
                const matchesDesc = item.descripcion?.toLowerCase().includes(term)
                const matchesSede = item.sedes.some(
                    (s) =>
                        s.direccion.toLowerCase().includes(term) ||
                        s.nombreSede.toLowerCase().includes(term) ||
                        s.detallesUbicacion?.toLowerCase().includes(term) ||
                        s.nombreContacto?.toLowerCase().includes(term) ||
                        s.cargoContacto?.toLowerCase().includes(term)
                )
                const matchesCategorySynonym = item.categorias.some((catKey) => {
                    const catObj = ListadoCategoriasTiendas.find((c) => c.key === catKey)
                    if (!catObj) return false
                    if (catObj.label.toLowerCase().includes(term) || catObj.key.toLowerCase().includes(term)) return true
                    return catObj.synonyms?.some((syn) => syn.toLowerCase().includes(term))
                })

                if (!matchesName && !matchesDesc && !matchesSede && !matchesCategorySynonym) return false
            }
            return true
        })
    }, [tiendas, selectedCategory, selectedZone, searchQuery])

    const handleCreateTienda = async (input: CreateTiendaInput): Promise<boolean> => {
        const res = await createTienda(input)
        if (res.success) {
            setSnackbarMsg('¡Gracias! Tu sugerencia de tienda fue registrada y está pendiente de revisión.')
            loadTiendas()
            return true
        } else {
            return false
        }
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 4 } }}>
            {/* Top Bar / Header */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <StorefrontIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={800} sx={{ color: '#0A2540' }}>
                            Tiendas y Ferreterías
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                        Encuentra Ferreterías, materiales de construcción, alquiler de equipos y servicios técnicos para tus proyectos.
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    className="btn-primary"
                    startIcon={<AddBusinessIcon />}
                    onClick={() => setModalOpen(true)}
                    sx={{ textTransform: 'none', borderRadius: 2, px: 2.5, py: 1.2, fontWeight: 700 }}
                >
                    Sugerir / Registrar Tienda
                </Button>
            </Box>

            {/* Filter & View Controls */}
            <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, backgroundColor: '#ffffff' }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Text Search */}
                    <Grid item xs={12} sm={6} md={3.5}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Buscar por nombre, insumo o dirección..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                                endAdornment: searchQuery ? (
                                    <ClearIcon
                                        fontSize="small"
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => setSearchQuery('')}
                                    />
                                ) : null,
                            }}
                        />
                    </Grid>

                    {/* Category Dropdown Filter (First before Zone) */}
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Filtrar por Categoría"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Todas las categorías</em>
                            </MenuItem>
                            {ListadoCategoriasTiendas.map((cat) => (
                                <MenuItem key={cat.key} value={cat.key}>
                                    {cat.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* Zone Dropdown Filter */}
                    <Grid item xs={12} sm={6} md={2.5}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Filtrar por Zona"
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Todas las zonas</em>
                            </MenuItem>
                            {Object.entries(zoneNames).map(([slug, name]) => (
                                <MenuItem key={slug} value={slug}>
                                    {name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* View Mode Toggle */}
                    <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_, newMode) => newMode && setViewMode(newMode)}
                            size="small"
                            color="primary"
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            <ToggleButton value="grid" sx={{ flex: { xs: 1, sm: 'none' }, textTransform: 'none', px: 2, fontWeight: 600 }}>
                                <ViewModuleIcon sx={{ mr: 1 }} /> Lista
                            </ToggleButton>
                            <ToggleButton value="map" sx={{ flex: { xs: 1, sm: 'none' }, textTransform: 'none', px: 2, fontWeight: 600 }}>
                                <MapIcon sx={{ mr: 1 }} /> Mapa Interactivo
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                {/* Category Horizontal Filter Chips (Desktop Quick Match) */}
                <Box sx={{ mt: 2, display: { xs: 'none', md: 'flex' }, gap: 1, overflowX: 'auto', pb: 1, pt: 0.5 }}>
                    <Chip
                        label="Todas las Categorías"
                        clickable
                        color={selectedCategory === '' ? 'primary' : 'default'}
                        variant={selectedCategory === '' ? 'filled' : 'outlined'}
                        onClick={() => setSelectedCategory('')}
                        sx={{ fontWeight: 600 }}
                    />
                    {ListadoCategoriasTiendas.map((cat) => {
                        const isSelected = selectedCategory === cat.key
                        return (
                            <Chip
                                key={cat.key}
                                label={cat.label}
                                clickable
                                color={isSelected ? 'primary' : 'default'}
                                variant={isSelected ? 'filled' : 'outlined'}
                                onClick={() => setSelectedCategory(isSelected ? '' : cat.key)}
                                sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}
                            />
                        )
                    })}
                </Box>
            </Paper>


            {/* Content Display */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : viewMode === 'grid' ? (
                /* Card Grid View */
                filteredTiendas.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredTiendas.map((tienda) => (
                            <Grid item xs={12} sm={6} md={4} key={tienda.id}>
                                <TiendaCard tienda={tienda} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    /* Zero Result Empty State for Card Grid */
                    <Paper
                        variant="outlined"
                        sx={{ p: 5, textAlign: 'center', borderRadius: 3, backgroundColor: '#fafafa' }}
                    >
                        <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#0A2540', mb: 1 }}>
                            No encontramos tiendas registradas para esta búsqueda
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                            Puedes explorar tiendas en mapa interactivo donde buscaremos opciones en tiempo real a través de Google Maps.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                className="btn-primary"
                                startIcon={<MapIcon />}
                                onClick={() => setViewMode('map')}
                                sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                                Ver tiendas cercanas en Google Maps
                            </Button>
                            {(selectedCategory || selectedZone || searchQuery) && (
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setSelectedCategory('')
                                        setSelectedZone('')
                                        setSearchQuery('')
                                    }}
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                    Limpiar Filtros
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                )
            ) : (
                /* Interactive Map View */
                <TiendasMap
                    tiendas={filteredTiendas}
                    selectedCategory={selectedCategory}
                    selectedZone={selectedZone}
                    height="650px"
                />
            )}

            {/* Submission Modal */}
            <TiendaFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleCreateTienda}
            />

            {/* Feedback Snackbar */}
            <Snackbar
                open={Boolean(snackbarMsg)}
                autoHideDuration={6000}
                onClose={() => setSnackbarMsg(null)}
                message={snackbarMsg}
            />
        </Container>
    )
}
