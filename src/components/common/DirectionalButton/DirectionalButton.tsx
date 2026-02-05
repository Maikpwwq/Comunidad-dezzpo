/**
 * DirectionalButton Component
 *
 * Navigation buttons for carousel/slider navigation.
 * Migrated from src/index/components/DirectionalButton/DirectionalButton.jsx
 */

import React from 'react'
import { Container, Box, Button } from '@mui/material'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import clsx from 'clsx'
import styles from './DirectionalButton.module.scss'

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
            <Box className={clsx(styles.Container)}>
                {showBack && (
                    <Button className={clsx(styles.ArrowBack)} onClick={handleBack}>
                        <KeyboardArrowLeft fontSize="large" />
                    </Button>
                )}
                {showNext && (
                    <Button className={clsx(styles.ArrowNext)} onClick={handleNext}>
                        <KeyboardArrowRight fontSize="large" />
                    </Button>
                )}
            </Box>
        </Container>
    )
}

export default DirectionalButton
