/**
 * ProfileHeader Component
 * 
 * Renders the top hero section of the profile:
 * - Cover photo with action button for owner
 * - Profile avatar with upload button for owner
 * - Business / Display name with website actions
 * - Representative name, profession, experience, and star ratings
 */
import React from 'react'
import clsx from 'clsx'
import { Box, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import LinkIcon from '@mui/icons-material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { AdjuntarArchivos, CincoEstrellas } from '@components/common'
import type { UserRole } from '@services/types'
import styles from './ProfileHeader.module.scss'

export interface ProfileHeaderProps {
    userName?: string
    userRazonSocial?: string
    userContactName?: string
    userProfession?: string
    userExperience?: string
    userWebSite?: string
    userPhotoUrl?: string
    userCoverUrl?: string
    votesCount?: number
    isOwnProfile: boolean
    currentUserId?: string | null
    viewerRole?: UserRole | null
    onUpdateUserInfo: React.Dispatch<React.SetStateAction<any>>
    userInfoState: Record<string, unknown>
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    userName = '',
    userRazonSocial = '',
    userContactName = '',
    userProfession = '',
    userExperience = '',
    userWebSite = '',
    userPhotoUrl = '',
    userCoverUrl = '',
    votesCount = 0,
    isOwnProfile,
    currentUserId,
    viewerRole,
    onUpdateUserInfo,
    userInfoState
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const copyUserWebSiteLink = () => {
        if (userWebSite && typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(userWebSite)
        }
    }

    const displayName = userName || userRazonSocial || 'Usuario'

    return (
        <>
            <div
                className={clsx(styles.GreenBackground, 'col-12 w-100')}
                style={userCoverUrl ? { backgroundImage: `url(${userCoverUrl})` } : undefined}
            >
                {userCoverUrl && <div className={styles.CoverOverlay} />}

                {isOwnProfile && currentUserId && (
                    <div className={styles.CoverActionContainer}>
                        <AdjuntarArchivos
                            name="coverPhoto"
                            multiple={false}
                            idPerson={currentUserId}
                            rol={viewerRole}
                            route={`profiles/${currentUserId}`}
                            functionState={onUpdateUserInfo}
                            state={userInfoState}
                            variant="button"
                            buttonText={userCoverUrl
                                ? (isMobile ? 'Editar portada' : 'Editar imagen de portada')
                                : (isMobile ? 'Agregar + portada' : '+ Agregar imagen de portada')}
                            tooltipTitle="Recomendado: 1584 x 396 px (Aspect Ratio 4:1)"
                            aspectRatioHint="1584 x 396 px"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                                color: '#2e7d32',
                                '&:hover': {
                                    backgroundColor: '#ffffff',
                                    color: '#1b5e20',
                                }
                            }}
                        />
                    </div>
                )}

                <div className={clsx(styles.HeaderRow)}>
                    <div className={clsx(styles.ProfileImageContainer)}>
                        <img
                            src={userPhotoUrl || ''}
                            alt={`Foto de perfil de ${displayName}`}
                            className={styles.ProfileImage}
                        />

                        {isOwnProfile && currentUserId && (
                            <AdjuntarArchivos
                                name="profilePhoto"
                                multiple={false}
                                idPerson={currentUserId}
                                rol={viewerRole}
                                route={`profiles/${currentUserId}`}
                                functionState={onUpdateUserInfo}
                                state={userInfoState}
                            />
                        )}
                    </div>
                </div>
            </div>

            <Box className={clsx(styles.UserInfoBox, 'pt-4')}>
                <Typography
                    variant="h3"
                    id="userRazonSocial"
                    sx={{ maxWidth: '480px' }}
                    className={clsx(styles.BusinessName)}
                >
                    {displayName}{' '}
                    {!!userWebSite && (
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, verticalAlign: 'middle' }}>
                            <Tooltip title="Copiar sitio web">
                                <IconButton
                                    size="small"
                                    onClick={copyUserWebSiteLink}
                                    aria-label="Copiar enlace del sitio web"
                                    sx={{ color: 'inherit', p: 0.5 }}
                                >
                                    <LinkIcon
                                        fontSize="medium"
                                        className={clsx(styles.LinkIcon)}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Visitar sitio web">
                                <IconButton
                                    size="small"
                                    component="a"
                                    href={userWebSite.match(/^https?:\/\//i) ? userWebSite : `https://${userWebSite}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visitar sitio web en nueva pestaña"
                                    sx={{ color: 'inherit', p: 0.5 }}
                                >
                                    <OpenInNewIcon
                                        fontSize="medium"
                                        className={clsx(styles.LinkIcon)}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Typography>
                {userRazonSocial && userName && userRazonSocial !== userName && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: -0.5, mb: 0.5 }}>
                        {userRazonSocial}
                    </Typography>
                )}
                {userContactName && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8 }}>
                        Contacto / Representante: <strong>{userContactName}</strong>
                    </Typography>
                )}
                {userProfession && (
                    <Typography
                        variant="h5"
                        id="userProfession"
                        className={clsx(styles.Profession)}
                    >
                        {userProfession}
                    </Typography>
                )}
                {userExperience && (
                    <Typography
                        variant="body2"
                        id="userExperience"
                        className={clsx(styles.Experience)}
                    >
                        Experiencia: {userExperience}
                    </Typography>
                )}
                <CincoEstrellas />
                <span className={clsx(styles.Experience, 'fs-6')}>
                    {votesCount} Personas votaron
                </span>
            </Box>
        </>
    )
}
