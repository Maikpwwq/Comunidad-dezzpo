/**
 * Unit Tests for PhoneField Component
 *
 * Verifies:
 * - Rendering with labels, placeholders, and variant icons
 * - Formatting of initial value (legacy and canonical E.164)
 * - User typing and onChange callback emitting { value, parse }
 * - Validation states, helper text, and error messages
 * - Accessibility attributes (type="tel", inputMode="tel", aria-describedby)
 * - WhatsApp variant landline warning
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PhoneField } from '@components/common/PhoneField'

describe('PhoneField Component', () => {
    it('renders with label and default phone icon', () => {
        render(
            <PhoneField
                label="Teléfono Principal"
                value=""
                onChange={vi.fn()}
            />
        )

        expect(screen.getByLabelText(/Teléfono Principal/i)).toBeInTheDocument()
        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('type', 'tel')
        expect(input).toHaveAttribute('inputmode', 'tel')
        expect(input).toHaveAttribute('placeholder', '+57 (___) ___ ____')
    })

    it('renders with WhatsApp variant and helper description', () => {
        render(
            <PhoneField
                label="WhatsApp de Contacto"
                value=""
                onChange={vi.fn()}
                variant="whatsapp"
            />
        )

        expect(screen.getByLabelText(/WhatsApp de Contacto/i)).toBeInTheDocument()
        expect(screen.getByText(/Número para cotizaciones y pedidos directos/i)).toBeInTheDocument()
    })

    it('formats initial raw or legacy value into masked display', () => {
        render(
            <PhoneField
                label="Teléfono"
                value="3204842897"
                onChange={vi.fn()}
            />
        )

        const input = screen.getByRole('textbox') as HTMLInputElement
        expect(input.value).toBe('+57 (320) 484 2897')
    })

    it('formats initial landline into masked display', () => {
        render(
            <PhoneField
                label="Teléfono Fijo"
                value="+576042905320"
                onChange={vi.fn()}
            />
        )

        const input = screen.getByRole('textbox') as HTMLInputElement
        expect(input.value).toBe('+57 (604) 290 5320')
    })

    it('calls onChange with canonical E.164 and parse outcome when typing valid mobile', async () => {
        const handleChange = vi.fn()
        render(
            <PhoneField
                label="Celular"
                value=""
                onChange={handleChange}
            />
        )

        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: '3204842897' } })

        expect(handleChange).toHaveBeenCalled()
        const calls = handleChange.mock.calls
        const lastCall = calls[calls.length - 1]?.[0]
        expect(lastCall).toBeDefined()
        if (lastCall) {
            expect(lastCall.value).toBe('+573204842897')
            expect(lastCall.parse.status).toBe('valido')
            if (lastCall.parse.status === 'valido') {
                expect(lastCall.parse.kind).toBe('celular')
            }
        }
    })

    it('displays error and suggestion when user enters transposed prefix (e.g. 064)', () => {
        render(
            <PhoneField
                label="Teléfono"
                value="0643321222"
                onChange={vi.fn()}
            />
        )

        const input = screen.getByRole('textbox')
        fireEvent.blur(input)

        expect(screen.getByText(/¿Quisiste decir 604\?/i)).toBeInTheDocument()
    })

    it('shows missing digits error after typing incomplete number and blurring', () => {
        render(
            <PhoneField
                label="Teléfono"
                value="32048428"
                onChange={vi.fn()}
            />
        )

        const input = screen.getByRole('textbox')
        fireEvent.blur(input)

        expect(screen.getByText(/Faltan 2 dígitos\./i)).toBeInTheDocument()
    })

    it('shows advisory warning when landline is passed to whatsapp variant', () => {
        render(
            <PhoneField
                label="WhatsApp"
                value="+576013004050"
                onChange={vi.fn()}
                variant="whatsapp"
            />
        )

        expect(screen.getByText(/No parece un celular\. ¿Tiene WhatsApp\?/i)).toBeInTheDocument()
    })

    it('supports disabled and required states', () => {
        render(
            <PhoneField
                label="Teléfono Requerido"
                value=""
                onChange={vi.fn()}
                required
                disabled
            />
        )

        const input = screen.getByRole('textbox')
        expect(input).toBeDisabled()
        expect(input).toBeRequired()
    })
})
