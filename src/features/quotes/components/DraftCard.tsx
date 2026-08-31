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

import React, { useState, useCallback, useRef } from 'react'
import { navigate } from 'vike/client/router'
import clsx from 'clsx'

import styles from './DraftCard.module.scss'

// Zustand store
import { useUserStore } from '@stores/userStore'

// Firebase
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { firestore } from '@services/firebase'
import { getUser } from '@services/users'

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
    Snackbar,
    Chip,
    Box,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import { getBadgeDetails } from '@config/userClassification.config'
import { SocialShareMenu } from '@components/common/SocialShareMenu'

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
    draftPropietarioClassification?: string
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
    draftPropietarioClassification,
}: DraftCardProps): React.ReactElement {
    // Zustand selectors (atomic)
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)
    const savedDrafts = useUserStore((state) => state.savedDrafts)
    const toggleSavedDraft = useUserStore((state) => state.toggleSavedDraft)

    // Derived from store — survives navigation & reload
    const isLiked = savedDrafts.includes(draftId)

    // Race condition guard
    const isSaving = useRef(false)
    const shareBtnRef = useRef<HTMLButtonElement | null>(null)

    // Local state
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [ownerName, setOwnerName] = useState<string>(draftPropietarioResidente)
    const [ownerClassification, setOwnerClassification] = useState<string | undefined>(draftPropietarioClassification)

    React.useEffect(() => {
        let isMounted = true
        const fetchOwner = async () => {
            if (!draftPropietarioResidente) return
            try {
                // Propietarios are role 1
                const userData = await getUser({ userId: draftPropietarioResidente, role: 1 })
                if (isMounted) {
                    if (userData?.userName) setOwnerName(userData.userName)
                    if (userData?.userClasification) setOwnerClassification(userData.userClasification)
                }
            } catch (error) {
                console.error('Error fetching owner name', error)
            }
        }
        fetchOwner()
        return () => { isMounted = false }
    }, [draftPropietarioResidente])

    // Computed
    const draftLink = `/app/ver-requerimiento/${draftId}`
    const isOwner = draftPropietarioResidente === currentUserId
    const isPropietario = userRole === 1
    const isCommerciante = userRole === 2
    const canApply = draftApply.length < 4

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
        if (isSaving.current) return
        if (!currentUserId) {
            navigate('/ingreso')
            return
        }

        if (!firestore || !userRole) return

        isSaving.current = true
        const wasLiked = useUserStore.getState().savedDrafts.includes(draftId)

        // Optimistic: update store immediately for responsive UI
        toggleSavedDraft(draftId)

        try {
            const collectionName = userRole === 1 ? 'usersPropietariosResidentes' : 'usersComerciantesCalificados'
            const userRef = doc(firestore, collectionName, currentUserId)
            await updateDoc(userRef, {
                savedDrafts: wasLiked ? arrayRemove(draftId) : arrayUnion(draftId)
            })
            setSnackMessage(wasLiked ? 'Eliminado de favoritos' : 'Guardado en favoritos')
            setSnackOpen(true)
        } catch (error) {
            // Revert optimistic update on failure
            toggleSavedDraft(draftId)
            console.error('Error updating favorites:', error)
            setSnackMessage('Error al actualizar favoritos')
            setSnackOpen(true)
        } finally {
            isSaving.current = false
        }
    }, [draftId, currentUserId, userRole, toggleSavedDraft])

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${draftLink}` : `https://dezzpo.com${draftLink}`

    return (
        <Card
            className={clsx(styles.Card)}
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
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <span className={styles['text-owner']}>{ownerName}</span>
                        {ownerClassification && (
                            <Chip
                                label={getBadgeDetails(ownerClassification).name}
                                size="small"
                                sx={{
                                    bgcolor: getBadgeDetails(ownerClassification).bgLight,
                                    color: getBadgeDetails(ownerClassification).color,
                                    fontWeight: 700,
                                    fontSize: '0.68rem',
                                    height: 18,
                                }}
                            />
                        )}
                    </Box>
                }
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
                    Ver
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
                    <Button
                        className={clsx(styles.ApplyButton)}
                        size="small"
                        onClick={handleAplicar}
                    >
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

                <Box className={styles.ShareWrapper}>
                    <IconButton
                        ref={shareBtnRef}
                        aria-label="share"
                        onClick={() => setIsShareOpen((prev) => !prev)}
                        className={clsx(isShareOpen && styles.ShareButtonActive)}
                    >
                        <ShareIcon />
                    </IconButton>

                    <SocialShareMenu
                        url={shareUrl}
                        title={draftName}
                        text={`Mira este requerimiento en Comunidad Dezzpo: ${draftName} (${draftCategory})`}
                        subject={`Requerimiento: ${draftName} | Comunidad Dezzpo`}
                        isOpen={isShareOpen}
                        onClose={() => setIsShareOpen(false)}
                        triggerRef={shareBtnRef}
                        placement="top"
                        align="right"
                        onCopied={() => {
                            setSnackMessage('¡Enlace copiado al portapapeles!')
                            setSnackOpen(true)
                        }}
                    />
                </Box>
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
