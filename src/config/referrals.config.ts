/**
 * Referral Program Catalog Configuration
 *
 * Centralized rewards catalog definition and point rules.
 */

export interface RewardCatalogItem {
    id: 'discount_membership' | 'discount_certification' | 'featured_month' | 'discount_inspection'
    name: string
    pointsCost: number
    description: string
    targetRole: 1 | 2 // 1: Propietario, 2: Comerciante
}

export const REWARD_CATALOG: readonly RewardCatalogItem[] = [
    {
        id: 'discount_membership',
        name: 'Descuento $50.000 COP en Membresía Anual',
        pointsCost: 500,
        description: 'Aplica $50.000 COP de descuento al renovar o adquirir la Membresía Anual Comerciante.',
        targetRole: 2, // Comerciante
    },
    {
        id: 'discount_certification',
        name: 'Descuento $100.000 COP en Certificación de Habilidades',
        pointsCost: 800,
        description: 'Descuento especial de $100.000 COP en la tarifa de visita técnica de certificación.',
        targetRole: 2, // Comerciante
    },
    {
        id: 'featured_month',
        name: '1 Mes de Perfil Destacado Gratis',
        pointsCost: 300,
        description: 'Resalta tu perfil en las primeras posiciones del Directorio por 30 días.',
        targetRole: 2, // Comerciante
    },
    {
        id: 'discount_inspection',
        name: 'Inspección Técnica Gratuita Propietario',
        pointsCost: 400,
        description: 'Servicio de revisión y diagnóstico inicial para tu inmueble sin costo adicional.',
        targetRole: 1, // Propietario
    },
] as const

export const REFERRAL_POINT_RULES = {
    POINTS_PER_REGISTRATION: 50,
    POINTS_PER_CONTRACT_COMPLETED: 200,
} as const
