/**
 * Matching & Compatibility Taxonomy Configuration
 *
 * Source of truth for:
 * 1. Property Types (Inmuebles: Hogar, Negocio, Propiedad Horizontal, Inmobiliaria, Aliado)
 * 2. Merchant Operational Structures (Persona Natural, Microempresa, PyME, Empresa)
 * 3. 20-Pair Fuzzy Base Matrix & Core 9-Pair Hard Contract
 * 4. 94-Category Formality Classification Table (Baja, Media, Alta)
 * 5. Decision Thresholds, Affinity Bands, and Versioning
 */

/* =============================================================================
   1. TAXONOMY IDENTIFIERS & METADATA
   ============================================================================= */

export const PROPERTY_TYPE_IDS = [
    'hogar',
    'negocio',
    'propiedad_horizontal',
    'inmobiliaria',
    'aliado_estrategico',
] as const

export type PropertyTypeId = typeof PROPERTY_TYPE_IDS[number]

export const MERCHANT_STRUCTURE_IDS = [
    'persona_natural',
    'micro_empresa',
    'pyme_servicios',
    'empresa',
] as const

export type MerchantStructureId = typeof MERCHANT_STRUCTURE_IDS[number]

export const FORMALITY_LEVELS = ['baja', 'media', 'alta'] as const
export type FormalityLevel = typeof FORMALITY_LEVELS[number]

export const MATCH_DECISIONS = ['mostrar', 'degradar', 'ocultar'] as const
export type MatchDecision = typeof MATCH_DECISIONS[number]

export const AFFINITY_BANDS = ['alta', 'media', 'baja', 'nula'] as const
export type AffinityBand = typeof AFFINITY_BANDS[number]

export interface PropertyTypeMetadata {
    id: PropertyTypeId
    label: string
    shortLabel: string
    slug: string
    description: string
    iconName: string
    highFormalityExpected: boolean
}

export const PROPERTY_TYPE_METADATA: Record<PropertyTypeId, PropertyTypeMetadata> = {
    hogar: {
        id: 'hogar',
        label: 'Hogar',
        shortLabel: 'Hogar',
        slug: 'hogar',
        description: 'Viviendas familiares, casas y apartamentos residenciales.',
        iconName: 'Home',
        highFormalityExpected: false,
    },
    negocio: {
        id: 'negocio',
        label: 'Negocio',
        shortLabel: 'Negocio',
        slug: 'negocio',
        description: 'Locales comerciales, oficinas independientes y puntos de venta.',
        iconName: 'Storefront',
        highFormalityExpected: false,
    },
    propiedad_horizontal: {
        id: 'propiedad_horizontal',
        label: 'Propiedad Horizontal',
        shortLabel: 'PH / Conjuntos',
        slug: 'propiedad-horizontal',
        description: 'Edificios, conjuntos residenciales y zonas comunes reguladas por Ley 675.',
        iconName: 'Apartment',
        highFormalityExpected: true,
    },
    inmobiliaria: {
        id: 'inmobiliaria',
        label: 'Inmobiliaria',
        shortLabel: 'Inmobiliaria',
        slug: 'inmobiliaria',
        description: 'Agencias inmobiliarias y administradores de carteras de inmuebles.',
        iconName: 'BusinessCenter',
        highFormalityExpected: true,
    },
    aliado_estrategico: {
        id: 'aliado_estrategico',
        label: 'Aliado Estratégico',
        shortLabel: 'Aliados',
        slug: 'aliado-estrategico',
        description: 'Empresas constructoras, aseguradoras y corporativos de alto volumen.',
        iconName: 'Handshake',
        highFormalityExpected: true,
    },
}

export interface MerchantStructureMetadata {
    id: MerchantStructureId
    label: string
    shortLabel: string
    description: string
    standardBillingDoc: 'cuenta_de_cobro' | 'factura_electronica'
    color: string
}

