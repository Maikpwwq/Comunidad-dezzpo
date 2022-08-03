import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Box from '@mui/material/Box'

const sliderAction = () => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/nuevo-proyecto')
        // setDraftInfo(projectData)
    }

    return (
        <Box className="asisteme p-2" sx={{ width: '100%' }}>
            <p className="headline-s textBlanco m-0 pe-4">
                Te ayudamos a elegir el profesional calificado para tus
                proyectos.
            </p>
            <Button
                className="headline-s btn-round btn-high btn-avanzar"
                variant="primary"
                onClick={handleClick}
            >
                Asísteme
            </Button>
        </Box>
    )
}

export default sliderAction
