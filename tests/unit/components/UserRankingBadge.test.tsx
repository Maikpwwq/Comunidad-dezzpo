import { describe, it, expect } from 'vitest'
import { getBadgeDetails, COMERCIANTE_RANKINGS, PROPIETARIO_RANKINGS } from '@config/userClassification.config'

describe('User Classification & Badge Helpers (Component Testing)', () => {
    describe('Comerciantes Classification Rankings Config', () => {
        it('has 3 classification axes (Categoría, Clasificación Escala, Grado Experiencia)', () => {
            expect(COMERCIANTE_RANKINGS.categoria).toBeDefined()
            expect(COMERCIANTE_RANKINGS.clasificacion).toBeDefined()
            expect(COMERCIANTE_RANKINGS.gradacion).toBeDefined()
        })

        it('returns correct badge chip metadata for Persona Natural comerciante', () => {
            const badge = getBadgeDetails('Persona Natural')
            expect(badge).toBeDefined()
            expect(badge.name).toBe('Persona Natural')
            expect(badge.bgLight).toBeDefined()
            expect(badge.color).toBeDefined()
        })

        it('returns fallback badge details for unknown or empty classification string', () => {
            const badge = getBadgeDetails('')
            expect(badge.name).toBe('Sin Asignar')
            expect(badge.bgLight).toBe('#f1f5f9')
        })
    })

    describe('Propietarios Classification Rankings Config', () => {
        it('has 3 classification axes for Propietarios', () => {
            expect(PROPIETARIO_RANKINGS.categoria).toBeDefined()
            expect(PROPIETARIO_RANKINGS.clasificacion).toBeDefined()
            expect(PROPIETARIO_RANKINGS.gradacion).toBeDefined()
        })
    })
})
