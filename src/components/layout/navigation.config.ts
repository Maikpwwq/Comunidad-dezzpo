/**
 * Navigation Configuration
 *
 * Role-based navigation items extracted from legacy Navigator.jsx and Header.jsx.
 * This centralizes all navigation data for easier maintenance.
 */

// Icon imports will be resolved at component level
// This config only stores icon names as strings

interface NavItemConfig {
    id: string
    label: string
    route: string
    icon: string
}

interface NavSectionConfig {
    id: string
    title: string
    items: NavItemConfig[]
}

/** Sidebar navigation for comerciante (professional) role */
export const COMERCIANTE_SIDEBAR: NavSectionConfig[] = [
    {
        id: 'inicio',
        title: 'Inicio',
        items: [
            { id: 'perfil', label: 'Mi cuenta', route: '/app/perfil/:userId', icon: 'PersonIcon' },
            { id: 'portal', label: 'Portal de servicios', route: '/app/portal-servicios', icon: 'StoreIcon' },
            { id: 'directorio', label: 'Directorio de Requerimientos', route: '/app/directorio-requerimientos', icon: 'DriveFileMoveIcon' },
            { id: 'notificaciones', label: 'Notificaciones', route: '/app/notificaciones', icon: 'NotificationsIcon' },
            { id: 'suscripciones', label: 'Suscripciones', route: '/app/suscripciones', icon: 'LoyaltyIcon' },
            { id: 'certificaciones', label: 'Certificaciones', route: '/app/certificaciones', icon: 'HowToRegIcon' },
            { id: 'biblioteca', label: 'Biblioteca', route: '/app/biblioteca', icon: 'CollectionsBookmarkIcon' },
            { id: 'invitar', label: 'Invitar a un Amigo', route: '/app/invitar-amigos', icon: 'CardMembershipIcon' },
            { id: 'ajustes', label: 'Ajustes', route: '/app/ajustes/:userId', icon: 'ManageAccountsIcon' },
        ],
    },
    {
        id: 'configuracion',
        title: 'Configuración',
        items: [
            { id: 'privacidad', label: 'Privacidad', route: '/app/configuracion-privacidad', icon: 'TuneIcon' },
            { id: 'pago', label: 'Formas de Pago', route: '/app/formas-pago', icon: 'PaymentIcon' },
            { id: 'clave', label: 'Cambiar Clave', route: '/app/cambiar-clave', icon: 'LockResetIcon' },
        ],
    },
]

/** Sidebar navigation for propietario (resident) role */
export const PROPIETARIO_SIDEBAR: NavSectionConfig[] = [
    {
        id: 'inicio',
        title: 'Inicio',
        items: [
            { id: 'perfil', label: 'Mi cuenta', route: '/app/perfil/:userId', icon: 'PersonIcon' },
            { id: 'portal', label: 'Portal de servicios', route: '/app/portal-servicios', icon: 'StoreIcon' },
            { id: 'directorio', label: 'Directorio de Requerimientos', route: '/app/directorio-requerimientos', icon: 'DriveFileMoveIcon' },
            { id: 'notificaciones', label: 'Notificaciones', route: '/app/notificaciones', icon: 'NotificationsIcon' },
            { id: 'suscripciones', label: 'Suscripciones', route: '/app/suscripciones', icon: 'LoyaltyIcon' },
            { id: 'biblioteca', label: 'Biblioteca', route: '/app/biblioteca', icon: 'CollectionsBookmarkIcon' },
            { id: 'invitar', label: 'Invitar a un Amigo', route: '/app/invitar-amigos', icon: 'CardMembershipIcon' },
            { id: 'ajustes', label: 'Ajustes', route: '/app/ajustes/:userId', icon: 'ManageAccountsIcon' },
        ],
    },
    {
        id: 'configuracion',
        title: 'Configuración',
        items: [
            { id: 'privacidad', label: 'Privacidad', route: '/app/configuracion-privacidad', icon: 'TuneIcon' },
            { id: 'pago', label: 'Formas de Pago', route: '/app/formas-pago', icon: 'PaymentIcon' },
            { id: 'clave', label: 'Cambiar Clave', route: '/app/cambiar-clave', icon: 'LockResetIcon' },
        ],
    },
]

