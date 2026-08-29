/**
 * Intent Classifier & Dynamic Copy Injector
 * 
 * Accurately parses Facebook group post messages into SUPPLY (Contractors/Maestros)
 * vs DEMAND (Homeowners/Clients) and injects contextualized, rotated copys with UTM tracking.
 */

import {
  getRandomCopy,
  getFilteredCopys,
  buildUtmUrl,
  interpolateSegmentedCopy,
  type TradeSpecialty,
} from '@/types/copys'
import {
  getRandomInterceptCopy,
  getFilteredInterceptCopys,
  buildClientUtmUrl,
  interpolateClientCopy,
  type TargetTrade,
} from '@/types/interceptCopys'
import type {
  IntentResult,
  PostIntent,
  PreparedComment,
  MetaGraphPost,
  SimulationPostInput,
} from './types'

// =============================================================================
// REGEX TAXONOMY: SUPPLY VS DEMAND & COMPLETE 92-CATEGORY SERVICE CATALOG
// =============================================================================

const SUPPLY_PATTERNS: readonly { pattern: RegExp; trade?: TradeSpecialty }[] = [
  { pattern: /ofrezco\s+(mis\s+)?servicios/i },
  { pattern: /maestro\s+de\s+(obra|construcci[oó]n|acabados)/i, trade: 'maestro' },
  { pattern: /somos?\s+contratistas?/i, trade: 'contratista' },
  { pattern: /plomer[oí]a?\s+(disponible|a\s+domicilio|garantizada|profesional)/i, trade: 'plomero' },
  { pattern: /electricista\s+(certificado|a\s+domicilio|disponible|instalador)/i, trade: 'electricista' },
  { pattern: /pintor\s+(profesional|disponible|a\s+domicilio|experto)/i, trade: 'pintor' },
  { pattern: /se\s+realizan\s+trabajos/i },
  { pattern: /hacemos\s+(estuco|pintura|remodelaci[oó]n|enchape|mantenimiento|drywall|carpinter[ií]a)/i },
  { pattern: /enchapador\s+profesional|instalador\s+de\s+piso/i, trade: 'albanil' },
  { pattern: /trabajos\s+de\s+(construcci[oó]n|remodelaci[oó]n|plomer[ií]a|electricidad|carpinter[ií]a|ornamentaci[oó]n|cerrajer[ií]a|impermeabilizaci[oó]n)/i },
  { pattern: /disponible\s+para\s+(trabajar|obras|contratos|turnos|reparaciones)/i },
  { pattern: /servicio\s+de\s+(estuco|pintura|drywall|impermeabilizaci[oó]n|techos|calentadores)/i, trade: 'pintor' },
  { pattern: /taller\s+de\s+(ornamentaci[oó]n|carpinter[ií]a|cerrajer[ií]a|soldadura)/i, trade: 'maestro' },
]

const DEMAND_PATTERNS: readonly { pattern: RegExp; trade?: TargetTrade }[] = [
  { pattern: /(busco|solicito|necesito|requiero)\s+(un\s+)?(maestro|plomero|electricista|pintor|remodelador|alba[ñn]il|contratista|t[eé]cnico|instalador|carpintero|cerrajero|soldador|vidriero|enchapador)/i },
  { pattern: /alguien\s+que\s+(haga|sepa|trabaje|repare|instale|pinte|enchape|impermeabilice|suelde|arme)/i },
  { pattern: /cotizaci[oó]n\s+(para|de|urgente)/i },
  { pattern: /recomienden\s+(un\s+)?(maestro|plomero|electricista|pintor|remodelador|carpintero|cerrajero|buen)/i },
  { pattern: /cu[aá]nto\s+cobran\s+por/i },
  { pattern: /presupuesto\s+(para|de)/i },
  { pattern: /qui[eé]n\s+(hace|conoce\s+un|me\s+recomienda)/i },
  { pattern: /urgente\s+(plomero|electricista|fuga|corto\s+circuito|destape|gotera|cerradura|da[ñn]o)/i },
  { pattern: /aver[ií]a\s+de\s+(tuber[ií]a|luz|agua|ba[ñn]o|calentador|gas|cerradura|chapa)/i },
  { pattern: /filtraci[oó]n|humedad|gotera\s+en\s+(techo|pared|teja|cubierta)/i },
]

