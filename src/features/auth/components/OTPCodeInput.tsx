/**
 * OTPCodeInput Component
 *
 * 6-digit SMS OTP verification input with auto-advance,
 * full paste support, keyboard navigation, and countdown timer.
 */

import React, { useRef, useState, useEffect, type ClipboardEvent, type KeyboardEvent, type ChangeEvent } from 'react'
import { Box, Typography, Button } from '@mui/material'
import ReplayIcon from '@mui/icons-material/Replay'

interface OTPCodeInputProps {
    length?: number
    value: string
    onChange: (code: string) => void
    onComplete?: (code: string) => void
    onResend?: () => void
    isLoading?: boolean
    resendCooldownSeconds?: number
}

export function OTPCodeInput({
    length = 6,
    value,
    onChange,
    onComplete,
    onResend,
    isLoading = false,
    resendCooldownSeconds = 60,
}: OTPCodeInputProps): React.ReactElement {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [timer, setTimer] = useState(resendCooldownSeconds)
    const [canResend, setCanResend] = useState(false)

    // Countdown timer for resend
    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true)
            return
        }

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setCanResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timer])

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus()
        }
    }, [])

    const digits = Array.from({ length }, (_, i) => value[i] || '')

    const handleDigitChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value.replace(/\D/g, '')
        if (!inputVal) {
            // Clearing the current digit
            const newCode = value.substring(0, index) + '' + value.substring(index + 1)
            onChange(newCode)
            return
        }

        // Take last entered character if multiple typed
        const char = inputVal.slice(-1)
        const newCodeArr = digits.slice()
        newCodeArr[index] = char
        const newCode = newCodeArr.join('')
        onChange(newCode)

        // Advance focus to next input
        if (index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus()
        }

        if (newCode.length === length && onComplete) {
            onComplete(newCode)
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!digits[index] && index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]?.focus()
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
        if (pasted) {
            onChange(pasted)
            // Focus last filled digit or first empty
            const targetIdx = Math.min(pasted.length, length - 1)
            inputRefs.current[targetIdx]?.focus()

            if (pasted.length === length && onComplete) {
                onComplete(pasted)
            }
        }
    }

    const handleTriggerResend = () => {
        if (!canResend || isLoading) return
        setTimer(resendCooldownSeconds)
        setCanResend(false)
        if (onResend) {
            onResend()
        }
    }

    return (
        <Box sx={{ width: '100%', my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: { xs: 1, sm: 1.5 },
                    justifyContent: 'center',
                    alignItems: 'center',
                    my: 1.5,
                }}
            >
                {Array.from({ length }).map((_, index) => (
                    <Box
                        key={index}
                        component="input"
                        ref={(el: HTMLInputElement | null) => {
                            inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digits[index] || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleDigitChange(index, e)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={isLoading}
                        sx={{
                            width: { xs: 42, sm: 48 },
                            height: { xs: 50, sm: 56 },
                            textAlign: 'center',
                            fontSize: { xs: '1.4rem', sm: '1.6rem' },
                            fontWeight: 700,
                            borderRadius: '12px',
                            border: digits[index]
                                ? '2px solid var(--primary-color, #048365)'
                                : '1.5px solid #d1d5db',
                            bgcolor: digits[index] ? 'rgba(4, 131, 101, 0.04)' : '#ffffff',
                            color: '#111827',
                            outline: 'none',
                            transition: 'all 0.15s ease-in-out',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                            '&:focus': {
                                borderColor: 'var(--primary-color, #048365)',
                                boxShadow: '0 0 0 3px rgba(4, 131, 101, 0.2)',
                                transform: 'translateY(-1px)',
                            },
                        }}
                    />
                ))}
            </Box>

            {onResend && (
                <Box sx={{ mt: 1.5, textAlign: 'center' }}>
                    {canResend ? (
                        <Button
                            variant="text"
                            onClick={handleTriggerResend}
                            disabled={isLoading}
                            startIcon={<ReplayIcon fontSize="small" />}
                            sx={{
                                color: 'var(--primary-color, #048365)',
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '0.88rem',
                                '&:hover': {
                                    bgcolor: 'rgba(4, 131, 101, 0.08)',
                                },
                            }}
                        >
                            Reenviar código SMS
                        </Button>
                    ) : (
                        <Typography sx={{ fontSize: '0.82rem', color: '#6b7280' }}>
                            ¿No recibiste el código? Podrás reenviarlo en{' '}
                            <Typography component="span" sx={{ fontWeight: 700, color: '#374151' }}>
                                {timer}s
                            </Typography>
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    )
}
