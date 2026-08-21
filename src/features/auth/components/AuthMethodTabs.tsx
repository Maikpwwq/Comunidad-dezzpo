/**
 * AuthMethodTabs Component
 *
 * Tab switch between Phone (SMS OTP) and Email auth methods.
 */

import React from 'react'
import { Box, Typography } from '@mui/material'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import type { AuthMethod } from '../types'

interface AuthMethodTabsProps {
    method: AuthMethod
    onChange: (method: AuthMethod) => void
    className?: string
}

export function AuthMethodTabs({
    method,
    onChange,
    className = '',
}: AuthMethodTabsProps): React.ReactElement {
    return (
        <Box
            className={className}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: '50px',
                p: '4px',
                width: '100%',
                maxWidth: 380,
                mx: 'auto',
                mt: 1.5,
                mb: 2,
            }}
        >
            <Box
                component="button"
                type="button"
                onClick={() => onChange('phone')}
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    py: 1,
                    px: 2,
                    borderRadius: '50px',
                    border: 'none',
                    bgcolor: method === 'phone' ? 'var(--background-white-color, #ffffff)' : 'transparent',
                    boxShadow: method === 'phone' ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none',
                    color: method === 'phone' ? 'var(--primary-color, #048365)' : '#6c757d',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        color: 'var(--primary-color, #048365)',
                    },
                }}
            >
                <PhoneIphoneIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: method === 'phone' ? 600 : 500 }}>
                    Teléfono celular
                </Typography>
            </Box>

            <Box
                component="button"
                type="button"
                onClick={() => onChange('email')}
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    py: 1,
                    px: 2,
                    borderRadius: '50px',
                    border: 'none',
                    bgcolor: method === 'email' ? 'var(--background-white-color, #ffffff)' : 'transparent',
                    boxShadow: method === 'email' ? '0 2px 8px rgba(0, 0, 0, 0.12)' : 'none',
                    color: method === 'email' ? 'var(--primary-color, #048365)' : '#6c757d',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        color: 'var(--primary-color, #048365)',
                    },
                }}
            >
                <EmailOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: '0.88rem', fontWeight: method === 'email' ? 600 : 500 }}>
                    Correo electrónico
                </Typography>
            </Box>
        </Box>
    )
}
