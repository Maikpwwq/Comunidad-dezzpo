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
  DISAMBIGUATION_JOB_SEEKER_REGEX,
  DISAMBIGUATION_HIRING_REGEX,
  type TargetTrade,
} from '@/types/interceptCopys'
import { bogotaZoneNames, standardCityZoneNames } from '@assets/data/ListadoZonas'
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
  { pattern: DISAMBIGUATION_JOB_SEEKER_REGEX },
  { pattern: /\b(?:ofre[sz]co|ofre[sz]cemos|ofrecemos|brindo|brindamos|presto|prestamos|se\s+ofrece)\s+(?:mis\s+|nuestros\s+|el\s+servicio\s+de\s+)?servicios/i },
  { pattern: /\bmaestro\s+de\s+(?:obra|construcci[oó]n|acabados|obra\s+civil)\b/i, trade: 'maestro' },
  { pattern: /\bsomos?\s+contratistas?\b/i, trade: 'contratista' },
  { pattern: /\bplomer[oí]a?\s+(?:disponible|a\s+domicilio|garantizada|profesional|24\s*(?:\/|\s*horas?))\b/i, trade: 'plomero' },
  { pattern: /\belectricista\s+(?:certificado|a\s+domicilio|disponible|instalador|profesional)\b/i, trade: 'electricista' },
  { pattern: /\bpintor\s+(?:profesional|disponible|a\s+domicilio|experto|calificado)\b/i, trade: 'pintor' },
  { pattern: /\bse\s+realizan\s+trabajos?\b/i },
  { pattern: /\b(?:realizo|realizamos|hago|hacemos|ejecuto|ejecutamos)\s+trabajos?\s+de\b/i },
  { pattern: /\b(?:a\s+la\s+orden|a\s+sus?\s+[oó]rdenes)\s+(?:para|en)\s+(?:cualquier|todo\s+tipo\s+de|trabajos?|obras?|remodelaci[oó]n|pintura|enchape|acabados)\b/i },
  { pattern: /\bcuento\s+con\s+experiencia\s+en\b/i },
  { pattern: /\bhacemos\s+(?:estuco|pintura|remodelaci[oó]n|enchape|mantenimiento|drywall|carpinter[ií]a|acabados|alba[ñn]iler[ií]a)\b/i },
  { pattern: /\benchapador\s+profesional|instalador\s+de\s+piso/i, trade: 'albanil' },
  { pattern: /\btrabajos\s+de\s+(?:construcci[oó]n|remodelaci[oó]n|plomer[ií]a|electricidad|carpinter[ií]a|ornamentaci[oó]n|cerrajer[ií]a|impermeabilizaci[oó]n|enchape|drywall|alba[ñn]iler[ií]a)\b/i },
  { pattern: /\bdisponible\s+para\s+(?:trabajar|obras|contratos|turnos|reparaciones|proyectos)\b/i },
  { pattern: /\bservicio\s+de\s+(?:estuco|pintura|drywall|impermeabilizaci[oó]n|techos|calentadores|plomer[ií]a|electricidad)\b/i },
  { pattern: /\btaller\s+de\s+(?:ornamentaci[oó]n|carpinter[ií]a|cerrajer[ií]a|soldadura|aluminio|estructuras)\b/i, trade: 'maestro' },
]

