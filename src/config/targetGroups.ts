/**
 * Target Facebook Groups Seed Registry & Scanning Prioritization
 * 
 * Central registry of high-density Facebook groups for the Social Interception Engine
 * (Meta Graph API / MCP Worker), configured with weights, categories, and geographical tags.
 */

export type GroupPriority = 'HIGH' | 'MEDIUM' | 'LOW'
export type GroupCategory = 'DEMAND_HEAVY' | 'OFFER_HEAVY' | 'MIXED'

export interface TargetGroup {
  id: string // ID extracted from the Facebook Group URL
  name: string
  url: string
  priority: GroupPriority
  weight: number // Numeric 1 to 10 for dynamic sorting & queue prioritization
  category: GroupCategory
  locationTag: string // e.g. 'Bogotá', 'Soacha', 'Colombia'
  isActive: boolean
  lastScannedAt?: string
}

/**
 * Seed registry containing the top identified Facebook groups in Colombia.
 */
export const SEED_TARGET_GROUPS: readonly TargetGroup[] = [
  {
    id: '275440905107909',
    name: 'Maestros y ayudantes de construcción Bogotá – Colombia',
    url: 'https://www.facebook.com/groups/275440905107909',
    priority: 'HIGH',
    weight: 10,
    category: 'MIXED',
    locationTag: 'Bogotá',
    isActive: true,
  },
  {
    id: '978199671167845',
    name: 'Ciudad verde Soacha',
    url: 'https://www.facebook.com/groups/978199671167845',
    priority: 'HIGH',
    weight: 9,
    category: 'DEMAND_HEAVY',
    locationTag: 'Soacha',
    isActive: true,
  },
  {
    id: '241268652936364',
    name: 'trabajo construccion Maestros de obra-oficiales-ayudantes Bogotá',
    url: 'https://www.facebook.com/groups/241268652936364',
    priority: 'HIGH',
    weight: 9,
    category: 'OFFER_HEAVY',
    locationTag: 'Bogotá',
    isActive: true,
  },
  {
    id: '815186272485983',
    name: 'comunidad ciudad verde 🌿',
    url: 'https://www.facebook.com/groups/815186272485983',
    priority: 'HIGH',
    weight: 8,
    category: 'DEMAND_HEAVY',
    locationTag: 'Soacha',
    isActive: true,
  },
  {
    id: '584082385090211',
    name: 'Maestros de la construcción en Colombia',
    url: 'https://www.facebook.com/groups/584082385090211',
    priority: 'MEDIUM',
    weight: 7,
    category: 'MIXED',
    locationTag: 'Colombia',
    isActive: true,
  },
] as const

/**
 * Key-Value lookup mapping Group ID -> Human Readable Group Name.
 */
export const TARGET_GROUPS_NAME_MAP: Record<string, string> = Object.freeze(
  SEED_TARGET_GROUPS.reduce<Record<string, string>>((acc, group) => {
    acc[group.id] = group.name
    return acc
  }, {})
)

/**
 * Returns all active target groups sorted descending by weight / priority.
 */
export function getPrioritizedTargetGroups(groups: readonly TargetGroup[] = SEED_TARGET_GROUPS): TargetGroup[] {
  return [...groups]
    .filter((g) => g.isActive)
    .sort((a, b) => b.weight - a.weight)
}

/**
 * Retrieves a target group by its Facebook ID.
 */
export function getTargetGroupById(
  id: string,
  groups: readonly TargetGroup[] = SEED_TARGET_GROUPS
): TargetGroup | undefined {
  return groups.find((g) => g.id === id)
}

/**
 * Filters target groups by category (e.g. DEMAND_HEAVY, OFFER_HEAVY, MIXED).
 */
export function getTargetGroupsByCategory(
  category: GroupCategory,
  groups: readonly TargetGroup[] = SEED_TARGET_GROUPS
): TargetGroup[] {
  return groups.filter((g) => g.isActive && g.category === category)
}

/**
 * Filters target groups by location tag (case-insensitive substring or exact match).
 */
export function getTargetGroupsByLocation(
  locationTag: string,
  groups: readonly TargetGroup[] = SEED_TARGET_GROUPS
): TargetGroup[] {
  const normalized = locationTag.trim().toLowerCase()
  return groups.filter(
    (g) => g.isActive && g.locationTag.toLowerCase().includes(normalized)
  )
}
