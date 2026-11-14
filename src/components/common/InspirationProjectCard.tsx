/**
 * Inspiration Project Card Component (T-I1.2)
 *
 * Card for inspiration books and discovery galleries:
 * - Before / After interactive display
 * - "Guardar en mi tablero" action (adds to client InspirationBoard)
 * - "Cotizar con este profesional o similares" action (handoff to /nuevo-proyecto)
 */

import React, { useState } from 'react'
import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Button,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
} from '@mui/material'
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import VerifiedIcon from '@mui/icons-material/Verified'
import type { ProjectFirestoreDocument } from '@services/projects'
import { useUserStore } from '@stores/userStore'
import { getBoardsByOwner, addItemToBoard } from '@services/inspiration'
import { navigate } from 'vike/client/router'

export interface InspirationProjectCardProps {
    project: ProjectFirestoreDocument
    onSavedToBoard?: (boardId: string) => void
}

export const InspirationProjectCard: React.FC<InspirationProjectCardProps> = ({
    project,
    onSavedToBoard,
}) => {
    const currentUserId = useUserStore((state) => state.userId)
    const [isSaved, setIsSaved] = useState(false)
    const [snackMessage, setSnackMessage] = useState<string | null>(null)

    const hasPairs = project.beforeAfterPairs && project.beforeAfterPairs.length > 0
    const primaryPair = hasPairs ? project.beforeAfterPairs[0] : null
    const fallbackImage = project.galleryUrls && project.galleryUrls.length > 0 ? project.galleryUrls[0] : ''

    const handleSaveToBoard = async () => {
        if (!currentUserId) {
            setSnackMessage('Inicia sesión para guardar esta idea en tus tableros.')
            return
        }

        try {
            const boardsRes = await getBoardsByOwner(currentUserId)
            if (boardsRes.success && boardsRes.data && boardsRes.data.length > 0) {
                const targetBoard = boardsRes.data[0]
                if (!targetBoard) return
                const photoUrl = primaryPair?.afterUrl || fallbackImage || ''
                await addItemToBoard(targetBoard.boardId, {
                    type: 'project_image',
                    url: photoUrl,
                    title: project.title,
                    sourceProjectId: project.projectId,
                    notes: `Inspiración de ${project.category} (${project.zone})`,
                })
                setIsSaved(true)
                setSnackMessage(`¡Guardado en "${targetBoard.title}"!`)
                onSavedToBoard?.(targetBoard.boardId)
            } else {
                setSnackMessage('Visita tu Biblioteca para crear tu primer tablero de inspiración.')
            }
        } catch (err) {
            setSnackMessage('No se pudo guardar la idea en este momento.')
        }
    }

    const handleQuote = () => {
        const queryParams = new URLSearchParams({
            category: project.category,
            zone: project.zone,
            refProject: project.projectId,
            proponentId: project.comercianteId,
        })
        navigate(`/nuevo-proyecto?${queryParams.toString()}`)
    }

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                overflow: 'hidden',
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
            {/* Visual media */}
            {primaryPair ? (
                <Box sx={{ position: 'relative', bgcolor: '#0f172a' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                component="img"
                                src={primaryPair.beforeUrl}
                                alt="Antes"
                                sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                            />
                            <Chip
                                label="ANTES"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                }}
                            />
                        </Box>
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                component="img"
                                src={primaryPair.afterUrl}
                                alt="Después"
                                sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                            />
                            <Chip
                                label="DESPUÉS"
                                size="small"
                                color="primary"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    fontWeight: 'bold',
                                    fontSize: '0.65rem',
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            ) : fallbackImage ? (
                <Box
                    component="img"
                    src={fallbackImage}
                    alt={project.title}
                    sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
            ) : (
                <Box sx={{ height: 140, bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                        Proyecto en ejecución
                    </Typography>
                </Box>
            )}

            <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                            <Chip
                                label={project.category}
                                size="small"
                                sx={{ bgcolor: '#f0fdfa', color: '#0d9488', fontWeight: 600, fontSize: '0.72rem' }}
                            />
                            <Chip
                                label={project.zone}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.72rem' }}
                            />
                        </Box>

                        <Tooltip title={isSaved ? 'Guardado en tu tablero' : 'Guardar en mi tablero de ideas'}>
                            <IconButton size="small" onClick={handleSaveToBoard} color={isSaved ? 'primary' : 'default'}>
                                {isSaved ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 0.5, lineHeight: 1.3 }}>
                        {project.title}
                    </Typography>

                    {project.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.8,
                                fontSize: '0.84rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {project.description}
                        </Typography>
                    )}

                    {project.clientConsent?.granted && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <VerifiedIcon sx={{ fontSize: 13, color: '#0d9488' }} />
                            <Typography variant="caption" sx={{ color: '#0d9488', fontSize: '0.7rem' }}>
                                Obra autorizada por el propietario
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ pt: 2, mt: 1, borderTop: '1px solid #f1f5f9' }}>
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        startIcon={<AutoAwesomeIcon />}
                        onClick={handleQuote}
                        sx={{
                            bgcolor: '#0d9488',
                            '&:hover': { bgcolor: '#0f766e' },
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            fontSize: '0.8rem',
                        }}
                    >
                        Cotizar con este profesional o similares
                    </Button>
                </Box>
            </CardContent>

            <Snackbar
                open={Boolean(snackMessage)}
                autoHideDuration={3500}
                onClose={() => setSnackMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info" onClose={() => setSnackMessage(null)} sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </Card>
    )
}

