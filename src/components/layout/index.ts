/**
 * Layout Components Index
 *
 * Barrel export for @components/layout/
 */

// Layout Components
export { default as Sidebar } from './Sidebar'
export { default as Navbar } from './Navbar'
export { default as Footer } from './Footer'
export { NotificationBar } from './NotificationBar'
export { ContentWrapper } from './ContentWrapper'
export { SearchBar } from './SearchBar'
export { PageContainer } from './PageContainer'

// Navigation Config
export {
    getSidebarConfig,
    getHeaderConfig,
    FOOTER_LINKS,
    SOCIAL_LINKS,
    COMERCIANTE_SIDEBAR,
    PROPIETARIO_SIDEBAR,
    GUEST_SIDEBAR,
    COMERCIANTE_HEADER,
    PROPIETARIO_HEADER,
    GUEST_HEADER,
} from './navigation.config'

// Types
export type {
    UserRole,
    NavItem,
    NavSection,
    NavUserInfo,
    SidebarProps,
    NavbarProps,
    FooterProps,
    LayoutProps,
} from './types'

export { ROLE_MAP } from './types'
