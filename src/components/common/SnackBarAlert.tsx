/**
 * SnackBarAlert Component
 *
 * Generic toast notification using MUI Snackbar.
 * Migrated from src/index/components/SnackBarAlert.jsx
 */

import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export interface SnackBarAlertProps {
    message: string
    onClose: () => void
    severity: 'success' | 'error' | 'warning' | 'info'
    open: boolean
    autoHideDuration?: number
}

export function SnackBarAlert({
    message,
    onClose,
    severity,
    open,
    autoHideDuration = 6000,
}: SnackBarAlertProps): React.ReactElement {
    return (
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBarAlert
