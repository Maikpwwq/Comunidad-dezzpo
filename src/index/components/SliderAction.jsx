export { SliderAction }

import React from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import Button from 'react-bootstrap/Button'
import Box from '@mui/material/Box'

const SliderAction = () => {
    const handleClick = () => {
        navigate('/nuevo-proyecto')
        // setDraftInfo(projectData)
    }

    return (
        <Box
            className="asisteme ps-4 pt-2 pb-2 pe-4"
            sx={{ width: { sm: 'auto', md: '99.5%', lg: '99.5%' } }}
        >
            <p className="headline-s textBlanco m-0 pe-4">
                Te ayudamos a elegir el profesional calificado ideal para tus
                proyectos.
            </p>
            <Button
                className="headline-s btn-round btn-high"
                variant="primary"
                onClick={handleClick}
            >
                Asísteme
            </Button>
        </Box>
    )
}
