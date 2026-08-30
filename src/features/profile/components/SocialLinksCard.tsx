/**
 * SocialLinksCard Component
 * 
 * Displays external social networks and communication channels configured by the user.
 */
import React from 'react'
import clsx from 'clsx'
import { Typography } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { PLATFORM_CONFIG } from '@utilities/socialUtils'
import type { SocialLink } from '@services/types'
import styles from './SocialLinksCard.module.scss'

export interface SocialLinksCardProps {
    socialLinks?: SocialLink[]
    className?: string
}

export const SocialLinksCard: React.FC<SocialLinksCardProps> = ({
    socialLinks = [],
    className
}) => {
    const visibleLinks = socialLinks
        .filter((sl) => sl.isVisible)
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))

    if (visibleLinks.length === 0) {
        return (
            <Typography variant="body2" className="body-2" style={{ color: '#888' }}>
                No hay canales de comunicación configurados
            </Typography>
        )
    }

    return (
        <div className={clsx(styles.SocialLinksGrid, className)}>
            {visibleLinks.map((sl) => (
                <a
                    key={sl.id}
                    href={sl.url.match(/^https?:\/\//i) ? sl.url : `https://${sl.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.SocialLinkChip || ''}
                    aria-label={`Abrir ${PLATFORM_CONFIG[sl.platform]?.name || sl.platform} en nueva pestaña`}
                >
                    <span className={styles.SocialLinkChipName || ''}>
                        {PLATFORM_CONFIG[sl.platform]?.name || sl.platform}
                    </span>
                    {sl.label && (
                        <span className={styles.SocialLinkChipLabel || ''}>
                            {sl.label}
                        </span>
                    )}
                    <OpenInNewIcon fontSize="small" />
                </a>
            ))}
        </div>
    )
}