const DEMAND_PATTERNS: readonly { pattern: RegExp; trade?: TargetTrade }[] = [
  { pattern: DISAMBIGUATION_HIRING_REGEX },
  { pattern: /\b(?:busco|solicito|necesito|requiero|se\s+busca)\s+(?:a\s+un\s+|un\s+|una\s+)?(?:maestro|plomero|electricista|pintor|remodelador|alba[ñn]il|alva[ñn]il|contratista|t[eé]cnico|instalador|carpintero|cerrajero|soldador|vidriero|enchapador|ayudante|oficial|cuadrilla|personal|operario|toder[oa])\b/i },
  { pattern: /\balg[uú]n\s+(?:maestro|plomero|electricista|pintor|soldador|alba[ñn]il|t[eé]cnico|remodelador|profesional)\s+(?:de\s+obra\s+)?(?:disponible|que\s+(?:pueda|sepa|tenga|haga))\b/i },
  { pattern: /\b(?:requiero|requerimos|necesito|necesitamos|busco|solicito|se\s+busca)\s+(?:a\s+un\s+|un\s+)?(?:maestro|profesional|especialista|t[eé]cnico|persona)\s+(?:para|de)\s+(?:remodelar|enchape|obra\s+civil|construir|pintar|arreglar|pa[ñn]ete|estuco|drywall|soldadura)\b/i },
  { pattern: /\b(?:busco|necesito|solicito|requiero)\s+(?:a\s+)?(?:qui[eé]n|quien|alguien|persona|gente)\s+(?:que\s+)?(?:trabaje|haga|sepa|pueda|realice|repare|instale|pinte|enchape|suelde|arme|construya|remodele)\b/i },
  { pattern: /\balguien\s+que\s+(?:haga|sepa|trabaje|repare|instale|pinte|enchape|impermeabilice|suelde|arme|drywall|cambie|destape|arregle)\b/i },
  { pattern: /\bqui[eé]n\s+para\s+(?:pintar|remodelar|instalar|pegar|pa[ñn]etar|estucar|enchapar|hacer|soldar|destapar)\b/i },
  { pattern: /\b(?:qui[eé]n|quien|alguien)\s+(?:que\s+me\s+haga|que\s+me\s+ayude\s+con|que\s+me\s+colabore\s+con)\b/i },
  { pattern: /\bcotizaci[oó]n\s+(?:para|de|urgente)\b/i },
  { pattern: /\brecomienden\s+(?:un\s+|una\s+|buen\s+|buena\s+)?(?:maestro|plomero|electricista|pintor|remodelador|carpintero|cerrajero|soldador|alba[ñn]il|t[eé]cnico)\b/i },
  { pattern: /\bcu[aá]nto\s+(?:cobran|vale|cuesta|sale)\s+por\b/i },
  { pattern: /\bpresupuesto\s+(?:para|de)\b/i },
  { pattern: /\bqui[eé]n\s+(?:hace|conoce\s+un|me\s+recomienda)\b/i },
  { pattern: /\burgente\s*[:-]?\s*(?:plomero|electricista|fuga|corto\s*circuito|destape|gotera|cerradura|da[ñn]o)\b/i },
  { pattern: /\baver[ií]a\s+de\s+(?:tuber[ií]a|luz|agua|ba[ñn]o|calentador|gas|cerradura|chapa)\b/i },
  { pattern: /\b(?:filtraci[oó]n|humedad|gotera)\s+en\s+(?:techo|pared|teja|cubierta|piso)\b/i },
]

const TRADE_LOOKUP: readonly { keyword: RegExp; trade: TradeSpecialty }[] = [
  { keyword: /plomer[oí]a|tubo|tuber[ií]a|fuga|grifo|grifer[ií]a|inodoro|destape|ca[ñn]er[ií]a|lavamanos|sif[oó]n|hidr[aá]ulic|motobomba|calentador|gasodom[eé]stico|red\s+de\s+gas/i, trade: 'plomero' },
  { keyword: /electric|corto\s*circuito|breaker|luz|cableado|tomacorriente|trif[aá]sica|iluminaci[oó]n|tablero\s+el[eé]ctrico|acometida|toma\b/i, trade: 'electricista' },
  { keyword: /pintur|pintor|estuco|fachada|vinilo|impermeabiliz|resan|esmalt|ep[oó]xic/i, trade: 'pintor' },
  { keyword: /ornamentac|soldador|soldadura|reja|port[oó]n|estructura\s+met[aá]lica|carpinter[ií]a\s+met[aá]lica|cerrajer/i, trade: 'maestro' },
  { keyword: /maestro(?:\s+de\s+obra)?|obra\s+civil|oficial\s+de\s+obra|ayudante\s+de\s+construcci[oó]n|pa[ñn]ete|mamposter[ií]a|fundici[oó]n|cimentaci[oó]n|obra\s+negra/i, trade: 'maestro' },
  { keyword: /remodela|obra\s+blanca|drywall|cielo\s+raso|superboard|enchap|porcelanato|baldosa|piso|cocina\s+integral|ba[ñn]o/i, trade: 'remodelador' },
  { keyword: /alba[ñn]il|alva[ñn]il|bloque|cemento|viga|mortero/i, trade: 'albanil' },
  { keyword: /contratista|licitaci|ingenier[ií]a|arquitectura|c[aá]lculo\s+estructural|topograf|peritaje|aval[uú]o|geotecnia|estudio\s+de\s+suelo/i, trade: 'contratista' },
  { keyword: /carpinter|ebanist|closet|madera|puerta\s+de\s+madera|mueble\s+modular/i, trade: 'maestro' },
  { keyword: /vidrio|vidrier|ventana\s+aluminio|espejo|divisi[oó]n\s+de\s+ba[ñn]o/i, trade: 'remodelador' },
  { keyword: /aire\s+acondicionado|refrigeraci[oó]n|hvac/i, trade: 'electricista' },
  { keyword: /fumigac|control\s+de\s+plaga|desinfecci[oó]n/i, trade: 'remodelador' },
]

