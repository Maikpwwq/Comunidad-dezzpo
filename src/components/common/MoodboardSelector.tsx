import React, { useEffect, useState } from 'react'
import {
    Box,
    Typography,
    Card,
    CardActionArea,
    CardContent,
    Grid,
    CircularProgress,
    Button,
} from '@mui/material'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { getBoardsByOwner } from '@services/inspiration'
import type { InspirationBoard } from '@services/inspiration'

export interface MoodboardSelectorProps {
    readonly userId?: string | undefined
    readonly selectedBoardId?: string | undefined
    readonly onSelectBoard: (boardId: string | undefined) => void
}

export const MoodboardSelector: React.FC<MoodboardSelectorProps> = ({
    userId,
    selectedBoardId,
    onSelectBoard,
}) => {
    const [boards, setBoards] = useState<InspirationBoard[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!userId) {
            setBoards([])
            return
        }

        let isMounted = true
        async function fetchBoards() {
            setIsLoading(true)
            try {
                const res = await getBoardsByOwner(userId!)
                if (isMounted && res.success && res.data) {
                    setBoards(res.data)
                }
            } catch (err) {
                console.warn('[MoodboardSelector] Error loading boards:', err)
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        fetchBoards()
        return () => {
            isMounted = false
        }
    }, [userId])

    if (!userId) {
        return (
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CollectionsBookmarkIcon sx={{ color: '#0d9488', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                        Tablero de Inspiración y Referencias Visuales
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    Al registrarte o iniciar sesión podrás vincular tus tableros de fotos y acabados guardados para que los contratistas coticen con exactitud técnica.
                </Typography>
            </Box>
        )
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                <CircularProgress size={20} sx={{ color: '#0d9488' }} />
                <Typography variant="body2" color="text.secondary">
                    Cargando tus tableros de inspiración...
                </Typography>
            </Box>
        )
    }

    if (boards.length === 0) {
        return (
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CollectionsBookmarkIcon sx={{ color: '#64748b', fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                            ¿Tienes referencias visuales de acabados?
                        </Typography>
                    </Box>
                    <Button
                        size="small"
                        href="/app/biblioteca"
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ textTransform: 'none', color: '#0d9488', fontWeight: 600 }}
                    >
                        Crear tablero en Biblioteca
                    </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Puedes publicar tu requerimiento sin tablero ahora y agregar referencias más tarde en el chat con los contratistas.
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CollectionsBookmarkIcon sx={{ color: '#0d9488', fontSize: 22 }} />
                    <Typography variant="subtitle2" fontWeight="bold">
                        Vincular Tablero de Inspiración (Moodboard)
                    </Typography>
                </Box>
                {selectedBoardId && (
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => onSelectBoard(undefined)}
                        sx={{ fontSize: '0.75rem', textTransform: 'none', color: '#64748b' }}
                    >
                        Quitar selección
                    </Button>
                )}
            </Box>

            <Grid container spacing={1.5}>
                {boards.map((b) => {
                    const isSelected = selectedBoardId === b.boardId
                    const firstImage = b.items.find((it) => it.url)?.url

                    return (
                        <Grid item xs={12} sm={6} key={b.boardId}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: isSelected ? '2px solid #0d9488' : '1px solid #e2e8f0',
                                    bgcolor: isSelected ? '#f0fdfa' : '#ffffff',
                                    borderRadius: 2,
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <CardActionArea onClick={() => onSelectBoard(isSelected ? undefined : b.boardId)}>
                                    <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        {firstImage ? (
                                            <Box
                                                component="img"
                                                src={firstImage}
                                                alt={b.title}
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 1.5,
                                                    objectFit: 'cover',
                                                    flexShrink: 0,
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: 1.5,
                                                    bgcolor: '#f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <CollectionsBookmarkIcon sx={{ color: '#94a3b8', fontSize: 22 }} />
                                            </Box>
                                        )}

                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body2" fontWeight="bold" noWrap>
                                                {b.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {b.items.length} {b.items.length === 1 ? 'referencia' : 'referencias'}
                                            </Typography>
                                        </Box>

                                        {isSelected ? (
                                            <CheckCircleIcon sx={{ color: '#0d9488', fontSize: 22 }} />
                                        ) : (
                                            <RadioButtonUncheckedIcon sx={{ color: '#cbd5e1', fontSize: 22 }} />
                                        )}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}
