/**
 * Phone Domain Unit Tests — Golden Acceptance & Adversarial Battery
 *
 * Verifies all requirement cases from Tarea 05:
 * - Golden acceptance test cases (acceptance criteria)
 * - Adversarial inputs (Unicode digits, zero-width chars, prefix noise)
 * - Safe URL generation (tel: and wa.me)
 * - Message priority hierarchy (Invariant I9)
 */
import { describe, it, expect } from 'vitest'
import {
    parsePhone,
    formatPhone,
    toE164,
    toTelHref,
    toWhatsAppHref,
    getPhoneMessage,
} from '@services/phone'

describe('Phone Domain — Golden Acceptance Cases', () => {
    it('1. «+57 (604) 290 5320» (fijo) → guarda +576042905320 → muestra «+57 (604) 290 5320»', () => {
        const input = '+57 (604) 290 5320'
        const parsed = parsePhone(input)

        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+576042905320')
            expect(parsed.kind).toBe('fijo')
            expect(parsed.parts.countryCode).toBe('+57')
            expect(parsed.parts.national).toBe('6042905320')
        }
        expect(toE164(input)).toBe('+576042905320')
        expect(formatPhone(parsed)).toBe('+57 (604) 290 5320')
    })

    it('2. «+57 (320) 484 2897» (celular) → guarda +573204842897 → muestra «+57 (320) 484 2897»', () => {
        const input = '+57 (320) 484 2897'
        const parsed = parsePhone(input)

        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+573204842897')
            expect(parsed.kind).toBe('celular')
            expect(parsed.parts.countryCode).toBe('+57')
            expect(parsed.parts.national).toBe('3204842897')
        }
        expect(toE164(input)).toBe('+573204842897')
        expect(formatPhone(parsed)).toBe('+57 (320) 484 2897')
    })

    it('3. «+57 3245572516» → guarda +573245572516 → muestra «+57 (324) 557 2516»', () => {
        const input = '+57 3245572516'
        const parsed = parsePhone(input)

        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+573245572516')
            expect(parsed.kind).toBe('celular')
        }
        expect(toE164(input)).toBe('+573245572516')
        expect(formatPhone(parsed)).toBe('+57 (324) 557 2516')
    })

    it('4. «300-912-7030» → guarda +573009127030 → muestra «+57 (300) 912 7030»', () => {
        const input = '300-912-7030'
        const parsed = parsePhone(input)

        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+573009127030')
            expect(parsed.kind).toBe('celular')
        }
        expect(toE164(input)).toBe('+573009127030')
        expect(formatPhone(parsed)).toBe('+57 (300) 912 7030')
    })

    it('5. «313 7722163» → guarda +573137722163 → muestra «+57 (313) 772 2163»', () => {
        const input = '313 7722163'
        const parsed = parsePhone(input)

        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+573137722163')
            expect(parsed.kind).toBe('celular')
        }
        expect(toE164(input)).toBe('+573137722163')
        expect(formatPhone(parsed)).toBe('+57 (313) 772 2163')
    })

    it('6. «3504171850» y «3504171850,» → guarda +573504171850 → muestra «+57 (350) 417 1850»', () => {
        for (const input of ['3504171850', '3504171850,', '3504171850, ']) {
            const parsed = parsePhone(input)
            expect(parsed.status).toBe('valido')
            if (parsed.status === 'valido') {
                expect(parsed.e164).toBe('+573504171850')
                expect(parsed.kind).toBe('celular')
            }
            expect(toE164(input)).toBe('+573504171850')
            expect(formatPhone(parsed)).toBe('+57 (350) 417 1850')
        }
    })

    it('7. «064 3321222» → es un 604 mal escrito: prefijo 064 inválido, no se autocorrige, muestra mensaje con sugerencia', () => {
        const input = '064 3321222'
        const parsed = parsePhone(input)

        expect(parsed.status).toBe('invalido')
        if (parsed.status === 'invalido') {
            expect(parsed.issue).toBe('prefijo_invalido')
            expect(parsed.suggestion).toBe('604')
            expect(parsed.parts?.national).toBe('0643321222')
        }
        expect(toE164(input)).toBeNull()
        expect(formatPhone(parsed)).toBe('+57 (064) 332 1222')
        expect(getPhoneMessage(parsed)).toContain('Los fijos empiezan por 60X y los celulares por 3XX.')
        expect(getPhoneMessage(parsed)).toContain('¿Quisiste decir 604?')
    })

    it('8. Longitud: 9 cifras nacionales → incompleto; 11 → inválido; nunca se recorta ni completa en silencio', () => {
        // 9 cifras
        const input9 = '320484289'
        const parsed9 = parsePhone(input9)
        expect(parsed9.status).toBe('incompleto')
        if (parsed9.status === 'incompleto') {
            expect(parsed9.issue).toBe('faltan_digitos')
            expect(parsed9.digitDelta).toBe(1)
        }
        expect(toE164(input9)).toBeNull()
        expect(getPhoneMessage(parsed9)).toBe('Falta 1 dígito.')

        // 11 cifras
        const input11 = '32048428971'
        const parsed11 = parsePhone(input11)
        expect(parsed11.status).toBe('invalido')
        if (parsed11.status === 'invalido') {
            expect(parsed11.issue).toBe('sobran_digitos')
            expect(parsed11.digitDelta).toBe(1)
        }
        expect(toE164(input11)).toBeNull()
        expect(formatPhone(parsed11)).toBe('+57 (320) 484 28971')
        expect(getPhoneMessage(parsed11)).toBe('Sobra 1 dígito.')
    })
})

