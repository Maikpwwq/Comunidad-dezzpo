import { describe, it, expect } from 'vitest'
import {
  SEED_TARGET_GROUPS,
  TARGET_GROUPS_NAME_MAP,
  getPrioritizedTargetGroups,
  getTargetGroupById,
  getTargetGroupsByCategory,
  getTargetGroupsByLocation,
  type TargetGroup,
} from '@/config/targetGroups'

describe('Target Facebook Groups Configuration & Prioritization', () => {
  it('should contain all 5 required seed target groups with complete metadata', () => {
    expect(SEED_TARGET_GROUPS.length).toBe(5)

    const ids = new Set(SEED_TARGET_GROUPS.map((g) => g.id))
    expect(ids.has('275440905107909')).toBe(true) // Maestros y ayudantes Bogotá
    expect(ids.has('978199671167845')).toBe(true) // Ciudad verde Soacha
    expect(ids.has('241268652936364')).toBe(true) // trabajo construccion Maestros Bogotá
    expect(ids.has('815186272485983')).toBe(true) // comunidad ciudad verde 🌿
    expect(ids.has('584082385090211')).toBe(true) // Maestros de la construcción Colombia

    for (const group of SEED_TARGET_GROUPS) {
      expect(group.name.length).toBeGreaterThan(3)
      expect(group.url.startsWith('https://www.facebook.com/groups/')).toBe(true)
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(group.priority)
      expect(group.weight).toBeGreaterThanOrEqual(1)
      expect(group.weight).toBeLessThanOrEqual(10)
      expect(['DEMAND_HEAVY', 'OFFER_HEAVY', 'MIXED']).toContain(group.category)
      expect(group.locationTag.length).toBeGreaterThan(1)
      expect(group.isActive).toBe(true)
    }
  })

  it('should map IDs to human-readable group names via TARGET_GROUPS_NAME_MAP', () => {
    expect(TARGET_GROUPS_NAME_MAP['275440905107909']).toBe(
      'Maestros y ayudantes de construcción Bogotá – Colombia'
    )
    expect(TARGET_GROUPS_NAME_MAP['978199671167845']).toBe('Ciudad verde Soacha')
    expect(TARGET_GROUPS_NAME_MAP['815186272485983']).toBe('comunidad ciudad verde 🌿')
  })

  it('should sort groups by weight in descending order via getPrioritizedTargetGroups', () => {
    const prioritized = getPrioritizedTargetGroups()
    expect(prioritized.length).toBe(5)

    // Verify descending order
    for (let i = 0; i < prioritized.length - 1; i++) {
      expect(prioritized[i]!.weight).toBeGreaterThanOrEqual(prioritized[i + 1]!.weight)
    }

    // Top weighted should be Maestros y ayudantes (weight: 10)
    expect(prioritized[0]?.id).toBe('275440905107909')
    expect(prioritized[0]?.weight).toBe(10)
  })

  it('should filter out inactive groups in getPrioritizedTargetGroups', () => {
    const customList: TargetGroup[] = [
      {
        id: 'active_1',
        name: 'Active Group',
        url: 'https://www.facebook.com/groups/active_1',
        priority: 'MEDIUM',
        weight: 6,
        category: 'MIXED',
        locationTag: 'Bogotá',
        isActive: true,
      },
      {
        id: 'inactive_1',
        name: 'Inactive Group',
        url: 'https://www.facebook.com/groups/inactive_1',
        priority: 'HIGH',
        weight: 10,
        category: 'MIXED',
        locationTag: 'Bogotá',
        isActive: false,
      },
    ]

    const result = getPrioritizedTargetGroups(customList)
    expect(result.length).toBe(1)
    expect(result[0]?.id).toBe('active_1')
  })

  it('should retrieve a target group by ID via getTargetGroupById', () => {
    const group = getTargetGroupById('978199671167845')
    expect(group).toBeDefined()
    expect(group?.name).toBe('Ciudad verde Soacha')
    expect(group?.category).toBe('DEMAND_HEAVY')
    expect(group?.locationTag).toBe('Soacha')

    const nonExistent = getTargetGroupById('999999999999')
    expect(nonExistent).toBeUndefined()
  })

  it('should filter target groups by category via getTargetGroupsByCategory', () => {
    const demandGroups = getTargetGroupsByCategory('DEMAND_HEAVY')
    expect(demandGroups.length).toBe(2)
    for (const g of demandGroups) {
      expect(g.category).toBe('DEMAND_HEAVY')
      expect(g.isActive).toBe(true)
    }

    const offerGroups = getTargetGroupsByCategory('OFFER_HEAVY')
    expect(offerGroups.length).toBe(1)
    expect(offerGroups[0]?.id).toBe('241268652936364')

    const mixedGroups = getTargetGroupsByCategory('MIXED')
    expect(mixedGroups.length).toBe(2)
  })

  it('should filter target groups by location via getTargetGroupsByLocation', () => {
    const soachaGroups = getTargetGroupsByLocation('Soacha')
    expect(soachaGroups.length).toBe(2)
    for (const g of soachaGroups) {
      expect(g.locationTag).toBe('Soacha')
    }

    const bogotaGroups = getTargetGroupsByLocation('bogotá')
    expect(bogotaGroups.length).toBe(2)

    const colombiaGroups = getTargetGroupsByLocation('colombia')
    expect(colombiaGroups.length).toBe(1)
  })
})
