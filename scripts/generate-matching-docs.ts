/**
 * Matching Documentation Generator
 *
 * Generates docs/matching.md directly from:
 * - src/config/matching.config.ts
 *
 * Ensures technical documentation never drifts from production code.
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
    PROPERTY_TYPE_IDS,
    MERCHANT_STRUCTURE_IDS,
    FUZZY_BASE_MATRIX,
    CORE_PAIRS,
    MATCH_CONFIG,
    CATEGORY_FORMALITY_TABLE,
    PROPERTY_TYPE_METADATA,
    MERCHANT_STRUCTURE_METADATA,
    isCorePair,
} from '../src/config/matching.config'
import { ListadoCategorias } from '../src/assets/data/ListadoCategorias'

export function buildMatchingMarkdown(): string {
    const lines: string[] = []

    lines.push('# Motor de Compatibilidad Difusa y Taxonomía · Dezzpo')
    lines.push('')
    lines.push('> **Nota de Generación:** Este archivo es generado automáticamente desde `src/config/matching.config.ts`. No lo edites manualmente. Ejecuta `pnpm exec tsx scripts/generate-matching-docs.ts` o la suite de tests anti-deriva.')
    lines.push('')
    lines.push(`**Versión de la Matriz:** \`${MATCH_CONFIG.version}\`  `)
    lines.push(`**Umbral Mostrar:** $\\ge ${MATCH_CONFIG.thresholds.mostrar.toFixed(2)}$  `)
    lines.push(`**Umbral Degradar:** $[${MATCH_CONFIG.thresholds.degradar.toFixed(2)}, ${MATCH_CONFIG.thresholds.mostrar.toFixed(2)})$  `)
    lines.push(`**Umbral Ocultar:** $< ${MATCH_CONFIG.thresholds.degradar.toFixed(2)}$  `)
    lines.push('')
    lines.push('---')
    lines.push('')
    lines.push('## 1. Matriz Base de Compatibilidad (20 Pares)')
    lines.push('')
    lines.push('Valores base $\\mu_{\\text{base}}(s, p) \\in [0.00, 1.00]$ que definen la pertenencia difusa entre la estructura operativa del comerciante y el tipo de inmueble:')
    lines.push('')

    // Table header
    const propLabels = PROPERTY_TYPE_IDS.map((p) => PROPERTY_TYPE_METADATA[p].label)
    lines.push(`| Estructura del Comerciante | ${propLabels.join(' | ')} |`)
    lines.push(`| :--- | ${PROPERTY_TYPE_IDS.map(() => ':---:').join(' | ')} |`)

    // Rows
    for (const struct of MERCHANT_STRUCTURE_IDS) {
        const meta = MERCHANT_STRUCTURE_METADATA[struct]
        const cells = PROPERTY_TYPE_IDS.map((prop) => {
            const val = FUZZY_BASE_MATRIX[struct][prop]
            const isCore = isCorePair(struct, prop)
            return isCore ? `**${val.toFixed(2)}** (Núcleo)` : val.toFixed(2)
        })
        lines.push(`| **${meta.label}** | ${cells.join(' | ')} |`)
    }

    lines.push('')
    lines.push('### Núcleo Duro (9 Pares con Score $\\ge 0.90$)')
    lines.push('Son los pares contractuales donde la estructura del comerciante y el tipo de inmueble tienen compatibilidad natural y garantizada:')
    lines.push('')
    CORE_PAIRS.forEach((pair, idx) => {
        const sMeta = MERCHANT_STRUCTURE_METADATA[pair.structure]
        const pMeta = PROPERTY_TYPE_METADATA[pair.propertyType]
        const val = FUZZY_BASE_MATRIX[pair.structure][pair.propertyType]
        lines.push(`${idx + 1}. **${sMeta.label}** $\\times$ **${pMeta.label}**: score \`${val.toFixed(2)}\` $\\implies$ **Mostrar**`)
    })

    lines.push('')
    lines.push('---')
    lines.push('')
    lines.push('## 2. Invariantes del Motor (I1 – I7)')
    lines.push('')
    lines.push('- **I1 (Dominio Válido):** Score siempre acotado a $[0.00, 1.00]$ y redondeado a 2 decimales, sin `NaN`.')
    lines.push('- **I2 (Determinismo y Paridad):** Idéntico comportamiento en cliente y servidor para la misma tupla de entrada.')
    lines.push('- **I3 (Estabilidad del Núcleo):** Ningún refinamiento (formalidad, zona) baja un par del núcleo fuera de «mostrar» ni eleva uno no núcleo a «mostrar».')
    lines.push('- **I4 (Invarianza Geográfica de Visibilidad):** La señal de zona modula orden y priorización intra-banda, pero **jamás** altera qué perfiles son visibles.')
    lines.push('- **I5 (Resiliencia ante Datos Faltantes):** Estructura o inmueble no especificado $\\implies$ pertenencia neutra $0.50$ (visible, nunca oculto).')
    lines.push('- **I6 (Unimodalidad):** Cada fila y cada columna sube monótonamente hasta su ápice y luego desciende, sin fluctuaciones locales secundarias.')
    lines.push('- **I7 (Trazabilidad y Explicabilidad):** Cada evaluación retorna reglas técnicas aplicadas y explicación en español colombiano.')
    lines.push('')
    lines.push('---')
    lines.push('')
    lines.push(`## 3. Tabla de Formalidad por Categoría (${ListadoCategorias.length} Especialidades)`)
    lines.push('')
    lines.push('| Clave | Especialidad | Rol Técnico | Exigencia de Formalidad |')
    lines.push('| :---: | :--- | :--- | :---: |')

    for (const cat of ListadoCategorias) {
        const level = CATEGORY_FORMALITY_TABLE[cat.key] ?? 'media'
        const badge = level === 'alta' ? '🔴 Alta' : level === 'media' ? '🟡 Media' : '🟢 Baja'
        lines.push(`| **${cat.key}** | ${cat.label} | ${cat.rol || cat.label} | ${badge} |`)
    }

    lines.push('')
    return lines.join('\n')
}

// When executed directly via node/tsx
const isMain = process.argv[1] && process.argv[1].includes('generate-matching-docs')
if (isMain) {
    const md = buildMatchingMarkdown()
    const outPath = resolve(process.cwd(), 'docs/matching.md')
    writeFileSync(outPath, md, 'utf-8')
    console.log(`✓ Generated ${outPath} successfully.`)
}
