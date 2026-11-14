import { describe, it, expect } from 'vitest'
import {
    generatePhB2bContract,
    type PhContractParties,
    type PhContractTerms,
} from '@/services/contracts/b2bPhContractService'

describe('B2B PH Contract Service (Ley 675 de 2001)', () => {
    const mockParties: PhContractParties = {
        copropiedadName: 'Conjunto Residencial Torres del Parque PH',
        copropiedadNit: '900.123.456-8',
        adminName: 'Carolina Morales',
        adminCedula: '52.345.678',
        providerRazonSocial: 'Ingeniería y Fachadas Bogotá SAS',
        providerNitOrCedula: '901.888.999-2',
        providerRepresentante: 'Carlos Mario Gómez',
        providerMatriculaProfesional: 'COPNIA-88231',
    }

    const mockTerms: PhContractTerms = {
        agreedAmountCop: 45000000,
        durationWeeks: 6,
        requiresCouncilApproval: true,
        councilApprovalDate: '2026-11-10',
        insuranceRequired: true,
        partidas: [
            {
                areaName: 'Fachada Occidental',
                scopeDescription: 'Hidrolavado y aplicación de pintura elastomérica impermeable',
                estimatedBudgetCop: 28000000,
            },
            {
                areaName: 'Cubierta y Canales',
                scopeDescription: 'Impermeabilización con manto asfáltico 4mm y sellado de juntas',
                estimatedBudgetCop: 17000000,
            },
        ],
    }

    it('generates contract with mandatory header badge and legal citations', () => {
        const contract = generatePhB2bContract(mockParties, mockTerms)

        expect(contract.headerBadge).toBe('BORRADOR PARA REVISIÓN LEGAL')
        expect(contract.legalFrameworkCitation).toContain('Ley 675 de 2001')
        expect(contract.legalFrameworkCitation).toContain('Ley 527 de 1999')
    })

    it('includes clauses for parties, common area partidas and council approval', () => {
        const contract = generatePhB2bContract(mockParties, mockTerms)

        expect(contract.clauses.length).toBe(7)
        expect(contract.clauses[0]?.content).toContain('Conjunto Residencial Torres del Parque PH')
        expect(contract.clauses[1]?.content).toContain('Fachada Occidental')
        expect(contract.clauses[1]?.content).toContain('Cubierta y Canales')
        expect(contract.clauses[3]?.content).toContain('Consejo de Administración')
    })

    it('incorporates platform liability disclaimer for Comunidad Dezzpo', () => {
        const contract = generatePhB2bContract(mockParties, mockTerms)

        const disclaimerClause = contract.clauses.find((c) =>
            c.title.includes('DESLINDE DE RESPONSABILIDAD')
        )
        expect(disclaimerClause).toBeDefined()
        expect(disclaimerClause?.content).toContain('Comunidad Dezzpo actúa exclusivamente como facilitador tecnológico')
        expect(disclaimerClause?.content).toContain('NO asume responsabilidad solidaria')
    })

    it('formats and validates copropiedad NIT', () => {
        const contract = generatePhB2bContract(mockParties, mockTerms)
        expect(contract.isNitValid).toBe(true)
        expect(contract.formattedNit).toContain('900.123.456-8')
    })
})
