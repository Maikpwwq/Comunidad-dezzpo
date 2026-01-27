/**
 * DirectionalButton Component
 *
 * Navigation buttons for carousel/slider navigation.
 * Migrated from src/index/components/DirectionalButton/DirectionalButton.jsx
 */

import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import './DirectionalButton.css'

export interface DirectionalButtonProps {
    /** Handler for next button click */
    handleNext?: () => void
    /** Handler for back button click */
    handleBack?: () => void
    /** Show next button */
    showNext?: boolean
    /** Show back button */
    showBack?: boolean
}

export function DirectionalButton({
    handleNext,
    handleBack,
    showNext = true,
    showBack = true,
}: DirectionalButtonProps): React.ReactElement {
    return (
        <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box className="container-btns">
                {showBack && (
                    <Button className="arrow-back" onClick={handleBack}>
                        <KeyboardArrowLeft fontSize="large" />
                    </Button>
                )}
                {showNext && (
                    <Button className="arrow-next" onClick={handleNext}>
                        <KeyboardArrowRight fontSize="large" />
                    </Button>
                )}
            </Box>
        </Container>
    )
}

export default DirectionalButton