const TRADE_LOOKUP: readonly { keyword: RegExp; trade: TradeSpecialty }[] = [
  { keyword: /plomer[oí]a|tubo|fuga|grifo|inodoro|destape|lavamanos|sif[oó]n|hidr[aá]ulic/i, trade: 'plomero' },
  { keyword: /electric|corto|breaker|luz|cableado|tomacorriente|trif[aá]sica|iluminaci[oó]n|tablero/i, trade: 'electricista' },
  { keyword: /pintur|estuco|fachada|vinilo|impermeabiliz|resanar|impermeabilizaci[oó]n|gotera|humedad/i, trade: 'pintor' },
  { keyword: /maestro|acabados|drywall|cielo\s+raso|estructura|obra\s+blanca|superboard/i, trade: 'maestro' },
  { keyword: /remodela|dise[ñn]o|apartamento|cocina\s+integral|ba[ñn]o|ampliaci[oó]n|obra\s+civil/i, trade: 'remodelador' },
  { keyword: /alba[ñn]il|mamposter|bloque|cemento|viga|enchap|porcelanato|baldosa|piso/i, trade: 'albanil' },
  { keyword: /contratista|licitaci|obra\s+civil|ingenier[ií]a|arquitectura/i, trade: 'contratista' },
  { keyword: /carpinter|ebanist|closet|madera|puerta\s+de\s+madera|mueble\s+modular/i, trade: 'maestro' },
  { keyword: /cerrajer|chapa|cerradura|candado|apertura\s+de\s+puerta/i, trade: 'remodelador' },
  { keyword: /ornamentac|soldador|soldadura|reja|port[oó]n|estructura\s+met[aá]lica/i, trade: 'maestro' },
  { keyword: /vidrio|vidrier|ventana\s+aluminio|espejo|divisi[oó]n\s+de\s+ba[ñn]o/i, trade: 'remodelador' },
  { keyword: /calentador|gasodom[eé]stico|red\s+de\s+gas|estufa\s+a\s+gas/i, trade: 'plomero' },
  { keyword: /aire\s+acondicionado|refrigeraci[oó]n|hvac/i, trade: 'electricista' },
  { keyword: /topograf|peritaje|aval[uú]o|geotecnia|estudio\s+de\s+suelo|dise[ñn]o\s+3d/i, trade: 'contratista' },
  { keyword: /fumigac|control\s+de\s+plaga|desinfecci[oó]n/i, trade: 'remodelador' },
]

const ZONES_LOOKUP: readonly { pattern: RegExp; zoneName: string }[] = [
  { pattern: /suba/i, zoneName: 'Suba' },
  { pattern: /usaqu[eé]n/i, zoneName: 'Usaquén' },
  { pattern: /chapinero/i, zoneName: 'Chapinero' },
  { pattern: /engativ[aá]/i, zoneName: 'Engativá' },
  { pattern: /kennedy/i, zoneName: 'Kennedy' },
  { pattern: /bosa/i, zoneName: 'Bosa' },
  { pattern: /fontib[oó]n/i, zoneName: 'Fontibón' },
  { pattern: /teusaquillo/i, zoneName: 'Teusaquillo' },
  { pattern: /barrios\s+unidos/i, zoneName: 'Barrios Unidos' },
  { pattern: /puente\s+aranda/i, zoneName: 'Puente Aranda' },
  { pattern: /tunjuelito/i, zoneName: 'Tunjuelito' },
  { pattern: /ciudad\s+bol[ií]var/i, zoneName: 'Ciudad Bolívar' },
  { pattern: /san\s+crist[oó]bal/i, zoneName: 'San Cristóbal' },
  { pattern: /santa\s+fe/i, zoneName: 'Santa Fe' },
  { pattern: /la\s+candelaria/i, zoneName: 'La Candelaria' },
  { pattern: /los\s+m[aá]rtires/i, zoneName: 'Los Mártires' },
  { pattern: /antonio\s+nari[ñn]o/i, zoneName: 'Antonio Nariño' },
  { pattern: /usme/i, zoneName: 'Usme' },
  { pattern: /sumapaz/i, zoneName: 'Sumapaz' },
  { pattern: /ch[ií]a/i, zoneName: 'Chía' },
  { pattern: /soacha/i, zoneName: 'Soacha' },
  { pattern: /cajic[aá]/i, zoneName: 'Cajicá' },
  { pattern: /zipaquir[aá]/i, zoneName: 'Zipaquirá' },
  { pattern: /madrid|mosquera|funza/i, zoneName: 'Sabana Occidente' },
  { pattern: /cota|facatativ[aá]|la\s+calera|sop[oó]/i, zoneName: 'Sabana Centro' },
]

// =============================================================================
// INTENT CLASSIFICATION FUNCTION
// =============================================================================

export function classifyPostIntent(message?: string | null): IntentResult {
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return {
      intent: 'NEUTRAL',
      confidence: 'LOW',
      detectedTrade: 'general',
      matchedPatterns: [],
    }
  }

  const normalized = message.trim()
  const matchedSupply: string[] = []
  const matchedDemand: string[] = []
  let tradeCandidate: TradeSpecialty | TargetTrade | 'general' = 'general'
  let extractedZone: string | undefined = undefined

  // 1. Detect Trade
  for (const { keyword, trade } of TRADE_LOOKUP) {
    if (keyword.test(normalized)) {
      tradeCandidate = trade
      break
    }
  }

  // 2. Detect Zone
  for (const { pattern, zoneName } of ZONES_LOOKUP) {
    if (pattern.test(normalized)) {
      extractedZone = zoneName
      break
    }
  }

  // 3. Match Supply Patterns
  for (const { pattern, trade } of SUPPLY_PATTERNS) {
    if (pattern.test(normalized)) {
      matchedSupply.push(pattern.source)
      if (trade && tradeCandidate === 'general') {
        tradeCandidate = trade
      }
    }
  }

  // 4. Match Demand Patterns
  for (const { pattern, trade } of DEMAND_PATTERNS) {
    if (pattern.test(normalized)) {
      matchedDemand.push(pattern.source)
      if (trade && tradeCandidate === 'general') {
        tradeCandidate = trade
      }
    }
  }

  // 5. Intent Resolution (Demand takes priority if someone is requesting a service)
  let intent: PostIntent = 'NEUTRAL'
  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW'
  let matchedPatterns: readonly string[] = []

  if (matchedDemand.length > 0) {
    intent = 'DEMAND'
    matchedPatterns = matchedDemand
    confidence = matchedDemand.length > 1 || tradeCandidate !== 'general' ? 'HIGH' : 'MEDIUM'
  } else if (matchedSupply.length > 0) {
    intent = 'SUPPLY'
    matchedPatterns = matchedSupply
    confidence = matchedSupply.length > 1 || tradeCandidate !== 'general' ? 'HIGH' : 'MEDIUM'
  }

  return {
    intent,
    confidence,
    detectedTrade: tradeCandidate,
    matchedPatterns,
    ...(extractedZone ? { extractedZone } : {}),
  }
}

