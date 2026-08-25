/**
 * Social Link Utilities
 *
 * Platform config, URL validation, factory, and legacy migration
 * for the Dynamic Social Identity System.
 */

import type { SocialLink, SocialPlatform } from '@services/types'

// =============================================================================
// Platform Config
// =============================================================================

export interface PlatformMeta {
    name: string
    placeholder: string
    /** Regex pattern to validate platform-specific URLs */
    pattern: RegExp
}

export const PLATFORM_CONFIG: Record<SocialPlatform, PlatformMeta> = {
    WhatsApp: {
        name: 'WhatsApp',
        placeholder: 'https://wa.me/573001234567',
        pattern: /^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i,
    },
    Instagram: {
        name: 'Instagram',
        placeholder: 'https://instagram.com/mi_cuenta',
        pattern: /^https?:\/\/(www\.)?instagram\.com\//i,
    },
    LinkedIn: {
        name: 'LinkedIn',
        placeholder: 'https://linkedin.com/in/mi-perfil',
        pattern: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\//i,
    },
    Facebook: {
        name: 'Facebook',
        placeholder: 'https://facebook.com/mi_pagina',
        pattern: /^https?:\/\/(www\.)?(facebook|fb)\.com\//i,
    },
    TikTok: {
        name: 'TikTok',
        placeholder: 'https://tiktok.com/@mi_cuenta',
        pattern: /^https?:\/\/(www\.)?tiktok\.com\/@/i,
    },
    Web: {
        name: 'Sitio Web',
        placeholder: 'https://mi-sitio.com',
        pattern: /^https?:\/\/.+/i,
    },
    X: {
        name: 'X (Twitter)',
        placeholder: 'https://x.com/mi_cuenta',
        pattern: /^https?:\/\/(www\.)?(x|twitter)\.com\//i,
    },
}

/** Ordered list of available platforms for dropdowns. */
export const PLATFORM_LIST: SocialPlatform[] = [
    'WhatsApp',
    'Instagram',
    'LinkedIn',
    'Facebook',
    'TikTok',
    'X',
    'Web',
]

// =============================================================================
// Validation
// =============================================================================

/**
 * Validate a URL against its platform-specific pattern.
 * Returns `true` if valid or if the URL is empty (optional).
 */
export function validateSocialUrl(platform: SocialPlatform, url: string): boolean {
    if (!url) return true // empty is valid (user hasn't typed yet)
    const config = PLATFORM_CONFIG[platform]
    return config.pattern.test(url)
}

// =============================================================================
// Factory
// =============================================================================

let _counter = 0

/** Generate a simple unique ID (UUID-like). */
function generateId(): string {
    _counter += 1
    return `sl_${Date.now()}_${_counter}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Create a blank social link entry with a unique ID.
 * Defaults to WhatsApp, visible, and priority 0.
 */
export function createEmptySocialLink(priority?: number): SocialLink {
    return {
        id: generateId(),
        platform: 'WhatsApp',
        url: '',
        label: '',
        isVisible: true,
        priority: priority ?? 0,
    }
}

// =============================================================================
// Legacy Migration
// =============================================================================

export interface LegacySocialFields {
    userWebSite?: string | null | undefined
    userChannelUrl?: string | null | undefined
    socialLinks?: SocialLink[] | undefined
    [key: string]: unknown
}

/**
 * Silently migrate legacy `userWebSite` / `userChannelUrl` into `socialLinks`.
 * If `socialLinks` already exists and has entries, it is returned as-is.
 * Does NOT mutate the original object.
 */
export function migrateLegacySocialFields(doc: LegacySocialFields): SocialLink[] {
    if (doc.socialLinks && doc.socialLinks.length > 0) {
        return doc.socialLinks
    }

    const migrated: SocialLink[] = []

    if (doc.userWebSite) {
        migrated.push({
            id: generateId(),
            platform: 'Web',
            url: doc.userWebSite,
            label: 'Sitio Web',
            isVisible: true,
            priority: 0,
        })
    }

    if (doc.userChannelUrl) {
        migrated.push({
            id: generateId(),
            platform: 'Web',
            url: doc.userChannelUrl,
            label: 'Canal',
            isVisible: true,
            priority: 1,
        })
    }

    return migrated
}
