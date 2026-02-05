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
 */

import React, { useCallback } from 'react'
import { navigate } from 'vike/client/router'
import clsx from 'clsx'

import styles from './DraftCard.module.scss'

// Zustand store
import { useUserStore } from '@stores/userStore'

// MUI Components
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography
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
}: DraftCardProps): React.ReactElement {
    // Zustand selectors (replacing UserAuthContext)
    const currentUserId = useUserStore((state) => state.userId)
    const userRole = useUserStore((state) => state.rol)

    // Local state


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

    const handleFavorite = useCallback(() => {
        // TODO: Implement favorite functionality
        console.log('Add to favorites:', draftId)
    }, [draftId])

    const handleShare = useCallback(async () => {
        try {
            const shareData = {
                title: draftName,
                text: draftDescription,
                url: draftLink,
            }
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(draftLink)
                console.log('Link copied to clipboard')
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
                >
                    <FavoriteIcon />
                </IconButton>

                <IconButton aria-label="share" onClick={handleShare}>
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default DraftCard
