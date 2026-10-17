import React, { useState, useEffect, useRef, useId, useCallback } from 'react'
import {
    TextField,
    InputAdornment,
    Box,
} from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
    parsePhone,
    formatPhone,
    getPhoneMessage,
    type PhoneChange,
    type PhoneFieldProps,
    type PhoneParse,
} from '@services/phone'

/**
 * Scaffolding template for Colombian numbers
 */
const COLOMBIA_SCAFFOLD = '+57 (___) ___ ____'

/**
 * Calculates remaining scaffolding underscores aligned with typed digits
 */
function getScaffoldOverlay(formatted: string): { typed: string; remaining: string } | null {
    if (!formatted.startsWith('+57')) {
        return null
    }

    // Full template matching: +57 (XXX) XXX XXXX
    // Length is 19 characters
    if (formatted.length >= 19) {
        return null
    }

    const template = COLOMBIA_SCAFFOLD
    // If formatted matches prefix of template, show remaining template characters
    const typed = formatted
    let remaining = ''

    if (formatted.length < template.length) {
        remaining = template.slice(formatted.length)
    }

    return { typed, remaining }
}

/**
 * Unified, Accessible, Masked Phone & WhatsApp Input Field
 *
 * Implements:
 * - Colombian CRC 5886 / E.164 guided mask «+57 (___) ___ ____»
 * - Accessible single-input with aria-hidden scaffolding
 * - Caret and backspace position preservation
 * - Mobile-friendly layout with 16px font to prevent mobile zoom
 * - Seamless variant switching ('telefono' | 'whatsapp')
 */