describe('Phone Domain — Adversarial & Noise Resistance Battery', () => {
    it('handles text label prefixes like "Tel:", "Cel.", "WhatsApp:" seamlessly', () => {
        expect(toE164('Tel: 320 484 2897')).toBe('+573204842897')
        expect(toE164('Cel. 310 234 5678')).toBe('+573102345678')
        expect(toE164('WhatsApp: +57 (300) 123 4567')).toBe('+573001234567')
        expect(toE164('Teléfono: 601 345 6789')).toBe('+576013456789')
    })

    it('handles international double-zero "0057" prefix', () => {
        const parsed = parsePhone('0057 320 484 2897')
        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+573204842897')
        }
    })

    it('converts Unicode fullwidth digits (０-９) to ASCII digits', () => {
        const fullwidth = '３２０４８４２８９７'
        const parsed = parsePhone(fullwidth)
        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+573204842897')
        }
    })

    it('converts Arabic-Indic digits (٠-٩) to ASCII digits', () => {
        const arabicIndic = '٣٢٠٤٨٤٢٨٩٧'
        const parsed = parsePhone(arabicIndic)
        expect(parsed.status).toBe('valido')
        if (parsed.status === 'valido') {
            expect(parsed.e164).toBe('+573204842897')
        }
    })

    it('cleans zero-width spaces, BOM, and NBSP characters', () => {
        const noisy = '\uFEFF\u200B320\u00A0484\u200E2897\u200F'
        expect(toE164(noisy)).toBe('+573204842897')
    })

    it('handles non-Colombian international numbers (+1, +34, +593)', () => {
        const us = parsePhone('+1 650 555 1234')
        expect(us.status).toBe('valido')
        if (us.status === 'valido') {
            expect(us.e164).toBe('+16505551234')
            expect(us.kind).toBe('otro')
            expect(formatPhone(us)).toBe('+1 (650) 5551234')
        }

        const spain = parsePhone('+34 912 345 678')
        expect(spain.status).toBe('valido')
        if (spain.status === 'valido') {
            expect(spain.e164).toBe('+34912345678')
        }

        const ecuador = parsePhone('+593 99 123 4567')
        expect(ecuador.status).toBe('valido')
        if (ecuador.status === 'valido') {
            expect(ecuador.e164).toBe('+593991234567')
        }
    })

    it('rejects invalid country codes and handles malformed country prefixes', () => {
        const invalidCountry = parsePhone('+9999 12345678')
        expect(invalidCountry.status).toBe('invalido')
        if (invalidCountry.status === 'invalido') {
            expect(invalidCountry.issue).toBe('codigo_pais_invalido')
        }
        expect(getPhoneMessage(invalidCountry)).toBe('Código de país no válido.')
    })

    it('handles all 7 official Colombian fixed-line prefixes (601-608)', () => {
        const fixedCodes = ['601', '602', '604', '605', '606', '607', '608']
        for (const code of fixedCodes) {
            const num = `${code}2345678`
            const parsed = parsePhone(num)
            expect(parsed.status).toBe('valido')
            if (parsed.status === 'valido') {
                expect(parsed.kind).toBe('fijo')
                expect(parsed.e164).toBe(`+57${num}`)
            }
        }

        // Invalid fixed prefixes: 603 and 609
        expect(parsePhone('6032345678').status).toBe('invalido')
        expect(parsePhone('6092345678').status).toBe('invalido')
    })
})

