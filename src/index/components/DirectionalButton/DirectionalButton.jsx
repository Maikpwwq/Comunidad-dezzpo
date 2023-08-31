export { DirectionalButton }

import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ButtonMaterial from '@mui/material/Button'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import PropTypes from 'prop-types'
import './directional_button.css'

const DirectionalButton = ({ handleNext, handleBack }) => {
    return (
        <>
            <Container
                maxWidth="sm"
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Box className="container-btns">
                    <ButtonMaterial className="arrow-back" onClick={handleBack}>
                        <KeyboardArrowLeft fontSize="large" />
                    </ButtonMaterial>
                    <ButtonMaterial className="arrow-next">
                        <KeyboardArrowRight
                            fontSize="large"
                            onClick={handleNext}
                        />
                    </ButtonMaterial>
                </Box>
            </Container>
        </>
    )
}

DirectionalButton.propTypes = {
    handleBack: PropTypes.func,
    handleNext: PropTypes.func,
}
