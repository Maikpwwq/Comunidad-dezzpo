/**
 * SocialShareMenu Component
 *
 * Encapsulated floating popover for sharing links across social platforms,
 * email, native share, and one-click clipboard copy as the primary option.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TelegramIcon from '@mui/icons-material/Telegram'
import EmailIcon from '@mui/icons-material/Email'
import ShareIcon from '@mui/icons-material/Share'

import styles from './SocialShareMenu.module.scss'

export interface SocialShareMenuProps {
    /** Target URL to share/copy */
    url: string
    /** Title or heading of the shared entity */
    title?: string
    /** Description or body text */
    text?: string
    /** Subject for email sharing */
    subject?: string
    /** Whether the dropdown menu is visible */
    isOpen: boolean
    /** Callback to close the menu */
    onClose: () => void
    /** Optional ref of the triggering button to avoid closing on click */
    triggerRef?: React.RefObject<HTMLElement | null>
    /** Placement relative to anchor: 'top' | 'bottom' */
    placement?: 'top' | 'bottom'
    /** Horizontal alignment: 'left' | 'right' | 'center' */
    align?: 'left' | 'right' | 'center'
    /** Additional CSS class */
    className?: string
    /** Optional callback when URL is copied to clipboard */
    onCopied?: () => void
}

export const SocialShareMenu: React.FC<SocialShareMenuProps> = ({
    url,
    title = 'Comunidad Dezzpo',
    text = '',
    subject,
    isOpen,
    onClose,
    triggerRef,
    placement = 'top',
    align = 'right',
    className,
    onCopied,
}) => {
    const [copied, setCopied] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Handle outside clicks and Escape key
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node | null
            if (!target) return

            const clickedInsideMenu = menuRef.current?.contains(target)
            const clickedInsideTrigger = triggerRef?.current?.contains(target)

            if (!clickedInsideMenu && !clickedInsideTrigger) {
                onClose()
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
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
    }, [isOpen, onClose, triggerRef])

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current)
            }
        }
    }, [])

    const handleCopy = useCallback(
        (e?: React.MouseEvent) => {
            e?.stopPropagation()
            if (!url) return

            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    setCopied(true)
                    onCopied?.()

                    if (copyTimeoutRef.current) {
                        clearTimeout(copyTimeoutRef.current)
                    }
                    copyTimeoutRef.current = setTimeout(() => {
                        setCopied(false)
                    }, 2500)
                })
            }
        },
        [url, onCopied]
    )

    if (!isOpen || !url) return null

    const shareTitle = title || 'Comunidad Dezzpo'
    const shareSubject = subject || `${shareTitle} | Comunidad Dezzpo`
    const shareBody = text ? `${text}\n${url}` : `${shareTitle}\n${url}`

    const shareLinks = [
        {
            key: 'whatsapp',
            label: 'WhatsApp',
            icon: <WhatsAppIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnWhatsapp,
            href: `https://wa.me/?text=${encodeURIComponent(shareBody)}`,
        },
        {
            key: 'facebook',
            label: 'Facebook',
            icon: <FacebookIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnFacebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            key: 'twitter',
            label: 'X',
            icon: <TwitterIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnTwitter,
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(url)}`,
        },
        {
            key: 'linkedin',
            label: 'LinkedIn',
            icon: <LinkedInIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnLinkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
        {
            key: 'telegram',
            label: 'Telegram',
            icon: <TelegramIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnTelegram,
            href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`,
        },
        {
            key: 'email',
            label: 'Correo',
            icon: <EmailIcon sx={{ fontSize: 20 }} />,
            className: styles.ShareBtnEmail,
            href: `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(`${shareBody}`)}`,
        },
    ]

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: text || shareTitle,
                    url,
                })
                onClose()
            } catch (_) {
                /* user dismissed share sheet */
            }
        }
    }

    const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

    return (
        <div
            ref={menuRef}
            className={clsx(
                styles.ShareDropdownMenu,
                placement === 'top' ? styles.placementTop : styles.placementBottom,
                align === 'right' && styles.alignRight,
                align === 'left' && styles.alignLeft,
                align === 'center' && styles.alignCenter,
                className
            )}
            role="dialog"
            aria-label="Opciones de difusión"
        >
            <div className={styles.ShareDropdownHeader}>
                <span className={styles.ShareDropdownTitle}>Compartir en</span>
                <button
                    className={styles.ShareDropdownCloseBtn}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose()
                    }}
                    type="button"
                    aria-label="Cerrar opciones de compartir"
                >
                    ✕
                </button>
            </div>

            <div className={styles.ShareButtonsRow}>
                {/* 1. First option: Copiar Enlace al portapapeles */}
                <Tooltip title={copied ? '¡Enlace copiado!' : 'Copiar enlace'} arrow>
                    <button
                        className={clsx(
                            styles.SocialShareBtn,
                            styles.ShareBtnCopy,
                            copied && styles.copied
                        )}
                        onClick={handleCopy}
                        type="button"
                        aria-label="Copiar enlace al portapapeles"
                    >
                        {copied ? <CheckIcon sx={{ fontSize: 20 }} /> : <ContentCopyIcon sx={{ fontSize: 18 }} />}
                    </button>
                </Tooltip>

                {/* Social links */}
                {shareLinks.map((link) => (
                    <Tooltip key={link.key} title={link.label} arrow>
                        <a
                            className={clsx(styles.SocialShareBtn, link.className)}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Compartir en ${link.label}`}
                            onClick={() => onClose()}
                        >
                            {link.icon}
                        </a>
                    </Tooltip>
                ))}

                {/* Device native share */}
                {hasNativeShare && (
                    <Tooltip title="Más opciones" arrow>
                        <button
                            className={clsx(styles.SocialShareBtn, styles.ShareBtnNative)}
                            onClick={handleNativeShare}
                            type="button"
                            aria-label="Compartir con las opciones del dispositivo"
                        >
                            <ShareIcon sx={{ fontSize: 20 }} />
                        </button>
                    </Tooltip>
                )}
            </div>

            {copied && (
                <div className={styles.CopiedAlert}>
                    <CheckIcon sx={{ fontSize: 14 }} />
                    ¡Enlace copiado al portapapeles!
                </div>
            )}
        </div>
    )
}

export default SocialShareMenu
