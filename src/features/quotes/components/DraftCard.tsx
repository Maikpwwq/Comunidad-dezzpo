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

import React, { useState, useCallback } from 'react'
import { navigate } from 'vike/client/router'

// Zustand store
import { useUserStore } from '@stores/userStore'

// MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import Collapse from '@mui/material/Collapse'

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
    const [expanded] = useState(false)

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
            className="card-draft d-flex pt-2 pb-2 mb-4"
            elevation={16}
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box className="w-100" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardHeader
                        className="align-items-start"
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="draft avatar">
                                CD
                            </Avatar>
                        }
                        action={
                            <Typography variant="caption" display="block" gutterBottom color="text.secondary">
                                Publicado hace {draftCreated}
                            </Typography>
                        }
                        title={draftPropietarioResidente}
                    />

                    <CardContent sx={{ textAlign: 'left' }} className="p-2">
                        <Typography variant="h6">{draftName}</Typography>
                        <Typography variant="subtitle1">{draftCategory}</Typography>
                        <Typography variant="body1">$ {draftTotal}</Typography>
                        <Typography variant="body1" color="text.secondary">
                            {draftDescription}
                        </Typography>
                    </CardContent>

                    <CardActions
                        className="d-flex p-0 pt-2 m-2 mt-0"
                        sx={{ borderTop: 'solid 1.5px' }}
                        disableSpacing
                    >
                        <Button className="body-1" onClick={handleVerRequerimiento}>
                            Ver requerimiento
                        </Button>

                        {/* Edit button - only for owner propietario */}
                        {isPropietario && isOwner && (
                            <Button
                                style={{ paddingRight: '10px' }}
                                className="body-1 w-auto"
                                onClick={handleEditar}
                            >
                                Editar
                            </Button>
                        )}

                        {/* Apply button - only for commerciantes when slots available */}
                        {isCommerciante && canApply && (
                            <Button className="btn-round btn-high body-1 w-auto" onClick={handleAplicar}>
                                Aplicar
                            </Button>
                        )}

                        <IconButton
                            style={{ marginLeft: 'auto' }}
                            aria-label="add to favorites"
                            onClick={handleFavorite}
                        >
                            <FavoriteIcon />
                        </IconButton>

                        <IconButton aria-label="share" onClick={handleShare}>
                            <ShareIcon />
                        </IconButton>
                    </CardActions>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography>Más detalles...</Typography>
                    </CardContent>
                </Collapse>
            </Box>
        </Card>
    )
}

export default DraftCard
