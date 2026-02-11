/**
 * DraftCard Component
 *
 * Displays a project draft/requirement card with actions.
 * Migrated from src/app/components/DraftCard.jsx (289L → 190L)
 *
 * Changes:
 * - TypeScript conversion with interfaces
 * - Zustand selectors instead of UserAuthContext
 * - Removed unused commented code
 * - Improved share fallback
 * - Functional handleFavorite with Firestore toggle
 */

import React, { useState, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import clsx from 'clsx'

import styles from './DraftCard.module.scss'

// Zustand store
import { useUserStore } from '@stores/userStore'

// Firebase
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { firestore } from '@services/firebase'

// MUI Components
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Snackbar
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'

// Types
export interface DraftCardProps {
    draftId: string
    draftPropietarioResidente: string
    draftName: string
    draftDescription: string
    draftTotal: number
    draftCategory: string
    draftCreated?: string
    draftApply?: string[]
    isLiked?: boolean
}

export function DraftCard({
    draftId,
    draftPropietarioResidente,
    draftName,
    draftDescription,
    draftTotal,
    draftCategory,
    draftCreated,
    draftApply = [],
    isLiked: initialIsLiked = false,
}: DraftCardProps): React.ReactElement {
    // Zustand selectors (replacing UserAuthContext)
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)

    // Local state
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')

    // Computed
    const draftLink = `/app/ver-requerimiento/${draftId}`
    const isOwner = draftPropietarioResidente === currentUserId
    const isPropietario = userRole === 1
    const isCommerciante = userRole === 2
    const canApply = draftApply.length < 4

    // Determine collection name based on user role
    const getUserCollection = (role: number | null): string => {
        return role === 1 ? 'usersPropietariosResidentes' : 'usersComerciantesCalificados'
    }

    // Handlers
    const handleVerRequerimiento = useCallback(() => {
        navigate(draftLink)
    }, [draftLink])

    const handleAplicar = useCallback(() => {
        navigate(`/app/cotizacion/${draftId}`)
    }, [draftId])

    const handleEditar = useCallback(() => {
        navigate(`/app/editar-requerimiento/${draftId}`)
    }, [draftId])

    const handleFavorite = useCallback(async () => {
        if (!currentUserId) {
            navigate('/sign-in')
            return
        }

        if (!firestore || !userRole) return

        const collectionName = getUserCollection(userRole)
        const userRef = doc(firestore, collectionName, currentUserId)

        try {
            await updateDoc(userRef, {
                savedDrafts: isLiked ? arrayRemove(draftId) : arrayUnion(draftId)
            })
            setIsLiked(!isLiked)
            setSnackMessage(isLiked ? 'Eliminado de favoritos' : 'Guardado en favoritos')
            setSnackOpen(true)
        } catch (error) {
            console.error('Error updating favorites:', error)
            setSnackMessage('Error al actualizar favoritos')
            setSnackOpen(true)
        }
    }, [draftId, currentUserId, isLiked, userRole])

    const handleShare = useCallback(async () => {
        try {
            const shareData = {
                title: draftName,
                text: draftDescription,
                url: window.location.origin + draftLink,
            }
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(shareData.url)
                setSnackMessage('¡Enlace copiado!')
                setSnackOpen(true)
            }
        } catch (error) {
            console.error('Share error:', error)
        }
    }, [draftName, draftDescription, draftLink])

    return (
        <Card
            className={clsx(styles.Card)}
        // Elevation removed for modern shadow
        >
            <CardHeader
                className={clsx(styles.Header)}
                avatar={
                    <Avatar className={clsx(styles.Avatar)} aria-label="draft avatar">
                        CD
                    </Avatar>
                }
                action={
                    <Typography variant="caption" display="block" gutterBottom color="text.secondary">
                        Publicado hace {draftCreated}
                    </Typography>
                }
                title={<span className={styles['text-owner']}>{draftPropietarioResidente}</span>}
            />

            <CardContent className={clsx(styles.Content)}>
                <h4 className={styles['text-title']}>{draftName}</h4>
                <div className={styles['tag-category']}>{draftCategory}</div>
                <p className={styles['text-price']}>$ {draftTotal}</p>
                <p className={styles['text-description']}>
                    {draftDescription}
                </p>
            </CardContent>

            <CardActions
                className={clsx(styles.Actions)}
                disableSpacing
            >
                <Button className={clsx(styles['btn-text'])} onClick={handleVerRequerimiento}>
                    Ver requerimiento
                </Button>

                {/* Edit button - only for owner propietario */}
                {isPropietario && isOwner && (
                    <Button
                        className={clsx(styles['btn-text'])}
                        onClick={handleEditar}
                    >
                        Editar
                    </Button>
                )}

                {/* Apply button - only for commerciantes when slots available */}
                {isCommerciante && canApply && (
                    <Button className="btn-primary-gradient btn-round" size="small" onClick={handleAplicar}>
                        Aplicar
                    </Button>
                )}

                <IconButton
                    className={clsx(styles.FavoriteButton)}
                    aria-label="add to favorites"
                    onClick={handleFavorite}
                    sx={{ color: isLiked ? 'error.main' : 'action.active' }}
                >
                    <FavoriteIcon />
                </IconButton>

                <IconButton aria-label="share" onClick={handleShare}>
                    <ShareIcon />
                </IconButton>
            </CardActions>

            <Snackbar
                open={snackOpen}
                autoHideDuration={2000}
                onClose={() => setSnackOpen(false)}
                message={snackMessage}
            />
        </Card>
    )
}

export default DraftCard
