/**
 * Pricing Configuration
 * Central source of truth for product rates and flat fees on Comunidad Dezzpo.
 */

export const PRICING = {
    // Annual membership fee for Comerciantes (in COP)
    COMERCIANTE_MEMBERSHIP_ANNUAL: {
        amount: 150000,
        currency: 'COP',
        description: 'Membresía Anual Calificada Comerciante',
        sku: 'MEMB-COM-ANUAL',
    },
    // Certification validation fee (technical visit & validation of skills)
    CERTIFICATION_SKILLS_VAL: {
        amount: 290000,
        currency: 'COP',
        description: 'Certificado de Validación de Habilidades (Visita Técnica)',
        sku: 'CERT-VAL-HAB',
    },
}
