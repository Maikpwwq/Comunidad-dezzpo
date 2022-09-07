import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import ButtonMaterial from '@mui/material/Button'
import PropTypes from 'prop-types'
import './directional_button.css'

const DirectionalButton = ({ data }) => {
    return (
        <>
            <Container
                maxWidth="sm"
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
                <Box className="container-btns">
                    <ButtonMaterial className="arrow-back">
                        {'<'}
                    </ButtonMaterial>
                    <ButtonMaterial className="arrow-next">
                        {'>'}
                    </ButtonMaterial>
                </Box>
            </Container>
        </>
    )
}

DirectionalButton.propTypes = {
    data: PropTypes.object,
}

export default DirectionalButton