/** Sidebar navigation for guest (unauthenticated) users */
export const GUEST_SIDEBAR: NavSectionConfig[] = [
    {
        id: 'inicio',
        title: 'Inicio',
        items: [
            { id: 'portal', label: 'Portal de servicios', route: '/app/portal-servicios', icon: 'StoreIcon' },
            { id: 'directorio', label: 'Directorio de Requerimientos', route: '/app/directorio-requerimientos', icon: 'DriveFileMoveIcon' },
            { id: 'suscripciones', label: 'Suscripciones', route: '/app/suscripciones', icon: 'LoyaltyIcon' },
        ],
    },
]

/** Header tabs for comerciante role */
export const COMERCIANTE_HEADER: NavItemConfig[] = [
    { id: 'perfil', label: 'Ver tu perfil', route: '/app/perfil/:userId', icon: 'PersonIcon' },
    { id: 'directorio', label: 'Directorio de Requerimientos', route: '/app/directorio-requerimientos', icon: 'DriveFileMoveIcon' },
    { id: 'mensajes', label: 'Mensajes', route: '/app/mensajes', icon: 'MessageIcon' },
    { id: 'historial', label: 'Historial de servicio', route: '/app/historial-servicios', icon: 'WorkHistoryIcon' },
    { id: 'suscripciones', label: 'Suscripciones', route: '/app/suscripciones', icon: 'LoyaltyIcon' },
    { id: 'certificaciones', label: 'Certificaciones', route: '/app/certificaciones', icon: 'HowToRegIcon' },
]

/** Header tabs for propietario role */
export const PROPIETARIO_HEADER: NavItemConfig[] = [
    { id: 'portal', label: 'Portal de servicios', route: '/app/portal-servicios', icon: 'StoreIcon' },
    { id: 'mensajes', label: 'Mensajes', route: '/app/mensajes', icon: 'MessageIcon' },
    { id: 'historial', label: 'Historial de servicio', route: '/app/historial-servicios', icon: 'WorkHistoryIcon' },
    { id: 'suscripciones', label: 'Suscripciones', route: '/app/suscripciones', icon: 'LoyaltyIcon' },
    { id: 'calificaciones', label: 'Calificaciones', route: '/app/calificaciones', icon: 'StarRateIcon' },
]

/** Header tabs for guest users */
export const GUEST_HEADER: NavItemConfig[] = [
    { id: 'login', label: 'Iniciar Sesión', route: '/ingreso', icon: 'LoginIcon' },
    { id: 'register', label: 'Registrarse', route: '/registro', icon: 'PersonAddIcon' },
]

/** Footer links for marketing pages */
export const FOOTER_LINKS = [
    { id: 'legal', label: 'Legal', href: '/legal' },
    { id: 'ayuda', label: 'Ayuda', href: '/ayuda-pqrs' },
    { id: 'patrocinadores', label: 'Patrocinadores', href: '/patrocinadores' },
    { id: 'blog', label: 'Blog', href: '/blog' },
    { id: 'contactenos', label: 'Contactenos', href: '/contactenos' },
    { id: 'mapa', label: 'Mapa del Sitio', href: '/mapa-del-sitio' },
]

/** Social media links */
export const SOCIAL_LINKS = [
    { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/comunidad_dezzpo/', icon: 'IntagramSocialIcono' },
    { id: 'twitter', label: 'Twitter', href: 'https://www.twitter.com/', icon: 'TwitterSocialIcono' },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/comunidad.dezzpo', icon: 'FacebookSocialIcono' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/dezzpo-inc/', icon: 'LinkedinSocialIcono' },
]

/** Get sidebar config based on user role */
export function getSidebarConfig(role: 'guest' | 'propietario' | 'comerciante'): NavSectionConfig[] {
    switch (role) {
        case 'comerciante':
            return COMERCIANTE_SIDEBAR
        case 'propietario':
            return PROPIETARIO_SIDEBAR
        default:
            return GUEST_SIDEBAR
    }
}

/** Get header config based on user role */
export function getHeaderConfig(role: 'guest' | 'propietario' | 'comerciante'): NavItemConfig[] {
    switch (role) {
        case 'comerciante':
            return COMERCIANTE_HEADER
        case 'propietario':
            return PROPIETARIO_HEADER
        default:
            return GUEST_HEADER
    }
}

export default {
    getSidebarConfig,
    getHeaderConfig,
    FOOTER_LINKS,
    SOCIAL_LINKS,
}