// =============================================================================
// DYNAMIC COPY & UTM COMMENT INJECTOR
// =============================================================================

export function prepareComment(options: {
  post: MetaGraphPost | SimulationPostInput
  intentResult?: IntentResult | undefined
  baseUrl?: string | undefined
  isSimulation?: boolean | undefined
}): PreparedComment | null {
  const { post, baseUrl = 'https://dezzpo.com', isSimulation = false } = options
  const intentResult = options.intentResult ?? classifyPostIntent(post.message)

  if (intentResult.intent === 'NEUTRAL') {
    return null
  }

  const authorName = 'from' in post ? post.from.name : post.authorName ?? 'amigo'
  const authorId = 'from' in post ? post.from.id : post.authorId ?? 'user'
  const trade = intentResult.detectedTrade
  const zone = intentResult.extractedZone ?? 'Bogotá y Sabana'

  // Rotational prefix greetings to alter cryptographic fingerprint
  const greetings = [
    `Hola ${authorName}, `,
    `¿${authorName}? `,
    `¡Hola ${authorName}! `,
    `Buenas ${authorName}, `,
    `👋 ${authorName}, `,
  ]
  const greeting = greetings[Math.floor(Math.random() * greetings.length)] ?? `Hola ${authorName}, `

  if (intentResult.intent === 'SUPPLY') {
    // Select from FACEBOOK_CAMPAIGN_COPYS
    const pool = getFilteredCopys({
      target: 'VENTAS',
      format: 'CON_URL',
      tradeSpecialty: trade as TradeSpecialty,
    })

    const selectedCopy =
      pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]!
        : getRandomCopy({ format: 'CON_URL' }) ?? {
            id: 'VTA-CON-CON-01',
            copy: 'Publica fotos de tus trabajos y conéctate con dueños de proyectos en dezzpo.com',
          }

    const utmUrl = buildUtmUrl(baseUrl, selectedCopy.id, {
      source: 'facebook_group',
      medium: 'group_comment',
      campaign: 'growth_maestros',
      content: selectedCopy.id,
      term: trade,
    })

    const rawCopy = selectedCopy.copy
    const interpolated = interpolateSegmentedCopy(rawCopy, {
      trade: trade !== 'general' ? trade : 'profesional de obra',
      cityOrZone: zone,
      keyword: 'REGISTRO',
    })

    // Format final comment body (ensure URL is cleanly attached)
    const formattedComment = `${greeting}${interpolated} 👉 ${utmUrl}`

    return {
      targetPostId: post.id,
      authorId,
      authorName,
      intent: 'SUPPLY',
      selectedCopyId: selectedCopy.id,
      rawCopy,
      formattedComment,
      utmUrl,
      isSimulation,
    }
  }

  // DEMAND ROUTE
  const pool = getFilteredInterceptCopys({
    format: 'CON_URL',
    targetTrade: trade as TargetTrade,
  })

  const selectedCopy =
    pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]!
      : getRandomInterceptCopy({ format: 'CON_URL' }) ?? {
          id: 'CLI-RAP-CON-CON-01',
          copy: 'Cotiza gratis y compara hasta 4 propuestas de comerciantes verificados en dezzpo.com',
        }

  const utmUrl = buildClientUtmUrl(baseUrl, selectedCopy.id, {
    source: 'facebook_group',
    medium: 'group_interception',
    campaign: 'demand_homeowners',
    content: selectedCopy.id,
    term: trade,
  })

  const rawCopy = selectedCopy.copy
  const interpolated = interpolateClientCopy(rawCopy, {
    trade: trade !== 'general' ? trade : 'profesional calificado',
    cityOrZone: zone,
    keyword: 'COTIZAR',
  })

  const formattedComment = `${greeting}${interpolated} 👉 ${utmUrl}`

  return {
    targetPostId: post.id,
    authorId,
    authorName,
    intent: 'DEMAND',
    selectedCopyId: selectedCopy.id,
    rawCopy,
    formattedComment,
    utmUrl,
    isSimulation,
  }
}