export const MERCHANT_STRUCTURE_METADATA: Record<MerchantStructureId, MerchantStructureMetadata> = {
    persona_natural: {
        id: 'persona_natural',
        label: 'Persona Natural',
        shortLabel: 'Independiente',
        description: 'Profesional autónomo o técnico independiente con operación directa.',
        standardBillingDoc: 'cuenta_de_cobro',
        color: '#64748b',
    },
    micro_empresa: {
        id: 'micro_empresa',
        label: 'Microempresa',
        shortLabel: 'Microempresa',
        description: 'Taller o cuadrilla especializada de 2 a 5 personas.',
        standardBillingDoc: 'factura_electronica',
        color: '#0284c7',
    },
    pyme_servicios: {
        id: 'pyme_servicios',
        label: 'PyME de Servicios',
        shortLabel: 'PyME',
        description: 'Empresa consolidada con cuadrillas múltiples y capacidad de simultaneidad.',
        standardBillingDoc: 'factura_electronica',
        color: '#059669',
    },
    empresa: {
        id: 'empresa',
        label: 'Empresa',
        shortLabel: 'Empresa / Corporativo',
        description: 'Gran contratista o corporativo con capacidad técnica e infraestructura regional.',
        standardBillingDoc: 'factura_electronica',
        color: '#7c3aed',
    },
}

/* =============================================================================
   2. NORMALIZATION & TYPE GUARDS (LEGACY / FIRESTORE COMPATIBILITY)
   ============================================================================= */

/**
 * Normalizes any property type string (from Firestore, legacy forms, or URL)
 * to its canonical PropertyTypeId, or returns null if unknown.
 */
export function normalizePropertyType(input: unknown): PropertyTypeId | null {
    if (typeof input !== 'string') return null
    const cleaned = input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[\s-]+/g, '_')

    if (cleaned === 'hogar' || cleaned === 'domicilio' || cleaned === 'casa' || cleaned === 'apartamento') {
        return 'hogar'
    }
    if (cleaned === 'negocio' || cleaned === 'oficina' || cleaned === 'local' || cleaned === 'comercio') {
        return 'negocio'
    }
    if (
        cleaned === 'propiedad_horizontal' ||
        cleaned === 'propiedad-horizontal' ||
        cleaned === 'ph' ||
        cleaned === 'conjunto' ||
        cleaned === 'edificio'
    ) {
        return 'propiedad_horizontal'
    }
    if (cleaned === 'inmobiliaria' || cleaned === 'inmuebles') {
        return 'inmobiliaria'
    }
    if (
        cleaned === 'aliado_estrategico' ||
        cleaned === 'aliado-estrategico' ||
        cleaned === 'aliado' ||
        cleaned === 'alianzas' ||
        cleaned === 'corporativo'
    ) {
        return 'aliado_estrategico'
    }

    return null
}

/**
 * Normalizes any merchant structure string (from userClasification, admin Select, etc.)
 * to its canonical MerchantStructureId, or returns null if unassigned/unknown.
 */
export function normalizeMerchantStructure(input: unknown): MerchantStructureId | null {
    if (typeof input !== 'string') return null
    const cleaned = input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()

    if (cleaned.includes('natural') || cleaned.includes('independiente') || cleaned.includes('autonomo')) {
        return 'persona_natural'
    }
    if (cleaned.includes('emergente') || cleaned.includes('micro') || cleaned.includes('cuadrilla')) {
        return 'micro_empresa'
    }
    if (cleaned.includes('pyme')) {
        return 'pyme_servicios'
    }
    if (
        cleaned.includes('gacela') ||
        cleaned.includes('tractora') ||
        cleaned.includes('escalable') ||
        cleaned.includes('empresa') ||
        cleaned.includes('corporativo')
    ) {
        return 'empresa'
    }

    return null
}

/* =============================================================================
   3. 20-PAIR FUZZY BASE MATRIX & CORE CONTRACT
   ============================================================================= */

export const MATRIX_VERSION = '1.0.0'

/**
 * Base compatibility values mu_base(structure, propertyType) in [0.00, 1.00]
 */
