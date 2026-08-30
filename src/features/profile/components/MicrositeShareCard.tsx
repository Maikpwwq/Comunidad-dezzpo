/**
 * MicrositeShareCard Component
 * 
 * Encapsulates the vanity microsite digital card:
 * - One-click clipboard copy of canonical URL
 * - Temporary copied feedback pill
 * - Conditional floating popover/dropdown for direct social sharing (WhatsApp, FB, X, LinkedIn, Telegram, Email, WebShare)
 * - SSR-safe onClickOutside and Escape key listeners
 */
import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { Tooltip } from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShareIcon from '@mui/icons-material/Share'
import CheckIcon from '@mui/icons-material/Check'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import EmailIcon from '@mui/icons-material/Email'
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
    className
}) => {
    const [micrositeCopied, setMicrositeCopied] = useState(false)
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
    const shareMenuRef = useRef<HTMLDivElement | null>(null)
    const shareBtnRef = useRef<HTMLButtonElement | null>(null)

    // Client-only click outside & escape key handler
    useEffect(() => {
        if (!isShareMenuOpen) return

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node | null
            if (!target) return

            const clickedInsideMenu = shareMenuRef.current && shareMenuRef.current.contains(target)
            const clickedInsideBtn = shareBtnRef.current && shareBtnRef.current.contains(target)

            if (!clickedInsideMenu && !clickedInsideBtn) {
                setIsShareMenuOpen(false)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsShareMenuOpen(false)
            }
        }

        if (typeof window !== 'undefined') {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('touchstart', handleClickOutside)
            document.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            if (typeof window !== 'undefined') {
                document.removeEventListener('mousedown', handleClickOutside)
                document.removeEventListener('touchstart', handleClickOutside)
                document.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [isShareMenuOpen])

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

    const shareLinks = [
        {
            key: 'whatsapp',
            label: 'WhatsApp',
            icon: <WhatsAppIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnWhatsapp,
            href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${micrositeUrl}`)}`
        },
        {
            key: 'facebook',
            label: 'Facebook',
            icon: <FacebookIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnFacebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(micrositeUrl)}`
        },
        {
            key: 'twitter',
            label: 'X',
            icon: <TwitterIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnTwitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(micrositeUrl)}`
        },
        {
            key: 'linkedin',
            label: 'LinkedIn',
            icon: <LinkedInIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnLinkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(micrositeUrl)}`
        },
        {
            key: 'telegram',
            label: 'Telegram',
            icon: <TelegramIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnTelegram,
            href: `https://t.me/share/url?url=${encodeURIComponent(micrositeUrl)}&text=${encodeURIComponent(shareText)}`
        },
        {
            key: 'email',
            label: 'Correo',
            icon: <EmailIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnEmail,
            href: `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(`${shareText}\n\n${micrositeUrl}`)}`
        }
    ]

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: shareSubject,
                    text: shareText,
                    url: micrositeUrl
                })
            } catch (_) { /* user cancelled */ }
        }
    }

    const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

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
                    onKeyDown={(e) => { if (e.key === 'Enter') copyMicrositeUrl() }}
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

                {/* Panel de Difusión Flotante Condicional */}
                {isShareMenuOpen && (
                    <div
                        ref={shareMenuRef}
                        className={styles.ShareDropdownMenu}
                        role="dialog"
                        aria-label="Opciones de difusión"
                    >
                        <div className={styles.ShareDropdownHeader}>
                            <span className={styles.ShareDropdownTitle}>Compartir en</span>
                            <button
                                className={styles.ShareDropdownCloseBtn}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsShareMenuOpen(false)
                                }}
                                type="button"
                                aria-label="Cerrar opciones de compartir"
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.ShareButtonsRow}>
                            {shareLinks.map((link) => (
                                <Tooltip key={link.key} title={link.label} arrow>
                                    <a
                                        className={clsx(styles.SocialShareBtn, link.className)}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Compartir en ${link.label}`}
                                        onClick={() => setIsShareMenuOpen(false)}
                                    >
                                        {link.icon}
                                    </a>
                                </Tooltip>
                            ))}
                            {hasNativeShare && (
                                <Tooltip title="Más opciones" arrow>
                                    <button
                                        className={clsx(styles.SocialShareBtn, styles.ShareBtnNative)}
                                        onClick={() => {
                                            handleNativeShare()
                                            setIsShareMenuOpen(false)
                                        }}
                                        type="button"
                                        aria-label="Compartir con las opciones del dispositivo"
                                    >
                                        <ShareIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                )}
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
