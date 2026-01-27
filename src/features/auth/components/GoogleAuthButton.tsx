/**
 * GoogleAuthButton Component
 *
 * Google OAuth sign-in/sign-up button.
 * Extracted from ingreso/registro pages.
 */

import React from 'react'

// MUI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Bootstrap
import Button from 'react-bootstrap/Button'

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
        <ul className={`align-items-center mt-2 w-100 ${className}`}>
            <li className="body-1">
                <Button
                    className="btn btn-round btn-middle d-flex align-items-center p-0 pe-2"
                    onClick={onClick}
                    style={{ background: '#e9ebe6' }}
                >
                    <Box
                        component="img"
                        src={LogoGmail}
                        alt={label}
                        sx={{
                            height: 33,
                            display: 'block',
                            maxWidth: 33,
                            overflow: 'hidden',
                            width: '100%',
                            borderRadius: '50%',
                        }}
                        className="p-2"
                    />
                    <Typography className="body-1">{label}</Typography>
                </Button>
            </li>
        </ul>
    )
}

export default GoogleAuthButton
