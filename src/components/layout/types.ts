/**
 * Navigation Configuration Types
 *
 * Strongly typed navigation structures for sidebar and header.
 * Role-based navigation is controlled via these configs.
 */

import type { ReactNode } from 'react'

/** User roles in the marketplace */
export type UserRole = 'guest' | 'propietario' | 'comerciante'

/** Numeric role mapping for legacy compatibility */
export const ROLE_MAP = {
    guest: 0,
    propietario: 1,
    comerciante: 2,
} as const

/** Single navigation item */
export interface NavItem {
    id: string
    label: string
    href: string
    icon?: ReactNode
    /** Badge count for notifications, etc. */
    badge?: number
}

/** Navigation section with grouped items */
export interface NavSection {
    id: string
    title: string
    items: NavItem[]
}

/** Auth user info for navigation display */
export interface NavUserInfo {
    userId: string
    displayName: string
    photoURL: string
    role: UserRole
}

/** Sidebar props interface */
export interface SidebarProps {
    open: boolean
    onClose: () => void
    userInfo?: NavUserInfo
    variant?: 'permanent' | 'temporary'
}

/** Navbar props interface */
export interface NavbarProps {
    onMenuToggle: () => void
    userInfo?: NavUserInfo
}

/** Footer props interface */
export interface FooterProps {
    variant?: 'marketing' | 'app'
}

/** Layout wrapper props */
export interface LayoutProps {
    children: ReactNode
    variant: 'marketing' | 'app' | 'auth'
}