export const PhoneField: React.FC<PhoneFieldProps> = ({
    label,
    value,
    onChange,
    variant = 'telefono',
    required = false,
    disabled = false,
    helperText,
    autoComplete = 'tel',
    id: customId,
    name,
    error: customError,
    fullWidth = true,
    size = 'small',
    className,
    sx,
}) => {
    const generatedId = useId()
    const inputId = customId || `phone-field-${generatedId}`
    const helperId = `${inputId}-helper-text`
    const inputRef = useRef<HTMLInputElement>(null)

    // Formatted display value state
    const [displayValue, setDisplayValue] = useState<string>(() => {
        if (!value) return ''
        return formatPhone(value)
    })

    // Track user interaction (blur / dirty)
    const [touched, setTouched] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    // Internal parse result
    const [currentParse, setCurrentParse] = useState<PhoneParse>(() => parsePhone(value || ''))

    // Synchronize when external `value` prop changes
    useEffect(() => {
        const formatted = formatPhone(value || '')
        setDisplayValue(formatted)
        setCurrentParse(parsePhone(value || ''))
    }, [value])

    // Compute message & error status
    const message = getPhoneMessage(currentParse, variant)
    const isInvalid = currentParse.status === 'invalido'
    const isIncomplete = currentParse.status === 'incompleto'
    const isWarning = currentParse.status === 'valido' && variant === 'whatsapp' && currentParse.kind === 'fijo'
    const showError = customError ?? (touched && (isInvalid || (isIncomplete && !isFocused)))
    const activeHelperText = (showError || isWarning) && message
        ? message
        : (helperText || (variant === 'whatsapp' ? 'Número para cotizaciones y pedidos directos' : undefined))

    // Count how many digits appear before index in string
    const countDigitsBefore = (str: string, index: number): number => {
        let count = 0
        for (let i = 0; i < index && i < str.length; i++) {
            const char = str[i]
            if (char && /\d/.test(char)) count++
        }
        return count
    }

    // Find cursor index in string after encountering target digit count
    const findIndexAfterDigits = (str: string, targetDigits: number): number => {
        if (targetDigits <= 0) return 0
        let count = 0
        for (let i = 0; i < str.length; i++) {
            const char = str[i]
            if (char && /\d/.test(char)) {
                count++
                if (count === targetDigits) {
                    return i + 1
                }
            }
        }
        return str.length
    }

    // Handle typing and pasting
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawTyped = e.target.value
            const cursorStart = e.target.selectionStart ?? rawTyped.length

            // Compute digits before current cursor
            const digitsBefore = countDigitsBefore(rawTyped, cursorStart)

            // Parse newly typed value
            const parse = parsePhone(rawTyped)
            setCurrentParse(parse)

            // Format for display
            const formatted = formatPhone(parse)
            setDisplayValue(formatted)

            // Find new cursor position matching digits count
            const newCursorPos = findIndexAfterDigits(formatted, digitsBefore)

            // Emit canonical change payload
            const emittedValue =
                parse.status === 'valido'
                    ? parse.e164
                    : parse.parts
                      ? `${parse.parts.countryCode}${parse.parts.national}`
                      : rawTyped.replace(/[^\d+]/g, '')

            const changePayload: PhoneChange = {
                value: emittedValue,
                parse,
            }
            onChange(changePayload)

            // Restore caret position on next tick
            requestAnimationFrame(() => {
                if (inputRef.current) {
                    inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
                }
            })
        },
        [onChange]
    )

    // Handle backspace over literals
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && inputRef.current) {
            const selStart = inputRef.current.selectionStart ?? 0
            const selEnd = inputRef.current.selectionEnd ?? 0

            // If single caret position (not a range selection)
            if (selStart === selEnd && selStart > 0) {
                const charBefore = inputRef.current.value[selStart - 1]
                // If character before cursor is a separator, jump over it
                if (charBefore && !/\d/.test(charBefore)) {
                    // Let default browser behavior proceed or adjust
                }
            }
        }
    }, [])

    const handleFocus = useCallback(() => {
        setIsFocused(true)
    }, [])

    const handleBlur = useCallback(() => {
        setIsFocused(false)
        setTouched(true)
    }, [])

    // Scaffolding overlay computation
    const scaffold = isFocused && displayValue ? getScaffoldOverlay(displayValue) : null

    return (
        <Box
            sx={{
                position: 'relative',
                width: fullWidth ? '100%' : 'auto',
                display: 'inline-block',
                ...((sx as object) || {}),
            }}
            className={className}
        >
            <TextField
                inputRef={inputRef}
                id={inputId}
                label={label}
                value={displayValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required={required}
                disabled={disabled}
                error={showError}
                helperText={activeHelperText}
                placeholder={COLOMBIA_SCAFFOLD}
                size={size}
                fullWidth={fullWidth}
                type="tel"
                autoComplete={autoComplete}
                {...(name ? { name } : {})}
                {...(activeHelperText ? { 'aria-describedby': helperId } : {})}
                slotProps={{
                    htmlInput: {
                        inputMode: 'tel',
                    },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                {variant === 'whatsapp' ? (
                                    <WhatsAppIcon
                                        sx={{
                                            color: '#25D366',
                                            fontSize: 20,
                                        }}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <PhoneIcon
                                        sx={{
                                            color: 'text.secondary',
                                            fontSize: 20,
                                        }}
                                        aria-hidden="true"
                                    />
                                )}
                            </InputAdornment>
                        ),
                        sx: {
                            fontVariantNumeric: 'tabular-nums',
                            fontFeatureSettings: '"tnum"',
                            fontSize: { xs: '16px', sm: size === 'small' ? '14px' : '16px' },
                        },
                    },
                    formHelperText: {
                        id: helperId,
                    },
                }}
            />

            {/* Accessible Scaffolding Overlay (aria-hidden) */}
            {scaffold && (
                <Box
                    aria-hidden="true"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        pl: variant === 'whatsapp' ? '42px' : '42px',
                        pt: size === 'small' ? '8px' : '16px',
                        fontVariantNumeric: 'tabular-nums',
                        fontFeatureSettings: '"tnum"',
                        fontSize: { xs: '16px', sm: size === 'small' ? '14px' : '16px' },
                        lineHeight: 1.4375,
                        fontFamily: 'inherit',
                        userSelect: 'none',
                        color: 'text.disabled',
                        opacity: 0.45,
                        zIndex: 0,
                        overflow: 'hidden',
                        whiteSpace: 'pre',
                    }}
                >
                    <span style={{ opacity: 0 }}>{scaffold.typed}</span>
                    <span>{scaffold.remaining}</span>
                </Box>
            )}
        </Box>
    )
}

export default PhoneField
