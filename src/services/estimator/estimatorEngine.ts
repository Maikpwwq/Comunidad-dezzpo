/**
 * Deterministic Estimation Engine (I7.1)
 *
 * Computes parametric estimated budget ranges (CostoMin - CostoMax COP)
 * based on verified unit prices, area (m2), space typology, and finish tier.
 * Includes mandatory non-binding legal disclaimer.
 */

export type EstimatorSpaceType =
    | 'cocina'
    | 'bano'
    | 'pintura'
    | 'pisos'
    | 'drywall_techos'
    | 'obra_blanca'

export type EstimatorFinishLevel = 'economico' | 'estandar' | 'premium'

export interface EstimateItemBreakdown {
    readonly item: string
    readonly category: string
    readonly unit: string
    readonly quantity: number
    readonly unitPriceCop: number
    readonly subtotalCop: number
}

export interface EstimationResult {
    readonly spaceType: EstimatorSpaceType
    readonly spaceLabel: string
    readonly areaM2: number
    readonly finishLevel: EstimatorFinishLevel
    readonly finishLabel: string
    readonly estimatedBaseCop: number
    readonly estimatedMinCop: number
    readonly estimatedMaxCop: number
    readonly breakdown: EstimateItemBreakdown[]
    readonly disclaimer: string
    readonly prefillCategory: string
    readonly prefillDraftName: string
}

export const ESTIMATOR_LEGAL_DISCLAIMER =
    'Estimación técnica orientativa no vinculante generada con base en los precios promedio de mano de obra y materiales en Bogotá. El contratista definirá el valor exacto tras visita técnica y revisión del estado real del inmueble (Ley 1480 de 2011).'

export const SPACE_CONFIG: Record<
    EstimatorSpaceType,
    {
        label: string
        category: string
        defaultAreaM2: number
        minAreaM2: number
        maxAreaM2: number
        basePricePerM2: number
        items: Array<{ name: string; category: string; ratioPerM2: number; baseUnitCost: number }>
    }
> = {
    cocina: {
        label: 'Cocina Integral',
        category: 'Cocinas y Carpintería',
        defaultAreaM2: 8,
        minAreaM2: 4,
        maxAreaM2: 30,
        basePricePerM2: 780000,
        items: [
            { name: 'Mueble bajo y alto en melamina RH', category: 'Carpintería', ratioPerM2: 0.6, baseUnitCost: 650000 },
            { name: 'Mesón y salpicadero en granito natural', category: 'Acabados en muros', ratioPerM2: 0.35, baseUnitCost: 480000 },
            { name: 'Instalaciones hidrosanitarias y grifería', category: 'Plomería', ratioPerM2: 0.25, baseUnitCost: 280000 },
            { name: 'Puntos eléctricos e iluminación LED', category: 'Electricistas', ratioPerM2: 0.2, baseUnitCost: 180000 },
        ],
    },
    bano: {
        label: 'Remodelación de Baño',
        category: 'Enchapes y Pisos',
        defaultAreaM2: 4,
        minAreaM2: 2,
        maxAreaM2: 15,
        basePricePerM2: 890000,
        items: [
            { name: 'Desmonte de aparatos y demolición de enchape', category: 'Demoliciones', ratioPerM2: 1, baseUnitCost: 95000 },
            { name: 'Impermeabilización de zona húmeda', category: 'Impermeabilizaciones', ratioPerM2: 0.6, baseUnitCost: 120000 },
            { name: 'Enchape de piso y muro rectificado', category: 'Enchapes y Pisos', ratioPerM2: 3.5, baseUnitCost: 75000 },
            { name: 'Instalación de sanitario, lavamanos y grifería', category: 'Plomería', ratioPerM2: 0.5, baseUnitCost: 350000 },
            { name: 'División de baño en vidrio templado', category: 'Vidrios y Ventanas', ratioPerM2: 0.3, baseUnitCost: 550000 },
        ],
    },
    pintura: {
        label: 'Pintura General de Interiores',
        category: 'Pintura',
        defaultAreaM2: 60,
        minAreaM2: 15,
        maxAreaM2: 300,
        basePricePerM2: 28000,
        items: [
            { name: 'Resane de fisuras y preparación de superficie', category: 'Pintura', ratioPerM2: 1, baseUnitCost: 8000 },
            { name: 'Aplicación de estuco plástico (2 manos)', category: 'Pintura', ratioPerM2: 1, baseUnitCost: 11000 },
            { name: 'Pintura vinilo lavable Tipo 1 (2 manos)', category: 'Pintura', ratioPerM2: 1, baseUnitCost: 9000 },
        ],
    },
    pisos: {
        label: 'Instalación de Pisos (Laminado / Porcelanato)',
        category: 'Enchapes y Pisos',
        defaultAreaM2: 45,
        minAreaM2: 10,
        maxAreaM2: 250,
        basePricePerM2: 68000,
        items: [
            { name: 'Nivelación de superficie y mortero de pega', category: 'Enchapes y Pisos', ratioPerM2: 1, baseUnitCost: 22000 },
            { name: 'Instalación de piso (formato medio o SPC)', category: 'Enchapes y Pisos', ratioPerM2: 1, baseUnitCost: 38000 },
            { name: 'Suministro e instalación de guardescobas', category: 'Carpintería', ratioPerM2: 0.35, baseUnitCost: 24000 },
        ],
    },
    drywall_techos: {
        label: 'Cielos Rasos y Muros en Drywall',
        category: 'Drywall y Cielos Rasos',
        defaultAreaM2: 35,
        minAreaM2: 10,
        maxAreaM2: 200,
        basePricePerM2: 52000,
        items: [
            { name: 'Estructura metálica canal y parales galvanizados', category: 'Drywall y Cielos Rasos', ratioPerM2: 1, baseUnitCost: 19000 },
            { name: 'Fijación de lámina de yeso 1/2 pulgada', category: 'Drywall y Cielos Rasos', ratioPerM2: 1, baseUnitCost: 18000 },
            { name: 'Encintado, masilla 3 capas y lijado fino', category: 'Drywall y Cielos Rasos', ratioPerM2: 1, baseUnitCost: 15000 },
        ],
    },
    obra_blanca: {
        label: 'Acabados Integrales de Obra Blanca',
        category: 'Construcción y Remodelación',
        defaultAreaM2: 50,
        minAreaM2: 25,
        maxAreaM2: 200,
        basePricePerM2: 420000,
        items: [
            { name: 'Estuco y pintura completa de muros y techos', category: 'Pintura', ratioPerM2: 2.5, baseUnitCost: 26000 },
            { name: 'Instalación de piso cerámico o laminado', category: 'Enchapes y Pisos', ratioPerM2: 1, baseUnitCost: 65000 },
            { name: 'Adecuación de enchapes y aparatos en baños', category: 'Plomería', ratioPerM2: 0.15, baseUnitCost: 850000 },
            { name: 'Puertas de paso entamboradas con cerradura', category: 'Carpintería', ratioPerM2: 0.08, baseUnitCost: 380000 },
            { name: 'Aparatos eléctricos (tomas, interruptores, plafones)', category: 'Electricistas', ratioPerM2: 0.2, baseUnitCost: 95000 },
        ],
    },
}

