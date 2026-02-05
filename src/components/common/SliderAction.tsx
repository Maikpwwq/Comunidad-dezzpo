/**
 * SliderAction Component
 *
 * Call-to-action banner for the slider.
 * Migrated from src/index/components/SliderAction.jsx
 */

import React, { useCallback } from 'react'
import { navigate } from 'vike/client/router'
import { Button } from 'react-bootstrap'
import { Box } from '@mui/material'

export interface SliderActionProps {
    /** Custom title text */
    title?: string
    /** Custom button text */
    buttonText?: string
    /** Custom navigation route */
    navigateTo?: string
    /** Custom click handler (overrides default navigation) */
    onClick?: () => void
}

export function SliderAction({
    title = 'Te ayudamos a elegir el profesional calificado ideal para tus proyectos.',
    buttonText = 'Asísteme',
    navigateTo = '/nuevo-proyecto',
    onClick,
}: SliderActionProps): React.ReactElement {
    const handleClick = useCallback(() => {
        if (onClick) {
            onClick()
        } else {
            navigate(navigateTo)
        }
    }, [onClick, navigateTo])

    return (
        <Box
            className="asisteme ps-4 pt-2 pb-2 pe-4"
            sx={{ width: { sm: 'auto', md: '99.5%', lg: '99.5%' } }}
        >
            <p className="headline-s text-blanco m-0 pe-4">{title}</p>
            <Button
                className="headline-s btn-round btn-high"
                variant="primary"
                onClick={handleClick}
            >
                {buttonText}
            </Button>
        </Box>
    )
}

export default SliderAction
