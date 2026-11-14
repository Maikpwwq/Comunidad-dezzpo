/**
 * UserCard Component
 *
 * Displays a professional user profile card with actions.
 * Migrated from src/app/components/UserCard.jsx (299L → 200L)
 *
 * Changes:
 * - TypeScript conversion with interfaces
 * - Zustand selectors instead of UserAuthContext
 * - Fixed handleFavorite to update current user's likedProfiles & target merchant's favoritesCount
 * - Reusable SocialShareMenu integration with clipboard copy and social channels
 * - Real-time favorites count display
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { navigate } from 'vike/client/router'
import clsx from 'clsx'

import styles from './UserCard.module.scss'

// Zustand store
import { useUserStore } from '@stores/userStore'

// Firebase
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'
import { firestore } from '@services/firebase'
import { getOrCreateDirectChannel } from '@services/sendbird'

import { getBadgeDetails } from '@config/userClassification.config'
import { SocialShareMenu } from '@components/common/SocialShareMenu'

// MUI Components
import {
    Button,
    Avatar,
    IconButton,
    Typography,
    Snackbar,
    Chip,
    Box,
    Tooltip,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import StarIcon from '@mui/icons-material/Star'

// Types
export interface UserCardProps {
    userId: string
    userName?: string | null | undefined
    userRazonSocial?: string | undefined
    userContactName?: string | undefined
    userDirection?: string | undefined
    userProfession?: string | undefined
    userPhotoUrl?: string | undefined
    userJoined?: string | undefined
    userExperience?: string | undefined
    userDescription?: string | undefined
    userCategories?: string[] | undefined
    userClasification?: string | undefined
    userGrade?: string | undefined
    favoritesCount?: number | undefined
    likesCount?: number | undefined
    compatibilityBadge?: string | null | undefined
    compatibilityExplanation?: string | null | undefined
    variant?: 'default' | 'compact' | undefined
    reasonLabels?: readonly string[] | undefined
    isFeatured?: boolean | undefined
    onCardClick?: (() => void) | undefined
    onQuoteClick?: (() => void) | undefined
    [key: string]: unknown
}

interface CategoryChip {
    label: string
    icon?: React.ReactNode
}

export function UserCard({
    userId,
    userName = '',
    userRazonSocial = '',
    userContactName: _userContactName,
    userDirection,
    userProfession,
    userPhotoUrl,
    userJoined,
    userExperience,
    userDescription,
    userCategories = [],
    userClasification,
    userGrade: _userGrade,
    favoritesCount,
    likesCount,
    compatibilityBadge,
    compatibilityExplanation,
    variant = 'default',
    reasonLabels,
    isFeatured = false,
    onCardClick,
    onQuoteClick,
}: UserCardProps): React.ReactElement {
    // Primary display name: priority to userName (commercial name), fallback to legal userRazonSocial
    const displayName = userName || userRazonSocial || 'Comerciante'

    // Zustand selectors (atomic)
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)
    const likedProfiles = useUserStore((state) => state.likedProfiles)
    const toggleLikedProfile = useUserStore((state) => state.toggleLikedProfile)
    const isAuthenticated = !!currentUserId

    // Derived from store — survives navigation & reload
    const isLiked = likedProfiles.includes(userId)

    // Race condition guard
    const isSaving = useRef(false)
    const shareBtnRef = useRef<HTMLButtonElement | null>(null)

    // Local state
    const [chips, setChips] = useState<CategoryChip[]>([])
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [isShareOpen, setIsShareOpen] = useState(false)
    const [favCount, setFavCount] = useState<number>(() => {
        return favoritesCount ?? likesCount ?? 0
    })

    useEffect(() => {
        if (typeof favoritesCount === 'number') {
            setFavCount(favoritesCount)
        } else if (typeof likesCount === 'number') {
            setFavCount(likesCount)
        }
    }, [favoritesCount, likesCount])

    // Computed
    const userLink = `/app/perfil/${userId}`
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${userLink}` : `https://dezzpo.com${userLink}`

    const bgAvatar = userPhotoUrl
        ? { bgcolor: 'var(--background-light-gray-color)' }
        : { bgcolor: 'var(--background-hover-green-color)' }

    // Handlers
    const handleVerSitio = useCallback((e?: React.MouseEvent) => {
        onCardClick?.()
        if (e && (e.ctrlKey || e.metaKey || e.button === 1)) {
            return
        }
        if (e) {
            e.preventDefault()
        }
        navigate(userLink)
    }, [userLink, onCardClick])

    const [isCreatingChannel, setIsCreatingChannel] = useState(false)

    const handleCotizarVisitaTecnica = useCallback(async () => {
        onQuoteClick?.()
        if (!currentUserId) {
            navigate('/ingreso')
            return
        }
        try {
            setIsCreatingChannel(true)
            const channelUrl = await getOrCreateDirectChannel(currentUserId, userId, displayName)
            window.location.assign(`/app/mensajes?channel=${channelUrl}`)
        } catch (error) {
            console.error('Error creating direct channel:', error)
            setSnackMessage('Hubo un error al iniciar la conversación.')
            setSnackOpen(true)
        } finally {
            setIsCreatingChannel(false)
        }
    }, [currentUserId, userId, displayName, onQuoteClick])

    const handleFavorite = useCallback(async () => {
        if (isSaving.current) return
        if (!currentUserId) {
            navigate('/ingreso')
            return
        }

        if (!firestore || !userRole) return

        isSaving.current = true
        const wasLiked = useUserStore.getState().likedProfiles.includes(userId)

        // Optimistic: update store and local counter immediately
        toggleLikedProfile(userId)
        setFavCount((prev) => (wasLiked ? Math.max(0, prev - 1) : prev + 1))

        try {
            const collectionName = userRole === 1 ? 'usersPropietariosResidentes' : 'usersComerciantesCalificados'
            const currentUserRef = doc(firestore, collectionName, currentUserId)
            
            // 1. Update current user's likedProfiles array
            await updateDoc(currentUserRef, {
                'userLikes.likedsProfiles': wasLiked
                    ? arrayRemove(userId)
                    : arrayUnion(userId)
            })

            // 2. Update target professional's favorites count
            try {
                const targetMerchantRef = doc(firestore, 'usersComerciantesCalificados', userId)
                await updateDoc(targetMerchantRef, {
                    favoritesCount: increment(wasLiked ? -1 : 1)
                })
            } catch (merchantErr) {
                console.warn('Could not update merchant favoritesCount:', merchantErr)
            }

            setSnackMessage(wasLiked ? 'Eliminado de favoritos' : 'Guardado en favoritos')
            setSnackOpen(true)
        } catch (error) {
            // Revert optimistic update on failure
            toggleLikedProfile(userId)
            setFavCount((prev) => (wasLiked ? prev + 1 : Math.max(0, prev - 1)))
            console.error('Error updating favorites:', error)
            setSnackMessage('Error al actualizar favoritos')
            setSnackOpen(true)
        } finally {
            isSaving.current = false
        }
    }, [userId, currentUserId, userRole, toggleLikedProfile])

    // Build category chips
    useEffect(() => {
        if (userCategories.length > 0) {
            const chipsInfo = userCategories.map((label) => ({ label }))
            setChips(chipsInfo)
        }
    }, [userCategories])

    return (
        <article className={clsx(styles['professional-card'], variant === 'compact' && styles['compact-card'])}>
            <header className={styles['card-header']}>
                <Avatar
                    src={userPhotoUrl || ''}
                    sx={{
                        ...bgAvatar,
                        flexShrink: 0,
                        width: variant === 'compact' ? 44 : 56,
                        height: variant === 'compact' ? 44 : 56,
                    }}
                    aria-label="user avatar"
                >
                    <Typography className={styles['avatar-text'] || ''}>
                        Comunidad Dezzpo
                    </Typography>
                </Avatar>
                <div className={styles['card-header-info']}>
                    <h3 className={styles['text-name']} title={displayName}>
                        {displayName}
                    </h3>
                    {userRazonSocial && userName && userRazonSocial !== userName && (
                        <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                            sx={{
                                fontStyle: 'italic',
                                lineHeight: 1.2,
                                overflowWrap: 'anywhere',
                                wordBreak: 'break-word',
                            }}
                        >
                            {userRazonSocial}
                        </Typography>
                    )}
                    <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        sx={{
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                        }}
                    >
                        {userProfession || 'Profesional / Comercio'} • Se unió el {userJoined || '—'}
                    </Typography>
                    {(userClasification || compatibilityBadge || isFeatured) && (
                        <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.75, alignItems: 'center' }}>
                            {isFeatured && (
                                <Chip
                                    label="Destacado"
                                    size="small"
                                    className={styles.FeaturedChip || ''}
                                />
                            )}
                            {userClasification && (
                                <Chip
                                    label={getBadgeDetails(userClasification).name}
                                    size="small"
                                    sx={{
                                        bgcolor: getBadgeDetails(userClasification).bgLight,
                                        color: getBadgeDetails(userClasification).color,
                                        fontWeight: 700,
                                        fontSize: '0.7rem',
                                        height: 20,
                                    }}
                                />
                            )}
                            {compatibilityBadge && (
                                <Tooltip
                                    title={compatibilityExplanation || 'Perfil con afinidad técnica para tu tipo de inmueble'}
                                    arrow
                                    placement="top"
                                >
                                    <Chip
                                        icon={<StarIcon sx={{ fontSize: '0.85rem !important', color: '#b45309 !important' }} />}
                                        label={compatibilityBadge}
                                        size="small"
                                        sx={{
                                            bgcolor: '#fef3c7',
                                            color: '#92400e',
                                            fontWeight: 700,
                                            fontSize: '0.7rem',
                                            height: 20,
                                            border: '1px solid #fde68a',
                                            cursor: 'help',
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    )}
                    {reasonLabels && reasonLabels.length > 0 && (
                        <div className={styles.ReasonChipsWrapper}>
                            {reasonLabels.map((reason, idx) => (
                                <Chip
                                    key={`${reason}-${idx}`}
                                    label={reason}
                                    size="small"
                                    className={styles.ReasonChip || ''}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <div className={styles['description']}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: variant === 'compact' ? 1 : 2 }}>
                    {userDescription}
                </Typography>

                {chips.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {chips.map((chip) => chip.label).join(', ')}
                    </Typography>
                )}

                {userExperience && (
                    <Typography variant="caption" display="block" color="text.secondary">
                        Experiencia: {userExperience}
                    </Typography>
                )}

                {userDirection && (
                    <Typography variant="caption" display="block" color="text.secondary">
                        {userDirection}
                    </Typography>
                )}
            </div>

            <div className={styles['actions']}>
                <div className={styles.ActionButtonsLeft}>
                    <a
                        href={userLink}
                        className="btn-round btn-low"
                        onClick={handleVerSitio}
                        aria-label={variant === 'compact' ? `Ver perfil de ${displayName}` : `Ver sitio de ${displayName}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px 10px',
                            minHeight: 44,
                            whiteSpace: 'nowrap',
                            textTransform: 'none',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {variant === 'compact' ? 'Ver perfil' : 'Ver sitio'}
                    </a>

                    {isAuthenticated && (
                        <Button
                            className="btn-round btn-high"
                            onClick={handleCotizarVisitaTecnica}
                            size="small"
                            disabled={isCreatingChannel}
                            aria-label={`Cotizar con ${displayName}`}
                            sx={{
                                py: 0.5,
                                px: 1.5,
                                minHeight: 44,
                                textTransform: 'none',
                                fontSize: '0.8rem',
                            }}
                        >
                            {isCreatingChannel ? 'Abriendo chat...' : 'Cotizar'}
                        </Button>
                    )}
                </div>

                <div className={styles.ActionIconsRight}>
                    <Box
                        className={styles.FavoriteContainer}
                        title={favCount > 0 ? `${favCount} ${favCount === 1 ? 'favorito' : 'favoritos'}` : 'Agregar a favoritos'}
                    >
                        <IconButton
                            aria-label="add to favorites"
                            onClick={handleFavorite}
                            size="small"
                            sx={{ color: isLiked ? 'error.main' : 'action.active', minWidth: 44, minHeight: 44 }}
                        >
                            <FavoriteIcon fontSize="small" />
                        </IconButton>
                        {favCount > 0 && (
                            <span className={styles.FavoriteCount}>
                                {favCount}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.ShareWrapper}>
                        <IconButton
                            ref={shareBtnRef}
                            aria-label="share"
                            onClick={() => setIsShareOpen((prev) => !prev)}
                            size="small"
                            className={clsx(isShareOpen && styles.ShareButtonActive)}
                            sx={{ minWidth: 44, minHeight: 44 }}
                        >
                            <ShareIcon fontSize="small" />
                        </IconButton>

                        <SocialShareMenu
                            url={shareUrl}
                            title={displayName}
                            text={`Conoce el perfil profesional de ${displayName} en Comunidad Dezzpo`}
                            subject={`${displayName} — Perfil Profesional | Comunidad Dezzpo`}
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
                </div>
            </div>

            <Snackbar
                open={snackOpen}
                autoHideDuration={2000}
                onClose={() => setSnackOpen(false)}
                message={snackMessage}
            />
        </article>
    )
}

export default UserCard
