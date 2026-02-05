import React from 'react'
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Box,
    type FormControlProps
} from '@mui/material'

export interface FormFieldProps extends FormControlProps {
    label?: string
    error?: boolean
    helperText?: string
    children: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    helperText,
    children,
    fullWidth = true,
    sx,
    ...props
}) => {
    return (
        <FormControl fullWidth={fullWidth} error={!!error} sx={{ mb: 2, ...sx }} {...props}>
            {label && (
                <Box mb={1}>
                    <FormLabel error={!!error}>{label}</FormLabel>
                </Box>
            )}
            {children}
            {helperText && <FormHelperText error={!!error}>{helperText}</FormHelperText>}
        </FormControl>
    )
}
