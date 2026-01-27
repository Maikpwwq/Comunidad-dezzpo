import React from 'react'
import Button, { type ButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

export interface ActionButtonProps extends ButtonProps {
    loading?: boolean
    gradient?: boolean
}

const GradientButton = styled(Button)(() => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)',
    },
}))

export const ActionButton: React.FC<ActionButtonProps> = ({
    children,
    loading = false,
    gradient = false,
    disabled,
    startIcon,
    endIcon,
    ...props
}) => {
    const Component = gradient ? GradientButton : Button

    return (
        <Component
            disabled={disabled || loading}
            startIcon={!loading ? startIcon : null}
            endIcon={!loading ? endIcon : null}
            {...props}
        >
            {loading ? <CircularProgress size={24} color="inherit" /> : children}
        </Component>
    )
}
