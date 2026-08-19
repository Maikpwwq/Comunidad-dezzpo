import React, { useEffect, useState, useMemo } from 'react'
import { CategoryIcons } from '@assets/data/CategoryIcons'
import {
    Chip,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import TagFacesIcon from '@mui/icons-material/TagFaces'
import { styled } from '@mui/material/styles'
import { useAuth } from '@hooks/useAuth'
import { createCategorySuggestion } from '@services/categoriasService'

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.4),
}))

export interface CategoryItem {
    key: number
    label: string
    variant?: 'filled' | 'outlined'
    iconName?: string
    [key: string]: any
}

interface ChipsCategoriesProps {
    setUserEditInfo?: (info: any) => void
    userEditInfo?: {
        userCategories: string[]
        [key: string]: any
    }
    listadoCategorias: CategoryItem[]
    editableContent?: boolean
    saved?: boolean
    maxCategories?: number
}

/** Normalize strings for accent/case-insensitive search */
function normalizeSearchText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
}

export const ChipsCategories: React.FC<ChipsCategoriesProps> = ({
    setUserEditInfo,
    userEditInfo,
    listadoCategorias,
    editableContent = true,
    saved,
    maxCategories = 4,
}) => {
    const { currentUser } = useAuth()

    // Initialize local state based on props
    const [categoriesState, setCategoriesState] = useState<CategoryItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    // Category suggestion dialog state
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
    const [suggestedName, setSuggestedName] = useState('')
    const [suggestedArea, setSuggestedArea] = useState('')
    const [suggestedDescription, setSuggestedDescription] = useState('')
    const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false)
    const [suggestionFeedback, setSuggestionFeedback] = useState<{
        type: 'success' | 'error'
        message: string
    } | null>(null)

    // Sync state when props change or component mounts
    useEffect(() => {
        if (!listadoCategorias || listadoCategorias.length === 0) return

        if (userEditInfo?.userCategories) {
            // Editable mode: mark selected categories as 'filled'
            const initialCategories: CategoryItem[] = listadoCategorias.map((cat) => ({
                key: cat.key,
                label: cat.label,
                iconName: (cat as any).iconName,
                variant: userEditInfo.userCategories.includes(cat.label) ? 'filled' : 'outlined',
            })) as CategoryItem[]
            setCategoriesState(initialCategories)
        } else {
            // Read-only mode: show all chips as filled (no userEditInfo)
            const readOnlyCategories: CategoryItem[] = listadoCategorias.map((cat) => ({
                key: cat.key,
                label: cat.label,
                iconName: (cat as any).iconName,
                variant: 'filled' as const,
            })) as CategoryItem[]
            setCategoriesState(readOnlyCategories)
        }
    }, [listadoCategorias, userEditInfo?.userCategories, saved])

    // Filter categories by search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categoriesState
        const queryNorm = normalizeSearchText(searchQuery)
        return categoriesState.filter((cat) =>
            normalizeSearchText(cat.label).includes(queryNorm)
        )
    }, [categoriesState, searchQuery])

    // Selected categories for quick view tray
    const selectedCategories = useMemo(() => {
        return categoriesState.filter((c) => c.variant === 'filled')
    }, [categoriesState])

    // Handle toggle click
    const handleClick = (e: React.MouseEvent, key: number) => {
        e.preventDefault()
        if (!editableContent) return

        const categoryIndex = categoriesState.findIndex((c) => c.key === key)
        if (categoryIndex === -1) return

        const currentCategory = categoriesState[categoryIndex]
        if (!currentCategory) return

        const isSelected = currentCategory.variant === 'filled'
        const newCategories = [...categoriesState]

        if (!isSelected) {
            // Check limit
            const currentSelectedCount = categoriesState.filter((c) => c.variant === 'filled').length
            if (currentSelectedCount < maxCategories) {
                newCategories[categoryIndex] = { ...currentCategory, variant: 'filled' } as CategoryItem
            } else {
                return // Limit reached
            }
        } else {
            // Deselect
            newCategories[categoryIndex] = { ...currentCategory, variant: 'outlined' } as CategoryItem
        }

        setCategoriesState(newCategories)

        // Update parent
        if (setUserEditInfo && userEditInfo) {
            const selectedLabels = newCategories
                .filter((c) => c.variant === 'filled')
                .map((c) => c.label)

            setUserEditInfo({
                ...userEditInfo,
                userCategories: selectedLabels,
            })
        }
    }

    // Handle removing from selected tray
    const handleRemove = (key: number) => {
        if (!editableContent) return
        const categoryIndex = categoriesState.findIndex((c) => c.key === key)
        if (categoryIndex === -1) return

        const newCategories = [...categoriesState]
        newCategories[categoryIndex] = { ...categoriesState[categoryIndex], variant: 'outlined' } as CategoryItem
        setCategoriesState(newCategories)

        if (setUserEditInfo && userEditInfo) {
            const selectedLabels = newCategories
                .filter((c) => c.variant === 'filled')
                .map((c) => c.label)

            setUserEditInfo({
                ...userEditInfo,
                userCategories: selectedLabels,
            })
        }
    }

    // Open suggestion modal
    const handleOpenSuggestModal = (initialName = '') => {
        setSuggestedName(initialName || searchQuery.trim())
        setSuggestedArea('')
        setSuggestedDescription('')
        setSuggestionFeedback(null)
        setIsSuggestModalOpen(true)
    }

    // Submit suggestion to Firestore
    const handleSubmitSuggestion = async () => {
        if (!suggestedName.trim()) {
            setSuggestionFeedback({
                type: 'error',
                message: 'Por favor ingresa el nombre de la categoría.',
            })
            return
        }

        setIsSubmittingSuggestion(true)
        setSuggestionFeedback(null)

        try {
            await createCategorySuggestion({
                userId: currentUser?.userId || 'anonymous',
                userName: currentUser?.userName || 'Usuario Dezzpo',
                userMail: currentUser?.userMail || '',
                suggestedName: suggestedName.trim(),
                area: suggestedArea.trim() || undefined,
                description: suggestedDescription.trim() || undefined,
            })

            setSuggestionFeedback({
                type: 'success',
                message: '¡Sugerencia enviada con éxito! Nuestro equipo la revisará para incorporarla a la plataforma.',
            })

            setTimeout(() => {
                setIsSuggestModalOpen(false)
                setSuggestedName('')
                setSuggestedArea('')
                setSuggestedDescription('')
                setSuggestionFeedback(null)
            }, 2500)
        } catch (error) {
            console.error('Error creating category suggestion:', error)
            setSuggestionFeedback({
                type: 'error',
                message: 'Hubo un problema al enviar la sugerencia. Intenta de nuevo.',
            })
        } finally {
            setIsSubmittingSuggestion(false)
        }
    }

    // Read-only mode rendering (e.g. public profile)
    if (!editableContent) {
        return (
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'row !important',
                    justifyContent: 'flex-start !important',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                    width: '100% !important',
                    overflow: 'auto',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                }}
                component="ul"
            >
                {categoriesState.map((data) => {
                    const IconComponent = CategoryIcons[data.iconName as string]
                    const IconToRender =
                        data.label === 'React' ? (
                            <TagFacesIcon />
                        ) : IconComponent ? (
                            <IconComponent fontSize="medium" className="mx-2 my-1" />
                        ) : undefined
                    return (
                        <ListItem key={data.key}>
                            <Chip
                                icon={IconToRender as React.ReactElement}
                                color="primary"
                                label={data.label}
                                variant="filled"
                                disabled={true}
                            />
                        </ListItem>
                    )
                })}
            </Paper>
        )
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Search filter bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    id="search-category-input"
                    name="searchCategory"
                    size="small"
                    fullWidth
                    placeholder="Buscar categoría de servicio (ej: Pintura, Plomería, Redes, Aseo...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery ? (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Limpiar búsqueda"
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ) : null,
                    }}
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                    }}
                />
            </Box>

            {/* Selected Categories Summary Tray */}
            <Box
                sx={{
                    p: 1.25,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(46, 125, 50, 0.05)',
                    border: '1px solid rgba(46, 125, 50, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 700,
                            color: 'var(--primary-green-text-color, #2e7d32)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Categorías seleccionadas ({selectedCategories.length}/{maxCategories})
                    </Typography>
                    {selectedCategories.length === maxCategories && (
                        <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                            Máximo alcanzado
                        </Typography>
                    )}
                </Box>

                {selectedCategories.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#777', fontSize: '0.85rem' }}>
                        Haz clic en las categorías abajo para seleccionarlas (hasta {maxCategories}).
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {selectedCategories.map((cat) => {
                            const IconComponent = CategoryIcons[cat.iconName as string]
                            const IconToRender =
                                cat.label === 'React' ? (
                                    <TagFacesIcon />
                                ) : IconComponent ? (
                                    <IconComponent fontSize="small" />
                                ) : undefined
                            return (
                                <Chip
                                    key={`selected-${cat.key}`}
                                    icon={IconToRender as React.ReactElement}
                                    label={cat.label}
                                    color="primary"
                                    variant="filled"
                                    onDelete={() => handleRemove(cat.key)}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            )
                        })}
                    </Box>
                )}
            </Box>

            {/* Category selection list */}
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'row !important',
                    justifyContent: 'flex-start !important',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 1,
                    m: 0,
                    width: '100% !important',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    boxShadow: 'none',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                }}
                component="ul"
            >
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((data) => {
                        const IconComponent = CategoryIcons[data.iconName as string]
                        const IconToRender =
                            data.label === 'React' ? (
                                <TagFacesIcon />
                            ) : IconComponent ? (
                                <IconComponent fontSize="medium" className="mx-2 my-1" />
                            ) : undefined
                        const isSelected = data.variant === 'filled'
                        const isMaxReached = selectedCategories.length >= maxCategories && !isSelected

                        return (
                            <ListItem key={data.key}>
                                <Chip
                                    icon={IconToRender as React.ReactElement}
                                    color="primary"
                                    label={data.label}
                                    variant={data.variant || 'outlined'}
                                    onClick={(e) => handleClick(e, data.key)}
                                    disabled={isMaxReached}
                                    sx={{
                                        cursor: isMaxReached ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.15s ease',
                                        '&:hover': {
                                            transform: isMaxReached ? 'none' : 'translateY(-1px)',
                                        },
                                    }}
                                />
                            </ListItem>
                        )
                    })
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            py: 3,
                            px: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            No encontramos categorías que coincidan con <strong>"{searchQuery}"</strong>.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => handleOpenSuggestModal(searchQuery)}
                            sx={{ textTransform: 'none', borderRadius: '20px' }}
                        >
                            Sugerir "{searchQuery}" como nueva categoría
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Suggest New Category CTA Link */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.5 }}>
                <Button
                    size="small"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleOpenSuggestModal('')}
                    sx={{
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        color: 'var(--primary-green-text-color, #2e7d32)',
                        fontWeight: 500,
                        '&:hover': {
                            backgroundColor: 'rgba(46, 125, 50, 0.08)',
                        },
                    }}
                >
                    ¿No encuentras tu oficio o categoría? Sugiere una nueva para revisión
                </Button>
            </Box>

            {/* Category Suggestion Modal Dialog */}
            <Dialog
                open={isSuggestModalOpen}
                onClose={() => !isSubmittingSuggestion && setIsSuggestModalOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
                    Sugerir Nueva Categoría de Servicio
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1.5 }}>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        Si tu actividad comercial o técnica no está en el listado, registra tu sugerencia. Nuestro equipo administrador la revisará para incorporarla.
                    </Typography>

                    {suggestionFeedback && (
                        <Alert
                            severity={suggestionFeedback.type}
                            icon={suggestionFeedback.type === 'success' ? <CheckCircleOutlineIcon /> : undefined}
                        >
                            {suggestionFeedback.message}
                        </Alert>
                    )}

                    <TextField
                        id="suggested-category-name"
                        label="Nombre de la nueva categoría *"
                        placeholder="Ej: Instalación de Paneles Solares, Tapicería Náutica..."
                        value={suggestedName}
                        onChange={(e) => setSuggestedName(e.target.value)}
                        size="small"
                        fullWidth
                        disabled={isSubmittingSuggestion}
                        autoFocus
                    />

                    <TextField
                        id="suggested-category-area"
                        label="Área o sector relacionado (Opcional)"
                        placeholder="Ej: Energía Renovable, Decoración, Automotriz..."
                        value={suggestedArea}
                        onChange={(e) => setSuggestedArea(e.target.value)}
                        size="small"
                        fullWidth
                        disabled={isSubmittingSuggestion}
                    />

                    <TextField
                        id="suggested-category-description"
                        label="Descripción o servicios que incluye (Opcional)"
                        placeholder="Describe brevemente qué tipo de trabajos y requerimientos abarca esta categoría..."
                        value={suggestedDescription}
                        onChange={(e) => setSuggestedDescription(e.target.value)}
                        size="small"
                        multiline
                        rows={3}
                        fullWidth
                        disabled={isSubmittingSuggestion}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setIsSuggestModalOpen(false)}
                        disabled={isSubmittingSuggestion}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmitSuggestion}
                        disabled={isSubmittingSuggestion || !suggestedName.trim()}
                        variant="contained"
                        color="success"
                        startIcon={isSubmittingSuggestion ? <CircularProgress size={18} color="inherit" /> : null}
                    >
                        {isSubmittingSuggestion ? 'Enviando...' : 'Enviar Sugerencia'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ChipsCategories

