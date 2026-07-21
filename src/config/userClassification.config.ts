/**
 * User Classification & Ranking Configuration
 *
 * Defines the tiers, badges, colors, and criteria for:
 * 1. Comerciante Calificado (Clasificación, Gradación, Categoría Cliente Miembro)
 * 2. Propietario / Residente (Clasificación, Gradación, Categoría Cliente Afiliado)
 *
 * Mapped to Firestore document fields:
 * - userCategorie: Membership level / subscription tier
 * - userClasification: Scale of operation / property type
 * - userGrade: Honor grade / app experience level
 */

export interface ClassificationTier {
    id: string
    name: string
    subtitle?: string
    description: string
    color: string
    bgLight: string
    iconName?: string
}

export interface UserRankingCategory {
    title: string
    description: string
    firestoreField: 'userClasification' | 'userGrade' | 'userCategorie'
    criteria: string[]
    tiers: ClassificationTier[]
}

/* =============================================================================
   1. COMERCIANTE CALIFICADO CONFIGURATION
   ============================================================================= */

export const COMERCIANTE_RANKINGS: Record<string, UserRankingCategory> = {
    clasificacion: {
        title: 'Clasificación por Tamaño de Operación',
        description: 'Evalúa la capacidad operativa, estructura empresarial y volumen de proyectos del comerciante.',
        firestoreField: 'userClasification',
        criteria: [
            'Flujo de Caja y liquidez operativa',
            'Años de experiencia acreditada',
            'Tamaño del equipo de trabajo',
            'Reconocimiento de marca y certificaciones externas',
        ],
        tiers: [
            {
                id: 'persona-natural',
                name: 'Persona Natural',
                subtitle: 'Técnico Independiente',
                description: 'Profesional autónomo que ejecuta trabajos directos de mantenimiento y remodelación.',
                color: '#64748b',
                bgLight: '#f1f5f9',
            },
            {
                id: 'emergente',
                name: 'Empresa Emergente',
                subtitle: 'Taller / Pequeña Cuadrilla',
                description: 'Equipo de 2 a 5 personas iniciando la expansión de sus servicios técnicos.',
                color: '#0284c7',
                bgLight: '#e0f2fe',
            },
            {
                id: 'pyme',
                name: 'PyME de Servicios',
                subtitle: 'Empresa Consolidada',
                description: 'Estructura formalizada con capacidad multitarea y proyectos simultáneos.',
                color: '#059669',
                bgLight: '#d1fae5',
            },
            {
                id: 'gacela',
                name: 'Empresa Gacela',
                subtitle: 'Alto Crecimiento',
                description: 'Comerciantes de crecimiento acelerado y alta demanda de contrataciones.',
                color: '#d97706',
                bgLight: '#fef3c7',
            },
            {
                id: 'tractora',
                name: 'Empresa Tractora',
                subtitle: 'Líder Regional',
                description: 'Grandes contratistas que jalonan proyectos de envergadura e infraestructura.',
                color: '#7c3aed',
                bgLight: '#ede9fe',
            },
            {
                id: 'escalable',
                name: 'Corporativo Escalable',
                subtitle: 'Nivel Nacional',
                description: 'Empresas de máxima capacidad operativa con alcance nacional.',
                color: '#db2777',
                bgLight: '#fce7f3',
            },
        ],
    },
    gradacion: {
        title: 'Gradación por Experiencia en Dezzpo',
        description: 'Premia la trayectoria, calidad de servicio, certificaciones y valoraciones en la app.',
        firestoreField: 'userGrade',
        criteria: [
            'Proyectos completados a través de Dezzpo',
            'Promedio de calificaciones de propietarios (estrellas)',
            'Certificación interna por competencias laborales',
            'Vinculación continua y tiempo de membresía',
        ],
        tiers: [
            {
                id: 'activo',
                name: 'Activo',
                subtitle: 'Primeros Pasos',
                description: 'Comerciante verificado ejecutando sus primeras contrataciones.',
                color: '#475569',
                bgLight: '#f8fafc',
            },
            {
                id: 'director-restauracion',
                name: 'Director Restauración',
                subtitle: 'Especialista Calificado',
                description: 'Demuestra amplio dominio técnico y cumplimiento en acabados.',
                color: '#2563eb',
                bgLight: '#eff6ff',
            },
            {
                id: 'campeon',
                name: 'Campeón',
                subtitle: 'Servicio Destacado',
                description: 'Excelente tasa de respuesta y satisfacción de los clientes.',
                color: '#059669',
                bgLight: '#ecfdf5',
            },
            {
                id: 'maestro-constructor',
                name: 'Maestro Constructor',
                subtitle: 'Referente Técnico',
                description: 'Alta reputación comunitaria con múltiples proyectos exitosos.',
                color: '#d97706',
                bgLight: '#fffbeb',
            },
            {
                id: 'gran-maestro',
                name: 'Gran Maestro',
                subtitle: 'Excelencia Probada',
                description: 'Nivel máximo de experiencia, cumplimiento y fidelidad comunitaria.',
                color: '#7c3aed',
                bgLight: '#f5f3ff',
            },
            {
                id: 'retador-sostenible',
                name: 'Retador Sostenible',
                subtitle: 'Challenger Sustainability',
                description: 'Insignia de máximo rango orientada a prácticas constructivas sostenibles.',
                color: '#0d9488',
                bgLight: '#ccfbf1',
            },
        ],
    },
    categoria: {
        title: 'Categoría Cliente Miembro',
        description: 'Nivel de plan o membresía suscrita en la plataforma.',
        firestoreField: 'userCategorie',
        criteria: [
            'Plan de suscripción activo',
            'Subdivisión por rangos de nivel I a V',
            'Créditos mensuales de visibilidad',
        ],
        tiers: [
            { id: 'hierro', name: 'Hierro (I - V)', description: 'Membresía inicial.', color: '#475569', bgLight: '#f1f5f9' },
            { id: 'bronce', name: 'Bronce (I - V)', description: 'Membresía Bronce con visibilidad en zona.', color: '#b45309', bgLight: '#fef3c7' },
            { id: 'plata', name: 'Plata (I - V)', description: 'Membresía Plata con alertas prioritarias.', color: '#64748b', bgLight: '#e2e8f0' },
            { id: 'oro', name: 'Oro (I - V)', description: 'Membresía Oro con distintivo destacado.', color: '#eab308', bgLight: '#fef9c3' },
            { id: 'platino', name: 'Platino (I - V)', description: 'Membresía Platino premium.', color: '#0ea5e9', bgLight: '#e0f2fe' },
            { id: 'diamante', name: 'Diamante (I - V)', description: 'Membresía Diamante con máximos beneficios.', color: '#ec4899', bgLight: '#fce7f3' },
        ],
    },
}

/* =============================================================================
   2. PROPIETARIO / RESIDENTE CONFIGURATION
   ============================================================================= */

export const PROPIETARIO_RANKINGS: Record<string, UserRankingCategory> = {
    clasificacion: {
        title: 'Clasificación por Tipo de Proyecto e Inmueble',
        description: 'Segmenta el alcance del propietario según el tipo de inmueble a intervenir.',
        firestoreField: 'userClasification',
        criteria: [
            'Volumen de contrataciones requeridas',
            'Complejidad del inmueble (Hogar vs Edificio)',
            'Frecuencia y vigencia de proyectos',
        ],
        tiers: [
            {
                id: 'hogar',
                name: 'Hogar',
                subtitle: 'Domicilio / Casa / Apto',
                description: 'Propietario o residente interesado en remodelación y mantenimiento de su hogar.',
                color: '#2563eb',
                bgLight: '#eff6ff',
            },
            {
                id: 'negocio',
                name: 'Negocio',
                subtitle: 'Oficina / Local Comercial',
                description: 'Adecuación de locales comerciales, oficinas y espacios de trabajo.',
                color: '#059669',
                bgLight: '#ecfdf5',
            },
            {
                id: 'propiedad-horizontal',
                name: 'Propiedad Horizontal',
                subtitle: 'Edificio / Conjunto',
                description: 'Administradores y consejos que requieren mantenimiento de zonas comunes.',
                color: '#d97706',
                bgLight: '#fffbeb',
            },
            {
                id: 'inmobiliaria',
                name: 'Inmobiliaria',
                subtitle: 'Organización / Gestión',
                description: 'Gestores inmobiliarios que adecúan inmuebles para venta o arriendo.',
                color: '#7c3aed',
                bgLight: '#f5f3ff',
            },
            {
                id: 'aliado',
                name: 'Aliado Estratégico',
                subtitle: 'Alianzas Corporativas',
                description: 'Socios institucionales que canalizan volumen constante de servicios.',
                color: '#db2777',
                bgLight: '#fce7f3',
            },
        ],
    },
    gradacion: {
        title: 'Gradación por Fidelidad e Interacción',
        description: 'Premia el compromiso del propietario dentro de la comunidad.',
        firestoreField: 'userGrade',
        criteria: [
            'Frecuencia de publicación de requerimientos',
            'Tasa de re-compra y contratación efectiva',
            'Participación en el foro de asesorías y reseñas',
            'Invitación de referidos a la plataforma',
        ],
        tiers: [
            {
                id: 'aceptacion',
                name: 'Nuevo Miembro',
                subtitle: 'Aceptación (Nuevo)',
                description: 'Usuario recientemente registrado explorando la plataforma.',
                color: '#64748b',
                bgLight: '#f1f5f9',
            },
            {
                id: 'aprecio',
                name: 'Explorador',
                subtitle: 'Aprecio (Recurrente)',
                description: 'Visitante recurrente interesado en cotizar proyectos.',
                color: '#0284c7',
                bgLight: '#e0f2fe',
            },
            {
                id: 'pertenencia',
                name: 'Miembro Activo',
                subtitle: 'Pertenencia (Prospecto)',
                description: 'Propietario interactuando activamente con la comunidad.',
                color: '#059669',
                bgLight: '#d1fae5',
            },
            {
                id: 'confianza',
                name: 'Cliente Frecuente',
                subtitle: 'Confianza (Solicitante)',
                description: 'Publica solicitudes constantes y contrata servicios trazables.',
                color: '#d97706',
                bgLight: '#fef3c7',
            },
            {
                id: 'comunicacion',
                name: 'Cliente Preferencial',
                subtitle: 'Comunicación (Re-compra)',
                description: 'Cliente fiel con alto historial de contratación y excelente trato.',
                color: '#7c3aed',
                bgLight: '#ede9fe',
            },
            {
                id: 'contribucion',
                name: 'Embajador Dezzpo',
                subtitle: 'Contribución (Promotor)',
                description: 'Máximo nivel de fidelidad, promotor activo y referente comunitario.',
                color: '#0d9488',
                bgLight: '#ccfbf1',
            },
        ],
    },
    categoria: {
        title: 'Categoría Cliente Afiliado',
        description: 'Plan de beneficios o paquete de mantenimiento Usuario VIP.',
        firestoreField: 'userCategorie',
        criteria: [
            'Suscripción Usuario VIP',
            'Inspecciones periódicas programadas',
        ],
        tiers: [
            { id: 'basico', name: 'Básico', description: 'Acceso estándar a la plataforma.', color: '#64748b', bgLight: '#f1f5f9' },
            { id: 'plus', name: 'Plus', description: 'Beneficios Plus y alertas tempranas.', color: '#0284c7', bgLight: '#e0f2fe' },
            { id: 'silver', name: 'Silver', description: 'Plan Silver con asistencia.', color: '#94a3b8', bgLight: '#e2e8f0' },
            { id: 'gold', name: 'Gold', description: 'Plan Gold con descuentos especiales.', color: '#eab308', bgLight: '#fef9c3' },
            { id: 'premium', name: 'Premium', description: 'Plan Premium con inspección prioritaria.', color: '#7c3aed', bgLight: '#f5f3ff' },
            { id: 'black-diamond', name: 'Black Diamond', description: 'Máximo paquete de mantenimiento VIP.', color: '#0f172a', bgLight: '#e2e8f0' },
        ],
    },
}

/* =============================================================================
   3. HELPER FUNCTIONS
   ============================================================================= */

/**
 * Returns formatted badge information for display in profiles and cards.
 */
export function getBadgeDetails(
    val: string | undefined,
    fallbackName = 'Sin Asignar'
): { name: string; color: string; bgLight: string } {
    if (!val || !val.trim()) {
        return { name: fallbackName, color: '#64748b', bgLight: '#f1f5f9' }
    }

    const clean = val.trim().toLowerCase()

    // Search across all tiers
    const allCategories = [
        ...Object.values(COMERCIANTE_RANKINGS),
        ...Object.values(PROPIETARIO_RANKINGS),
    ]

    for (const cat of allCategories) {
        for (const tier of cat.tiers) {
            if (
                tier.name.toLowerCase() === clean ||
                tier.id === clean ||
                clean.includes(tier.name.toLowerCase())
            ) {
                return { name: tier.name, color: tier.color, bgLight: tier.bgLight }
            }
        }
    }

    // Default fallback returning the string value as-is
    return { name: val, color: '#3b82f6', bgLight: '#eff6ff' }
}
