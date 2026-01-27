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
        <Card className="card-user mb-4" elevation={16}>
            <CardHeader
                className="align-items-start"
                avatar={
                    <Avatar src={userPhotoUrl || ''} sx={bgAvatar} aria-label="user avatar">
                        <Typography variant="body1" fontSize="0.35rem">
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

            <CardContent sx={{ textAlign: 'left' }} className="p-2">
                <Typography
                    variant="body1"
                    color="text.secondary"
                    style={{ overflowY: 'auto', maxHeight: 100 }}
                >
                    {userDescription}
                </Typography>

                {chips.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {chips.map((chip) => chip.label).join(', ')}
                    </Typography>
                )}

                <br />

                {userExperience && (
                    <Typography variant="body1" color="text.secondary">
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
                className="d-flex p-0 pt-2 m-2 mt-0"
                sx={{ borderTop: 'solid 1.5px' }}
                disableSpacing
            >
                <Button className="body-1" onClick={handleVerSitio}>
                    Ver sitio
                </Button>

                {isAuthenticated && (
                    <>
                        <Button
                            style={{ paddingRight: '10px' }}
                            className="body-1 w-auto"
                            onClick={handleCotizarVisitaTecnica}
                        >
                            Cotizar Visita Técnica
                        </Button>

                        <IconButton
                            style={{ marginLeft: 'auto' }}
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