export const FINISH_MULTIPLIERS: Record<EstimatorFinishLevel, { factor: number; label: string }> = {
    economico: { factor: 1.0, label: 'Económico / Estándar Nacional' },
    estandar: { factor: 1.35, label: 'Estándar Superior / Marcas Líderes' },
    premium: { factor: 1.85, label: 'Premium / Acabados Importados y Porcelanatos' },
}

/**
 * Pure calculation function for estimate budget ranges.
 */
export function calculateBudgetEstimate(
    spaceType: EstimatorSpaceType,
    areaM2: number,
    finishLevel: EstimatorFinishLevel = 'estandar'
): EstimationResult {
    const config = SPACE_CONFIG[spaceType]
    const finish = FINISH_MULTIPLIERS[finishLevel]

    // Clamp area within boundaries
    const safeArea = Math.max(config.minAreaM2, Math.min(config.maxAreaM2, areaM2))

    const breakdown: EstimateItemBreakdown[] = config.items.map((it) => {
        const quantity = Number((it.ratioPerM2 * safeArea).toFixed(1))
        const unitPriceCop = Math.round(it.baseUnitCost * finish.factor)
        const subtotalCop = Math.round(quantity * unitPriceCop)
        return {
            item: it.name,
            category: it.category,
            unit: it.ratioPerM2 === 1 ? 'm²' : 'und / ml',
            quantity,
            unitPriceCop,
            subtotalCop,
        }
    })

    const estimatedBaseCop = breakdown.reduce((sum, it) => sum + it.subtotalCop, 0)
    // -10% Min, +25% Max rounded to nearest 10.000 COP
    const estimatedMinCop = Math.round((estimatedBaseCop * 0.9) / 10000) * 10000
    const estimatedMaxCop = Math.round((estimatedBaseCop * 1.25) / 10000) * 10000

    return {
        spaceType,
        spaceLabel: config.label,
        areaM2: safeArea,
        finishLevel,
        finishLabel: finish.label,
        estimatedBaseCop,
        estimatedMinCop,
        estimatedMaxCop,
        breakdown,
        disclaimer: ESTIMATOR_LEGAL_DISCLAIMER,
        prefillCategory: config.category,
        prefillDraftName: `${config.label} (${safeArea} m² - ${finish.label.split('/')[0]?.trim() || finish.label})`,
    }
}