/**
 * Build dynamic zone lookup regexes strictly referencing ListadoZonas catalog.
 */
function buildZonesLookup(): readonly { pattern: RegExp; zoneName: string }[] {
  const lookups: { pattern: RegExp; zoneName: string }[] = []
  
  // Specific local mapping with regex handling for accents & multi-word
  const allZones = { ...bogotaZoneNames, ...standardCityZoneNames }
  
  for (const [slug, name] of Object.entries(allZones)) {
    // Generate safe regex pattern from slug / name
    const sanitized = slug.replace(/-/g, '\\s+')
    // Match word boundaries
    const pattern = new RegExp(`\\b${sanitized}\\b`, 'i')
    lookups.push({ pattern, zoneName: name })
  }

  // Also include accented common forms
  lookups.push(
    { pattern: /\bsuba\b/i, zoneName: 'Suba' },
    { pattern: /\busaqu[eé]n\b/i, zoneName: 'Usaquén' },
    { pattern: /\bchapinero\b/i, zoneName: 'Chapinero' },
    { pattern: /\bengativ[aá]\b/i, zoneName: 'Engativá' },
    { pattern: /\bkennedy\b/i, zoneName: 'Kennedy' },
    { pattern: /\bbosa\b/i, zoneName: 'Bosa' },
    { pattern: /\bfontib[oó]n\b/i, zoneName: 'Fontibón' },
    { pattern: /\bteusaquillo\b/i, zoneName: 'Teusaquillo' },
    { pattern: /\bbarrios\s+unidos\b/i, zoneName: 'Barrios Unidos' },
    { pattern: /\bpuente\s+aranda\b/i, zoneName: 'Puente Aranda' },
    { pattern: /\btunjuelito\b/i, zoneName: 'Tunjuelito' },
    { pattern: /\bciudad\s+bol[ií]var\b/i, zoneName: 'Ciudad Bolívar' },
    { pattern: /\bsan\s+crist[oó]bal\b/i, zoneName: 'San Cristóbal' },
    { pattern: /\bsanta\s+fe\b/i, zoneName: 'Santa Fe' },
    { pattern: /\bla\s+candelaria\b/i, zoneName: 'La Candelaria' },
    { pattern: /\blos\s+m[aá]rtires\b/i, zoneName: 'Los Mártires' },
    { pattern: /\bantonio\s+nari[ñn]o\b/i, zoneName: 'Antonio Nariño' },
    { pattern: /\busme\b/i, zoneName: 'Usme' },
    { pattern: /\bsumapaz\b/i, zoneName: 'Sumapaz' },
    { pattern: /\bch[ií]a\b/i, zoneName: 'Chía' },
    { pattern: /\bsoacha\b/i, zoneName: 'Soacha' },
    { pattern: /\bcajic[aá]\b/i, zoneName: 'Cajicá' },
    { pattern: /\bzipaquir[aá]\b/i, zoneName: 'Zipaquirá' },
    { pattern: /\bcota\b/i, zoneName: 'Cota' },
    { pattern: /\bfunza\b/i, zoneName: 'Funza' },
    { pattern: /\bmosquera\b/i, zoneName: 'Mosquera' },
    { pattern: /\bmadrid\b/i, zoneName: 'Madrid' },
    { pattern: /\bfacatativ[aá]\b/i, zoneName: 'Facatativá' },
    { pattern: /\bla\s+calera\b/i, zoneName: 'La Calera' },
    { pattern: /\bsop[oó]\b/i, zoneName: 'Sopó' }
  )

  return lookups
}

const ZONES_LOOKUP = buildZonesLookup()

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

  // 3. Priority Disambiguation: Check if author is a job seeker (SUPPLY)
  if (DISAMBIGUATION_JOB_SEEKER_REGEX.test(normalized)) {
    return {
      intent: 'SUPPLY',
      confidence: 'HIGH',
      detectedTrade: tradeCandidate,
      matchedPatterns: [DISAMBIGUATION_JOB_SEEKER_REGEX.source],
      ...(extractedZone ? { extractedZone } : {}),
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

  // 5. Match Supply Patterns
  for (const { pattern, trade } of SUPPLY_PATTERNS) {
    if (pattern.test(normalized)) {
      matchedSupply.push(pattern.source)
      if (trade && tradeCandidate === 'general') {
        tradeCandidate = trade
      }
    }
  }

  // 6. Intent Resolution (Demand takes priority when hiring, unless supply was explicit)
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
