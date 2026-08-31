/**
 * MicrositeShareCard Component
 * 
 * Encapsulates the vanity microsite digital card:
 * - One-click clipboard copy of canonical URL
 * - Temporary copied feedback pill
 * - Conditional floating popover/dropdown for direct social sharing (WhatsApp, FB, X, LinkedIn, Telegram, Email, WebShare)
 * - SSR-safe onClickOutside and Escape key listeners
 */
import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import BadgeIcon from '@mui/icons-material/Badge'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShareIcon from '@mui/icons-material/Share'
import CheckIcon from '@mui/icons-material/Check'
import { SocialShareMenu } from '@components/common/SocialShareMenu'
import styles from './MicrositeShareCard.module.scss'

export interface MicrositeShareCardProps {
    micrositeUrl: string
    micrositeSlug: string
    profileName: string
    className?: string
}

export const MicrositeShareCard: React.FC<MicrositeShareCardProps> = ({
    micrositeUrl,
    micrositeSlug,
    profileName,
    className,
}) => {
    const [micrositeCopied, setMicrositeCopied] = useState(false)
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
    const shareBtnRef = useRef<HTMLButtonElement | null>(null)

    const copyMicrositeUrl = () => {
        if (!micrositeUrl) return
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(micrositeUrl).then(() => {
                setMicrositeCopied(true)
                setTimeout(() => setMicrositeCopied(false), 2500)
            })
        }
    }

    if (!micrositeUrl) return null

    const shareText = `Conoce el perfil profesional de ${profileName} en Comunidad Dezzpo`
    const shareSubject = `${profileName} — Perfil Profesional | Comunidad Dezzpo`

    return (
        <div className={clsx(styles.MicrositeCard, className)}>
            {/* Header row */}
            <div className={styles.MicrositeTopBar}>
                <div className={styles.MicrositeHeader}>
                    <BadgeIcon className={styles.MicrositeHeaderIcon || ''} />
                    Mi Micrositio Dezzpo
                </div>
                <span className={styles.MicrositeBadge}>
                    <VerifiedIcon sx={{ fontSize: 14 }} /> Tarjeta Digital
                </span>
            </div>

            {/* URL Row & Action Container */}
            <div className={styles.MicrositeActionContainer}>
                <div
                    className={styles.MicrositeUrlRow}
                    onClick={copyMicrositeUrl}
                    role="button"
                    tabIndex={0}
                    title="Haz clic para copiar el enlace al portapapeles"
                    aria-label="Haz clic para copiar el enlace del micrositio"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') copyMicrositeUrl()
                    }}
                >
                    <span className={styles.MicrositeUrlText}>
                        <span className={styles.MicrositeDomain}>dezzpo.com/app/perfil/</span>
                        <span className={styles.MicrositeSlug}>{micrositeSlug}</span>
                    </span>

                    {/* Botón principal Compartir */}
                    <button
                        ref={shareBtnRef}
                        className={clsx(
                            styles.MicrositeShareBtn,
                            isShareMenuOpen && styles.MicrositeShareBtnActive
                        )}
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsShareMenuOpen((prev) => !prev)
                        }}
                        type="button"
                        aria-expanded={isShareMenuOpen}
                        aria-haspopup="true"
                        aria-label="Compartir micrositio en redes sociales"
                    >
                        <ShareIcon sx={{ fontSize: 16 }} />
                        <span>Compartir</span>
                    </button>
                </div>

                {/* Panel de Difusión Flotante Compartido */}
                <SocialShareMenu
                    url={micrositeUrl}
                    title={profileName}
                    text={shareText}
                    subject={shareSubject}
                    isOpen={isShareMenuOpen}
                    onClose={() => setIsShareMenuOpen(false)}
                    triggerRef={shareBtnRef}
                    placement="bottom"
                    align="right"
                    onCopied={() => {
                        setMicrositeCopied(true)
                        setTimeout(() => setMicrositeCopied(false), 2500)
                    }}
                />
            </div>

            {/* Copied feedback pill */}
            {micrositeCopied && (
                <div className={styles.CopiedAlertPill}>
                    <CheckIcon sx={{ fontSize: 14 }} />
                    Enlace copiado al portapapeles
                </div>
            )}

            <span className={styles.MicrositeHint}>
                Comparte este enlace como tu tarjeta de presentación profesional
            </span>
        </div>
    )
}

