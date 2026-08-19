import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDuplicateNameCheck } from '@hooks/useDuplicateNameCheck'
import * as duplicateService from '@services/validation/duplicateCheckService'

vi.mock('@services/validation/duplicateCheckService', () => ({
    checkComercianteNameAvailability: vi.fn(),
    checkTiendaNameAvailability: vi.fn(),
    normalizeSearchString: (str: string) => str.trim().toLowerCase(),
}))

describe('useDuplicateNameCheck Hook Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('initializes with idle status and empty matches', () => {
        const { result } = renderHook(() =>
            useDuplicateNameCheck({ type: 'comerciante' })
        )

        expect(result.current.status).toBe('idle')
        expect(result.current.matches).toEqual([])
        expect(result.current.isChecking).toBe(false)
    })

    it('validates comerciante name and sets matches_found when duplicates exist', async () => {
        vi.mocked(duplicateService.checkComercianteNameAvailability).mockResolvedValueOnce({
            isAvailable: false,
            exactMatch: true,
            matches: [
                {
                    userId: 'u1',
                    userName: 'Comercio Existente',
                    similarity: 'exact',
                },
            ],
        })

        const { result } = renderHook(() =>
            useDuplicateNameCheck({ type: 'comerciante' })
        )

        await act(async () => {
            await result.current.handleBlur('Comercio Existente')
        })

        expect(result.current.status).toBe('matches_found')
        expect(result.current.matches.length).toBe(1)
        expect(result.current.exactMatch).toBe(true)
    })

    it('sets available status when name has no duplicates', async () => {
        vi.mocked(duplicateService.checkComercianteNameAvailability).mockResolvedValueOnce({
            isAvailable: true,
            exactMatch: false,
            matches: [],
        })

        const { result } = renderHook(() =>
            useDuplicateNameCheck({ type: 'comerciante' })
        )

        await act(async () => {
            await result.current.handleBlur('Comercio Nuevo')
        })

        expect(result.current.status).toBe('available')
        expect(result.current.matches).toEqual([])
    })

    it('resets state properly when reset() is called', async () => {
        vi.mocked(duplicateService.checkComercianteNameAvailability).mockResolvedValueOnce({
            isAvailable: false,
            exactMatch: true,
            matches: [{ userId: 'u1', userName: 'Test', similarity: 'exact' }],
        })

        const { result } = renderHook(() =>
            useDuplicateNameCheck({ type: 'comerciante' })
        )

        await act(async () => {
            await result.current.handleBlur('Test')
        })

        expect(result.current.status).toBe('matches_found')

        act(() => {
            result.current.reset()
        })

        expect(result.current.status).toBe('idle')
        expect(result.current.matches).toEqual([])
    })
})
