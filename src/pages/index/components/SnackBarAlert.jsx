import * as React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@mui/material/Snackbar'
// import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Alert from '@mui/material/Alert'

// const Alert = (props) => {
//     const { ...other } = props
//     console.log(props, ref)
//     // React.forwardRef (<HTMLDivElement, AlertProps>)
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
// }

export { SnackBarAlert }

const SnackBarAlert = ({ message, onClose, severity }) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert
                onClose={onClose}
                severity={severity} // success, error, warning, info, default
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}

SnackBarAlert.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    severity: PropTypes.string.isRequired,
}