export const FUZZY_BASE_MATRIX: Record<MerchantStructureId, Record<PropertyTypeId, number>> = {
    persona_natural: {
        hogar: 1.00,
        negocio: 0.35,
        propiedad_horizontal: 0.10,
        inmobiliaria: 0.00,
        aliado_estrategico: 0.00,
    },
    micro_empresa: {
        hogar: 1.00,
        negocio: 1.00,
        propiedad_horizontal: 0.90,
        inmobiliaria: 0.40,
        aliado_estrategico: 0.10,
    },
    pyme_servicios: {
        hogar: 0.40,
        negocio: 0.90,
        propiedad_horizontal: 1.00,
        inmobiliaria: 0.90,
        aliado_estrategico: 0.40,
    },
    empresa: {
        hogar: 0.05,
        negocio: 0.15,
        propiedad_horizontal: 0.45,
        inmobiliaria: 0.95,
        aliado_estrategico: 1.00,
    },
}

/**
 * The 9 Core Pairs (Núcleo Duro) where base score >= 0.90
 * Under default threshold (0.50), "mostrar" MUST equal exactly these 9 pairs.
 */
export const CORE_PAIRS: ReadonlyArray<{ readonly structure: MerchantStructureId; readonly propertyType: PropertyTypeId }> = [
    { structure: 'persona_natural', propertyType: 'hogar' },
    { structure: 'micro_empresa', propertyType: 'hogar' },
    { structure: 'micro_empresa', propertyType: 'negocio' },
    { structure: 'micro_empresa', propertyType: 'propiedad_horizontal' },
    { structure: 'pyme_servicios', propertyType: 'negocio' },
    { structure: 'pyme_servicios', propertyType: 'propiedad_horizontal' },
    { structure: 'pyme_servicios', propertyType: 'inmobiliaria' },
    { structure: 'empresa', propertyType: 'inmobiliaria' },
    { structure: 'empresa', propertyType: 'aliado_estrategico' },
] as const

export function isCorePair(structure: MerchantStructureId, propertyType: PropertyTypeId): boolean {
    return CORE_PAIRS.some((pair) => pair.structure === structure && pair.propertyType === propertyType)
}

/* =============================================================================
   4. THRESHOLDS & AFFINITY BANDS
   ============================================================================= */

export const MATCH_CONFIG = {
    version: MATRIX_VERSION,
    thresholds: {
        mostrar: 0.50,
        degradar: 0.25,
    },
    bands: {
        alta: 0.80,
        media: 0.50,
        baja: 0.25,
        nula: 0.00,
    },
    neutralScore: 0.50, // Invariant I5 for unknown data
    refinementWeights: {
        maxFormalityPenalty: 0.12, // Downward penalty for high-formality mismatch
        maxZonePriorityBoost: 0.05, // Intra-band priority boost for same zone
    },
} as const

/* =============================================================================
   5. 94-CATEGORY FORMALITY TABLE
   ============================================================================= */

/**
 * Formality levels for all 94 official categories from ListadoCategorias (keys 0 to 93).
 * Alta: Regulated, high-risk, requires certified safety, invoices, or policies.
 * Media: Standard technical service.
 * Baja: Handyman, minor repairs, individual trades.
 */