describe('Phone Domain — Safe Deep Link Generation (toTelHref & toWhatsAppHref)', () => {
    it('toTelHref generates valid tel: URI only from valid phones', () => {
        expect(toTelHref('+57 (320) 484 2897')).toBe('tel:+573204842897')
        expect(toTelHref('604 290 5320')).toBe('tel:+576042905320')
        expect(toTelHref('12345')).toBeNull()
        expect(toTelHref('')).toBeNull()
        expect(toTelHref(null)).toBeNull()
        expect(toTelHref('javascript:alert(1)')).toBeNull()
    })

    it('toWhatsAppHref generates clean wa.me without plus and with encoded message', () => {
        expect(toWhatsAppHref('+57 320 484 2897')).toBe('https://wa.me/573204842897')
        expect(toWhatsAppHref('3204842897')).toBe('https://wa.me/573204842897')
        
        const withMsg = toWhatsAppHref('3204842897', 'Hola, ¿cómo estás?')
        expect(withMsg).toBe(`https://wa.me/573204842897?text=${encodeURIComponent('Hola, ¿cómo estás?')}`)
        expect(withMsg).toContain('https://wa.me/573204842897?text=')

        // Prevents double-57 bug
        expect(toWhatsAppHref('+573204842897')).toBe('https://wa.me/573204842897')

        // Null on invalid
        expect(toWhatsAppHref('12345')).toBeNull()
        expect(toWhatsAppHref(null)).toBeNull()
    })

    it('warns when a Colombian landline is used for a whatsapp variant', () => {
        const landline = parsePhone('6013004050')
        expect(landline.status).toBe('valido')
        if (landline.status === 'valido') {
            expect(landline.kind).toBe('fijo')
        }
        expect(getPhoneMessage(landline, 'whatsapp')).toBe('No parece un celular. ¿Tiene WhatsApp?')
        expect(getPhoneMessage(landline, 'telefono')).toBeNull()
    })
})

