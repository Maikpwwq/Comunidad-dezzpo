/**
 * GoogleAuthButton & OrDivider Components
 *
 * Google OAuth sign-in/sign-up button with proper contrast.
 * OrDivider separates Google auth from email/password form.
 */

import React from 'react'

// MUI
import { Box, Typography } from '@mui/material'

// Assets
import LogoGmail from '@assets/img/G.jpg'

interface GoogleAuthButtonProps {
    onClick: () => void
    label?: string
    className?: string
}

export function GoogleAuthButton({
    onClick,
    label = 'Ingresar con Gmail',
    className = '',
}: GoogleAuthButtonProps): React.ReactElement {
    return (
        <Box
            className={className}
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
            }}
        >
            <Box
                component="button"
                type="button"
                onClick={onClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 3,
                    py: 1.2,
                    border: '1px solid var(--auth-google-btn-border)',
                    borderRadius: '30px',
                    bgcolor: 'var(--background-white-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        bgcolor: 'var(--auth-google-btn-hover-bg)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: 'none',
                    },
                }}
            >
                <Box
                    component="img"
                    src={LogoGmail}
                    alt="Google"
                    sx={{
                        height: 24,
                        width: 24,
                        borderRadius: '50%',
                        flexShrink: 0,
                    }}
                />
                <Typography
                    sx={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'var(--auth-google-btn-text)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {label}
                </Typography>
            </Box>
        </Box>
    )
}

/**
 * OrDivider — horizontal "── o ──" separator
 */
export function OrDivider(): React.ReactElement {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '80%',
                mx: 'auto',
                my: 2.5,
                gap: 2,
            }}
        >
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'var(--auth-divider-color)' }} />
            <Typography
                sx={{
                    fontSize: '0.85rem',
                    color: 'var(--auth-divider-text)',
                    fontWeight: 500,
                    textTransform: 'lowercase',
                }}
            >
                o
            </Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'var(--auth-divider-color)' }} />
        </Box>
    )
}

export default GoogleAuthButton

