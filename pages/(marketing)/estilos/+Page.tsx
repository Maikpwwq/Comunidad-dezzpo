import { useState } from 'react'
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
    IconButton,
} from '@mui/material'
import PaletteIcon from '@mui/icons-material/Palette'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import StorefrontIcon from '@mui/icons-material/Storefront'
import HandymanIcon from '@mui/icons-material/Handyman'
import CloseIcon from '@mui/icons-material/Close'
import GavelIcon from '@mui/icons-material/Gavel'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import {
    ARCHITECTURAL_STYLES,
    type ArchitecturalStyle,
} from '@services/inspiration/architecturalStyles'
import { analyzeRoomRedesign, type RedesignAnalysisResult } from '@services/ai/aiRedesignService'
import { useUserStore } from '@stores/userStore'
import { navigate } from 'vike/client/router'

export default function EstilosPage() {
    const currentUserId = useUserStore((state) => state.userId)
    const [selectedStyleModal, setSelectedStyleModal] = useState<ArchitecturalStyle | null>(null)
    const [isRedesignOpen, setIsRedesignOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [areaInput, setAreaInput] = useState<number>(20)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<RedesignAnalysisResult | null>(null)
    const [analysisError, setAnalysisError] = useState<string | null>(null)

    const handleHandoff = (style: ArchitecturalStyle) => {
        const queryParams = new URLSearchParams({
            style: style.name,
            category: style.recommendedTrades[0] || 'Remodelación General',
            title: `Remodelación estilo ${style.name}`,
        })
        navigate(`/nuevo-proyecto?${queryParams.toString()}`)
    }

    const handleOpenRedesign = (style?: ArchitecturalStyle) => {
        if (style) {
            setSelectedStyleModal(style)
        }
        setAnalysisResult(null)
        setAnalysisError(null)
        setIsRedesignOpen(true)
    }

    const handleAnalyze = async () => {
        if (!currentUserId) {
            setAnalysisError('Debes iniciar sesión para ejecutar el análisis de rediseño arquitectónico.')
            return
        }

        setIsAnalyzing(true)
        setAnalysisError(null)

        try {
            const res = await analyzeRoomRedesign({
                userId: currentUserId,
                approxAreaM2: areaInput,
                ...(selectedFile ? { imageFile: selectedFile } : {}),
                ...(selectedStyleModal?.slug ? { preferredStyleSlug: selectedStyleModal.slug } : {}),
            })

            if (res.success && res.data) {
                setAnalysisResult(res.data)
            } else {
                setAnalysisError(res.error?.message || 'Error al procesar el análisis de rediseño.')
            }
        } catch (err) {
            setAnalysisError('Error inesperado al conectar con el motor de rediseño.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Chip
                    icon={<PaletteIcon style={{ color: '#0d9488' }} />}
                    label="Catálogo de Estilos & Plan B Determinista (T-I8.1)"
                    sx={{ bgcolor: '#f0fdfa', color: '#0d9488', fontWeight: 600, mb: 2 }}
                />
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{ mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}
                >
                    12 Estilos Arquitectónicos para tu Remodelación
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}>
                    Conceptos de diseño de alta tendencia en Colombia con paletas de color exactas, especificación
                    de materiales vinculados al directorio de ferreterías y tiendas de Dezzpo, y costos de referencia por m².
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={() => handleOpenRedesign(ARCHITECTURAL_STYLES[0])}
                    sx={{
                        bgcolor: '#0f172a',
                        '&:hover': { bgcolor: '#1e293b' },
                        fontWeight: 'bold',
                        px: 3,
                        py: 1.2,
                        textTransform: 'none',
                    }}
                >
                    Estudio Asistido: Analizar mi Espacio con Foto
                </Button>
            </Box>

            {/* Styles Grid */}
            <Grid container spacing={3}>
                {ARCHITECTURAL_STYLES.map((style) => (
                    <Grid item xs={12} md={6} lg={4} key={style.id}>
                        <Card
                            elevation={0}
                            sx={{
                                border: '1px solid #e2e8f0',
                                borderRadius: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'box-shadow 0.25s, transform 0.25s',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Top Badge & Title */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Chip
                                        label={style.badge}
                                        size="small"
                                        sx={{ bgcolor: '#f1f5f9', color: '#0f766e', fontWeight: 700, fontSize: '0.7rem' }}
                                    />
                                    <Typography variant="caption" sx={{ color: '#0d9488', fontWeight: 'bold' }}>
                                        ${style.typicalBudgetRange.minCopPerM2.toLocaleString('es-CO')} – $
                                        {style.typicalBudgetRange.maxCopPerM2.toLocaleString('es-CO')} {style.typicalBudgetRange.unitLabel}
                                    </Typography>
                                </Box>

                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#0f172a' }}>
                                    {style.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1.5 }}>
                                    {style.tagline}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#475569', mb: 2.5, lineHeight: 1.5, flex: 1 }}>
                                    {style.description}
                                </Typography>

                                {/* Color Swatches */}
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#334155', mb: 0.8, display: 'block' }}>
                                    Paleta de acabados:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                                    {style.palette.map((swatch, idx) => (
                                        <Box key={idx} sx={{ textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    bgcolor: swatch.hex,
                                                    border: '1px solid #cbd5e1',
                                                    mx: 'auto',
                                                    mb: 0.3,
                                                }}
                                                title={`${swatch.name} (${swatch.hex})`}
                                            />
                                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748b' }}>
                                                {swatch.usage}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                {/* Materials summary with links to Tiendas */}
                                <Typography variant="caption" fontWeight="bold" sx={{ color: '#334155', mb: 1, display: 'block' }}>
                                    Materiales en tiendas aliadas:
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    {style.keyMaterials.slice(0, 2).map((mat, idx) => (
                                        <Box key={idx} sx={{ mb: 0.8, display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                                            <StorefrontIcon sx={{ fontSize: 16, color: '#0d9488', mt: 0.2 }} />
                                            <Box>
                                                <Typography variant="caption" fontWeight="600" sx={{ color: '#0f172a', display: 'block' }}>
                                                    {mat.name}
                                                </Typography>
                                                <Button
                                                    href={`/app/tiendas?categoria=${mat.categoryTiendaKey}`}
                                                    size="small"
                                                    sx={{
                                                        p: 0,
                                                        fontSize: '0.68rem',
                                                        textTransform: 'none',
                                                        color: '#0d9488',
                                                        fontWeight: 'bold',
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    Ver proveedores de {mat.categoryTiendaLabel} →
                                                </Button>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Recommended Trades */}
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2.5 }}>
                                    {style.recommendedTrades.map((trade, idx) => (
                                        <Chip
                                            key={idx}
                                            icon={<HandymanIcon sx={{ fontSize: '12px !important' }} />}
                                            label={trade}
                                            size="small"
                                            sx={{ fontSize: '0.68rem', bgcolor: '#f8fafc' }}
                                        />
                                    ))}
                                </Box>

                                {/* Actions */}
                                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="small"
                                        onClick={() => handleHandoff(style)}
                                        sx={{
                                            bgcolor: '#0d9488',
                                            '&:hover': { bgcolor: '#0f766e' },
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        Cotizar con este estilo
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => handleOpenRedesign(style)}
                                        sx={{
                                            borderColor: '#cbd5e1',
                                            color: '#334155',
                                            textTransform: 'none',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        Simular
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* AI Redesign PoC Modal */}
            <Dialog open={isRedesignOpen} onClose={() => setIsRedesignOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: '#0f172a',
                        color: '#ffffff',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesomeIcon sx={{ color: '#2dd4bf' }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                            Estudio Asistido de Rediseño (T-I8.2)
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setIsRedesignOpen(false)} sx={{ color: '#94a3b8' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Sube una foto de tu espacio actual. El sistema aplicará stripping de metadatos EXIF en tu
                        dispositivo y estimará materiales y mano de obra con base en el estilo elegido.
                    </Typography>

                    {analysisError && (
                        <Alert severity="warning" sx={{ mb: 2, fontSize: '0.82rem' }}>
                            {analysisError}
                        </Alert>
                    )}

                    {/* Image Upload Input */}
                    <Box
                        sx={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: 2,
                            p: 2.5,
                            textAlign: 'center',
                            mb: 2,
                            bgcolor: '#f8fafc',
                        }}
                    >
                        <AddPhotoAlternateIcon sx={{ fontSize: 36, color: '#94a3b8', mb: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                            {selectedFile ? selectedFile.name : 'Selecciona una foto de tu espacio'}
                        </Typography>
                        <input
                            type="file"
                            accept="image/*"
                            id="redesign-file-input"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setSelectedFile(e.target.files[0])
                                }
                            }}
                        />
                        <label htmlFor="redesign-file-input">
                            <Button
                                component="span"
                                size="small"
                                variant="outlined"
                                sx={{ mt: 1, textTransform: 'none', color: '#0d9488', borderColor: '#0d9488' }}
                            >
                                {selectedFile ? 'Cambiar imagen' : 'Explorar archivo'}
                            </Button>
                        </label>
                    </Box>

                    {/* Area Input */}
                    <TextField
                        label="Área aproximada del espacio (m²)"
                        type="number"
                        size="small"
                        fullWidth
                        value={areaInput}
                        onChange={(e) => setAreaInput(Number(e.target.value) || 1)}
                        sx={{ mb: 2 }}
                    />

                    {/* Style Selection Info */}
                    {selectedStyleModal && (
                        <Box sx={{ p: 1.5, bgcolor: '#f0fdfa', borderRadius: 2, mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#0f766e', fontWeight: 'bold' }}>
                                Estilo seleccionado: {selectedStyleModal.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#334155' }}>
                                {selectedStyleModal.tagline}
                            </Typography>
                        </Box>
                    )}

                    {/* Analysis Result Display */}
                    {analysisResult && (
                        <Box sx={{ mt: 2, p: 2, border: '1px solid #bbf7d0', bgcolor: '#f0fdf4', borderRadius: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#166534', mb: 1 }}>
                                Diagnóstico y Recomendación de Materiales:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                                <strong>Rango estimado para {areaInput} m²:</strong> $
                                {analysisResult.estimatedCostRangeCop.minCop.toLocaleString('es-CO')} – $
                                {analysisResult.estimatedCostRangeCop.maxCop.toLocaleString('es-CO')} COP
                            </Typography>

                            <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', mb: 0.5 }}>
                                Materiales sugeridos de ferreterías aliadas:
                            </Typography>
                            {analysisResult.keyMaterials.map((mat, i) => (
                                <Typography key={i} variant="caption" sx={{ display: 'block', color: '#334155' }}>
                                    • {mat.name} ({mat.categoryTiendaLabel})
                                </Typography>
                            ))}

                            <Alert icon={<GavelIcon fontSize="inherit" />} severity="info" sx={{ mt: 2, fontSize: '0.72rem' }}>
                                {analysisResult.disclaimer}
                            </Alert>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsRedesignOpen(false)} sx={{ color: '#64748b' }}>
                        Cerrar
                    </Button>
                    {analysisResult ? (
                        <Button
                            variant="contained"
                            onClick={() => {
                                setIsRedesignOpen(false)
                                if (selectedStyleModal) handleHandoff(selectedStyleModal)
                            }}
                            sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, textTransform: 'none' }}
                        >
                            Solicitar Cotizaciones Reales
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            startIcon={isAnalyzing ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                            sx={{ bgcolor: '#0d9488', '&:hover': { bgcolor: '#0f766e' }, textTransform: 'none' }}
                        >
                            {isAnalyzing ? 'Analizando...' : 'Generar Estimación'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Container>
    )
}
