import React from 'react'
import FormControl, { type FormControlProps } from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Box from '@mui/material/Box'

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
