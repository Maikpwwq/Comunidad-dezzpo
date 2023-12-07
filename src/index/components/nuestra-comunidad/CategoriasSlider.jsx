import * as React from 'react'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import Row from 'react-bootstrap/Row'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay, bindKeyboard } from 'react-swipeable-views-utils' // , virtualize

// import PopularCerrajeria from '#@/assets/img/Cerrajeria.png'
// import PopularCarpinteria from '#@/assets/img/Carpinteria.png'
// import PopularPintura from '#@/assets/img/Pintura.png'

const AutoPlaySwipeableViews = bindKeyboard(autoPlay(SwipeableViews))

import Categorias from './CategoriesImages'

const styles = (theme) => ({
    stepper: {
        position: 'relative',
        bottom: '-25px',
        zIndex: 1000,
        background: 'transparent',
        height: '0px',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
})

const CategoriasSlider = () => {
    const theme = useTheme()
    const classes = styles(theme)
    const maxSteps = Categorias.length
    const [activeStep, setActiveStep] = React.useState(0)
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStepChange = (step) => {
        setActiveStep(step)
    }
    return (
        <Box
            sx={{
                width: '80%',
                sm: { width: '100%' },
                flexGrow: 1,
            }}
        >
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
                // slideRenderer={slideRenderer}
                className="mb-2"
            >
                {Categorias.map((categoria, index) => {
                    return (
                        <Row key={index}>
                            <img
                                src={categoria[0]}
                                alt="Categorias Populares entre la Comunidad"
                                height="170"
                                style={{ width: '33%', padding: 0 }}
                            />
                            <img
                                src={categoria[1]}
                                alt="Categorias Populares entre la Comunidad"
                                height="170"
                                style={{ width: '33%', padding: 0 }}
                                // width="300"
                            />
                            <img
                                src={categoria[2]}
                                alt="Categorias Populares entre la Comunidad"
                                height="170"
                                style={{ width: '33%', padding: 0 }}
                            />
                        </Row>
                    )
                })}
            </AutoPlaySwipeableViews>
            <MobileStepper
                // variant=
                sx={classes.stepper}
                className="pb-4 mb-4"
                steps={maxSteps}
                // position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="lg"
                        onClick={handleNext}
                        className="arrow-next"
                        disabled={activeStep === maxSteps - 1}
                        // style={{ left: '68px' }}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft fontSize="large" />
                        ) : (
                            <KeyboardArrowRight fontSize="large" />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="lg"
                        onClick={handleBack}
                        className="arrow-back"
                        disabled={activeStep === 0}
                        // style={{ right: '68px' }}
                    >
                        {theme.direction === 'rtl' ? (
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