describe('Phone Domain — Edge Branch Coverage', () => {
    it('covers all formatPhone input branches (parts object, parse object, partial lengths)', () => {
        expect(formatPhone(null)).toBe('')
        expect(formatPhone(undefined)).toBe('')
        expect(formatPhone('')).toBe('')
        expect(formatPhone({ countryCode: '+57', national: '' })).toBe('+57')
        expect(formatPhone({ countryCode: '+57', national: '3' })).toBe('+57 (3')
        expect(formatPhone({ countryCode: '+57', national: '320' })).toBe('+57 (320')
        expect(formatPhone({ countryCode: '+57', national: '3204' })).toBe('+57 (320) 4')
        expect(formatPhone({ countryCode: '+57', national: '320484' })).toBe('+57 (320) 484')
        expect(formatPhone({ countryCode: '+57', national: '3204842' })).toBe('+57 (320) 484 2')
        expect(formatPhone({ countryCode: '+57', national: '320484289712' })).toBe('+57 (320) 484 289712')
        
        // Non-Colombia formatPhone
        expect(formatPhone({ countryCode: '+1', national: '65' })).toBe('+1 (65')
        expect(formatPhone({ countryCode: '+1', national: '6505551234' })).toBe('+1 (650) 5551234')

        // PhoneParse with no parts
        const invalidNoParts = parsePhone('+9999123')
        expect(formatPhone(invalidNoParts)).toBe('+9999123')
    })

    it('covers international dialing branches and malformed prefixes', () => {
        // 00 prefix with invalid country code
        const invalid00 = parsePhone('009999123456')
        expect(invalid00.status).toBe('invalido')
        if (invalid00.status === 'invalido') {
            expect(invalid00.issue).toBe('codigo_pais_invalido')
        }

        // Explicit country code with empty national part
        const emptyAfterPlus = parsePhone('+57')
        expect(emptyAfterPlus.status).toBe('incompleto')
        if (emptyAfterPlus.status === 'incompleto') {
            expect(emptyAfterPlus.issue).toBe('faltan_digitos')
        }

        // 12-digit starting with 57 but not mobile or valid fixed
        const weird57 = parsePhone('579991234567')
        expect(weird57.status).toBe('invalido')

        // International (non-+57) with defaultCountry option
        const usPhone = parsePhone('6505551234', { defaultCountry: '1' })
        expect(usPhone.status).toBe('valido')
        expect(usPhone.parts?.countryCode).toBe('+1')

        // International too short
        const shortIntl = parsePhone('12', { defaultCountry: '+1' })
        expect(shortIntl.status).toBe('incompleto')

        // International too long (> 15 digits total)
        const longIntl = parsePhone('1234567890123456', { defaultCountry: '+1' })
        expect(longIntl.status).toBe('invalido')
        if (longIntl.status === 'invalido') {
            expect(longIntl.issue).toBe('sobran_digitos')
        }
    })

    it('covers all getPhoneMessage branches', () => {
        expect(getPhoneMessage(parsePhone(''))).toBeNull()
        
        // Missing digits plural vs singular
        const missing2 = parsePhone('32048428')
        expect(getPhoneMessage(missing2)).toBe('Faltan 2 dígitos.')

        // Sobran digitos plural vs singular
        const sobran2 = parsePhone('320484289712')
        expect(getPhoneMessage(sobran2)).toBe('Sobran 2 dígitos.')

        // Invalid country code
        const badCountry = parsePhone('+999912345')
        expect(getPhoneMessage(badCountry)).toBe('Código de país no válido.')

        // Unrecognized format for non-string/non-number input
        const unrecognized = parsePhone({ bad: 'input' })
        expect(unrecognized.status).toBe('invalido')
        if (unrecognized.status === 'invalido') {
            expect(unrecognized.issue).toBe('formato_no_reconocido')
        }
        expect(getPhoneMessage(unrecognized)).toBe('Formato no reconocido.')

        // Object that throws when coerced to string
        const throwingObj = {
            toString() {
                throw new Error('boom')
            },
        }
        const thrownResult = parsePhone(throwingObj)
        expect(thrownResult.status).toBe('invalido')
        if (thrownResult.status === 'invalido') {
            expect(thrownResult.issue).toBe('formato_no_reconocido')
        }

        // Eastern Arabic-Indic digits (Persian/Urdu)
        const persianDigits = '۳۲٠۴۸۴۲۸۹۷'
        expect(parsePhone(persianDigits).status).toBe('valido')

        // 12 digits starting with 57 where remainder is neither mobile nor fixed
        const twelveDigitsNonMatch = parsePhone('570001234567')
        expect(twelveDigitsNonMatch.status).toBe('invalido')

        // 10,000 character string stress test
        const hugeString = '3' + '2'.repeat(9999)
        const hugeParsed = parsePhone(hugeString)
        expect(hugeParsed.status).toBe('invalido')
        expect(toE164(hugeString)).toBeNull()
        expect(toTelHref(hugeString)).toBeNull()
        expect(toWhatsAppHref(hugeString)).toBeNull()

        // XSS and HTML injection resistance
        const xssPayload = '<script>alert("xss")</script>+57 (320) 484 2897'
        expect(toTelHref(xssPayload)).toBe('tel:+573204842897')
        expect(toWhatsAppHref(xssPayload)).toBe('https://wa.me/573204842897')
        expect(toTelHref('<img src=x onerror=alert(1)>')).toBeNull()
        expect(toWhatsAppHref('<img src=x onerror=alert(1)>')).toBeNull()
    })
})
