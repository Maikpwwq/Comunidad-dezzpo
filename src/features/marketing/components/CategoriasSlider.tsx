/**
 * CategoriasSlider Component
 *
 * Auto-play image carousel for category images.
 * Migrated from src/index/components/nuestra-comunidad/CategoriasSlider.jsx
 */

import React, { useState, useCallback } from 'react'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay, bindKeyboard } from 'react-swipeable-views-utils'
import Row from 'react-bootstrap/Row'
import clsx from 'clsx'

import styles from './CategoriasSlider.module.scss'

// Category images config
import { categoriesImages } from '../config/categoriesImages'

const AutoPlaySwipeableViews = bindKeyboard(autoPlay(SwipeableViews))

const stepperStyles = {
    position: 'relative' as const,
    bottom: '-25px',
    zIndex: 1000,
    background: 'transparent',
    height: '0px',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row' as const,
}

export function CategoriasSlider(): React.ReactElement {
    const theme = useTheme()
    const maxSteps = categoriesImages.length
    const [activeStep, setActiveStep] = useState(0)

    const handleNext = useCallback(() => {
        setActiveStep((prev) => prev + 1)
    }, [])

    const handleBack = useCallback(() => {
        setActiveStep((prev) => prev - 1)
    }, [])

    const handleStepChange = useCallback((step: number) => {
        setActiveStep(step)
    }, [])

    const isRtl = theme.direction === 'rtl'

    return (
        <Box sx={{ width: '80%', sm: { width: '100%' }, flexGrow: 1 }}>
            <AutoPlaySwipeableViews
                axis={isRtl ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
                className="mb-2"
            >
                {categoriesImages.map((categoria, index) => (
                    <Row key={index}>
                        {categoria.map((imgSrc, imgIdx) => (
                            <img
                                key={imgIdx}
                                src={imgSrc}
                                alt="Categorias Populares entre la Comunidad"
                                height="170"
                                style={{ width: '33%', padding: 0 }}
                            />
                        ))}
                    </Row>
                ))}
            </AutoPlaySwipeableViews>

            <MobileStepper
                sx={stepperStyles}
                className="pb-4 mb-4"
                steps={maxSteps}
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="large"
                        onClick={handleNext}
                        className={clsx(styles.ArrowNext)}
                        disabled={activeStep === maxSteps - 1}
                    >
                        {isRtl ? (
                            <KeyboardArrowLeft fontSize="large" />
                        ) : (
                            <KeyboardArrowRight fontSize="large" />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="large"
                        onClick={handleBack}
                        className={clsx(styles.ArrowBack)}
                        disabled={activeStep === 0}
                    >
                        {isRtl ? (
                            <KeyboardArrowRight fontSize="large" />
                        ) : (
                            <KeyboardArrowLeft fontSize="large" />
                        )}
                    </Button>
                }
            />
        </Box>
    )
}

export default CategoriasSlider