export const CATEGORY_FORMALITY_TABLE: Record<number, FormalityLevel> = {
    0: 'media',   // Acabados en muros
    1: 'alta',    // Administración PH
    2: 'media',   // Aires Acondicionados
    3: 'media',   // Aislamiento acústico
    4: 'baja',    // Albañilería
    5: 'baja',    // Alfombras
    6: 'alta',    // Arquitectura
    7: 'baja',    // Armarios y closets
    8: 'baja',    // Artesanías y manualidades
    9: 'baja',    // Asistencia toderos
    10: 'alta',   // Ascensores
    11: 'media',  // Aseo Hogar y Oficina
    12: 'media',  // Automatización
    13: 'baja',   // Calentadores
    14: 'media',  // Camaras de seguridad
    15: 'media',  // Canales y bajantes
    16: 'baja',   // Carpintería
    17: 'media',  // Carpintería en aluminio
    18: 'baja',   // Cerrajería
    19: 'baja',   // Chimeneas
    20: 'media',  // Cocinas integrales
    21: 'alta',   // Construcción civil
    22: 'alta',   // Control de acceso
    23: 'alta',   // Control de plagas
    24: 'baja',   // Cortinas
    25: 'alta',   // Cubiertas y Techos
    26: 'media',  // Diseño e impresión
    27: 'media',  // Domótica
    28: 'baja',   // Destape drenajes
    29: 'media',  // Inundaciones
    30: 'baja',   // Electrodomésticos línea blanca
    31: 'baja',   // Electrodomésticos línea marrón
    32: 'baja',   // Ensamblado de muebles
    33: 'alta',   // Estudios de suelos
    34: 'media',  // Ferreterías
    35: 'alta',   // Gasodomésticos
    36: 'media',  // Iluminación
    37: 'alta',   // Impermeabilización
    38: 'media',  // Instalación de adoquín
    39: 'baja',   // Instalación de cerámica
    40: 'media',  // Instalación pisos deck
    41: 'media',  // Instalación pisos PVC
    42: 'alta',   // Instalación de parques
    43: 'baja',   // Instalación de pisos laminados
    44: 'media',  // Instalación de porcelanatos
    45: 'baja',   // Instalación de soportes y bases para TV
    46: 'media',  // Instalación de ventanas
    47: 'baja',   // Jardinería
    48: 'media',  // Lavandería
    49: 'alta',   // Limpiezas técnicas
    50: 'media',  // Oficial de Obra
    51: 'media',  // Mantenimiento locativo
    52: 'media',  // Mantenimiento mecanico
    53: 'media',  // Metálmecanica
    54: 'baja',   // Muebles
    55: 'baja',   // Movilizar pesos
    56: 'media',  // Mudanzas
    57: 'media',  // Obra Liviana
    58: 'alta',   // Paisajismo
    59: 'baja',   // Pañetes y estucos
    60: 'media',  // Pergolas
    61: 'baja',   // Persianas enrollables Blackout
    62: 'baja',   // Pintura
    63: 'baja',   // Plomería
    64: 'alta',   // Pozos sépticos y trampas de grasas
    65: 'alta',   // Protección contra incendio
    66: 'media',  // Red electrica
    67: 'alta',   // Red de gases
    68: 'alta',   // Redes de cableado estructurado
    69: 'alta',   // Redes de telecomunicaciones
    70: 'alta',   // Redes hidrosanitarias
    71: 'media',  // Reformas Cocinas
    72: 'media',  // Reformas Baños
    73: 'alta',   // Reformas Piscinas
    74: 'media',  // Refrigeración
    75: 'baja',   // Servicio doméstico
    76: 'alta',   // Sistemas de Seguridad y alarmas
    77: 'media',  // Soldadura
    78: 'alta',   // Tanques de agua
    79: 'baja',   // Tapicería
    80: 'baja',   // Techos PVC
    81: 'media',  // Trabajos en piedra
    82: 'media',  // Trasiego de escombros
    83: 'alta',   // Trabajos en altura
    84: 'alta',   // Cálculos y Diseños de Ingeniería
    85: 'alta',   // Topografía y Agrimensura
    86: 'alta',   // Estudios de Suelos y Geotecnia
    87: 'alta',   // Energía Solar y Fotovoltaica
    88: 'media',  // Puertas Automáticas y Motores
    89: 'alta',   // Fumigación y Control de Plagas
    90: 'alta',   // Peritajes y Avalúos
    91: 'media',  // Diseño 3D y Renders
    92: 'alta',   // Videovigilancia CCTV
    93: 'alta',   // Izaje de cargas
}

/**
 * Returns formality level for a given category key or numeric string. Defaults to 'media'.
 */
export function getCategoryFormality(categoryKey: number | string | undefined): FormalityLevel {
    if (categoryKey === undefined || categoryKey === null) return 'media'
    const num = Number(categoryKey)
    if (Number.isFinite(num) && num in CATEGORY_FORMALITY_TABLE) {
        return CATEGORY_FORMALITY_TABLE[num] ?? 'media'
    }
    return 'media'
}
