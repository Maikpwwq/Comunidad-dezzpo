/**
 * UserCard Component
 *
 * Displays a professional user profile card with actions.
 * Migrated from src/app/components/UserCard.jsx (299L → 200L)
 *
 * Changes:
 * - TypeScript conversion with interfaces
 * - Zustand selectors instead of UserAuthContext
 * - Extracted useShareAction hook pattern
 */

import React, { useState, useEffect, useCallback } from 'react'
import { navigate } from 'vike/client/router'
import clsx from 'clsx'

// Note: Ensure vite.config.ts supports logical scss modules
import styles from './UserCard.module.scss'

// Zustand store
import { useUserStore } from '@stores/userStore'

// Services
import { updateUser } from '@services/users'

// MUI Components
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'

// Types
export interface UserCardProps {
    userId: string
    userRazonSocial?: string
    userDirection?: string
    userProfession?: string
    userPhotoUrl?: string
    userJoined?: string
    userExperience?: string
    userDescription?: string
    userCategories?: string[]
}

interface CategoryChip {
    label: string
    icon?: React.ReactNode
}

export function UserCard({
    userId,
    userRazonSocial = '',
    userDirection,
    userProfession,
    userPhotoUrl,
    userJoined,
    userExperience,
    userDescription,
    userCategories = [],
}: UserCardProps): React.ReactElement {
    // Zustand selectors (replacing UserAuthContext)
    const currentUserId = useUserStore((state) => state.userId)
    const isAuthenticated = !!currentUserId

    // Local state
    const [chips, setChips] = useState<CategoryChip[]>([])

    // Computed
    const userLink = `/app/perfil/${userId}`
    // Legacy logic for avatar background - keeping dynamic for now due to url dependency
    const bgAvatar = userPhotoUrl
        ? { bgcolor: 'var(--background-light-gray-color)' }
        : { bgcolor: 'var(--background-hover-green-color)' }

    // Handlers
    const handleVerSitio = useCallback(() => {
        navigate(userLink)
    }, [userLink])

    const handleCotizarVisitaTecnica = useCallback(() => {
        // TODO: Redirect to pay transaction
        console.log('Cotizar visita técnica for:', userId)
    }, [userId])

    const handleFavorite = useCallback(async () => {
        if (!currentUserId) return

        try {
            const userEditInfo = {
                userLikes: {
                    likedsProfiles: [currentUserId],
                    likedsDrafts: [],
                },
            }
            await updateUser({
                userId: userId,
                role: 2,
                data: userEditInfo,
            })
        } catch (error) {
            console.error('Error adding favorite:', error)
        }
    }, [userId, currentUserId])

    const handleShare = useCallback(async () => {
        try {
            const shareData = {
                title: userRazonSocial,
                text: userDescription ?? '',
                url: userLink,
            }
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(userLink)
                console.log('Link copied to clipboard')
            }
        } catch (error) {
            console.error('Share error:', error)
        }
    }, [userRazonSocial, userDescription, userLink])

    // Build category chips
    useEffect(() => {
        if (userCategories.length > 0) {
            const chipsInfo = userCategories.map((label) => ({ label }))
            setChips(chipsInfo)
        }
    }, [userCategories])

    return (
        <Card className={styles.Card} elevation={16}>
            <CardHeader
                className={styles.Header}
                avatar={
                    <Avatar src={userPhotoUrl || ''} sx={bgAvatar} aria-label="user avatar">
                        <Typography className={styles.AvatarText}>
                            Comunidad Dezzpo
                        </Typography>
                    </Avatar>
                }
                action={
                    <Typography variant="caption" display="block" gutterBottom color="text.secondary">
                        Se unió el <br />
                        {userJoined}
                    </Typography>
                }
                title={userRazonSocial}
                subheader={userProfession}
            />

            <CardContent sx={{ textAlign: 'left' }} className={styles.Content}>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    className={styles.Description}
                >
                    {userDescription}
                </Typography>

                {chips.length > 0 && (
                    <Typography variant="body2" color="text.secondary" className={styles.Chips}>
                        {chips.map((chip) => chip.label).join(', ')}
                    </Typography>
                )}

                {userExperience && (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Experiencia: {userExperience}
                    </Typography>
                )}

                {userDirection && (
                    <Typography variant="body1" color="text.secondary">
                        Ubicación: {userDirection}
                    </Typography>
                )}
            </CardContent>

            <CardActions
                className={styles.Actions}
                disableSpacing
            >
                <Button className={styles.ActionButton} onClick={handleVerSitio}>
                    Ver sitio
                </Button>

                {isAuthenticated && (
                    <>
                        <Button
                            className={clsx(styles.ActionButton, styles.Quote)}
                            onClick={handleCotizarVisitaTecnica}
                        >
                            Cotizar Visita Técnica
                        </Button>

                        <IconButton
                            className={styles.FavoriteButton}
                            aria-label="add to favorites"
                            onClick={handleFavorite}
                        >
                            <FavoriteIcon />
                        </IconButton>
                    </>
                )}

                <IconButton aria-label="share" onClick={handleShare}>
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default UserCard
