import * as React from 'react'
import '../../../../public/assets/css/nuestra_comunidad.css'
import CategoriasServicios from '../../components/categorias-servicios/CategoriasServicios'

//imagenes
//import CategoriasPopulares from '../../../../public/assets/img/CategoriasPopulares.png'
import PopularCerrajeria from '../../../../public/assets/img/Cerrajeria.png'
import PopularCarpinteria from '../../../../public/assets/img/Carpinteria.png'
import PopularPintura from '../../../../public/assets/img/Pintura.png'
import LocalCiudades from '../../../../public/assets/img/LocalCiudades.png'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay, virtualize, bindKeyboard } from 'react-swipeable-views-utils'

const AutoPlaySwipeableViews = bindKeyboard(autoPlay(SwipeableViews))

const styles = (theme) => ({
    stepper: {
        position: 'relative',
        top: '80px',
        zIndex: 1000,
        background: 'transparent',
        height: '0px',
        padding: 0,
    },
})

const NuestraComunidad = (props) => {
    const theme = useTheme()
    const classes = styles(theme)
    const maxSteps = 2
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
        <>
            <Container fluid className="p-0">
                <Col id="popularCategorias" className="m-4 p-4">
                    <Col className="w-80">
                        <h2 className="headline-xl"> NUESTRA COMUNIDAD </h2>
                        <p className="body-1">
                            Tenemos una gran cantidad de profesionales que
                            quieren trabajar en su proyecto.
                        </p>
                        <Box
                            sx={{
                                width: '80%',
                                sm: { width: '100%' },
                                flexGrow: 1,
                            }}
                        >
                            <MobileStepper
                                // variant=
                                sx={classes.stepper}
                                // steps={maxSteps}
                                // position="static"
                                activeStep={activeStep}
                                nextButton={
                                    <Button
                                        size="lg"
                                        onClick={handleNext}
                                        disabled={activeStep === maxSteps - 1}
                                        style={{ left: '68px' }}
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
                                        disabled={activeStep === 0}
                                        style={{ right: '68px' }}
                                    >
                                        {theme.direction === 'rtl' ? (
                                            <KeyboardArrowRight fontSize="large" />
                                        ) : (
                                            <KeyboardArrowLeft fontSize="large" />
                                        )}
                                    </Button>
                                }
                            />
                            <AutoPlaySwipeableViews
                                axis={
                                    theme.direction === 'rtl'
                                        ? 'x-reverse'
                                        : 'x'
                                }
                                index={activeStep}
                                onChangeIndex={handleStepChange}
                                enableMouseEvents
                                // slideRenderer={slideRenderer}
                            >
                                <Row>
                                    <img
                                        src={PopularCerrajeria}
                                        alt="Categorias Populares entre la Comunidad"
                                        height="170"
                                        style={{ width: '33%', padding: 0 }}
                                        maxwidth="300"
                                    />
                                    <img
                                        src={PopularCarpinteria}
                                        alt="Categorias Populares entre la Comunidad"
                                        height="170"
                                        style={{ width: '34%' }}
                                        maxwidth="300"
                                    />
                                    <img
                                        src={PopularPintura}
                                        alt="Categorias Populares entre la Comunidad"
                                        height="170"
                                        style={{ width: '33%', padding: 0 }}
                                        maxwidth="300"
                                    />
                                </Row>

                                <Row>
                                    <img
                                        src={PopularCarpinteria}
                                        alt="Categorias Populares entre la Comunidad"
                                        height="170"
                                        style={{ width: '33%', padding: 0 }}
                                        maxwidth="300"
                                    />
                                    <img
                                        src={PopularPintura}
                                        alt="Categorias Populares entre la Comunidad"
                                        height="170"
                                        style={{ width: '34%' }}
                                        maxwidth="300"
                                    />
                                    <img
                                        src={PopularCerrajeria}
                                        alt="Categorias Populares entre la Comunidad"
                                        height="170"
                                        style={{ width: '33%', padding: 0 }}
                                        maxwidth="300"
                                    />
                                </Row>
                            </AutoPlaySwipeableViews>
                        </Box>
                    </Col>
                    <Col className="categoriasPopulares mt-4 p-4">
                        <h3 className=".headline-l">
                            {' '}
                            o encuentralos dentro de las categorías populares:
                        </h3>
                        <ul className="body-2 textBlanco pt-4">
                            <li>
                                Pintor y decorador, Pintura y decoracion de
                                interiores{' '}
                            </li>
                            <li>
                                Electricista, Instalación y validación de
                                acometidas electricas{' '}
                            </li>
                            <li>
                                Instaladores de techos y cubiertas,
                                mantenimiento de cubiertas{' '}
                            </li>
                            <li>Maestro, Construcciones y ampliaciones </li>
                            <li>Plomero, reparacion de fugas </li>
                            <li>Carpinteria, instalacion de closets, más </li>
                        </ul>
                    </Col>
                </Col>
            </Container>
            {/* seccion de categorias y servicios */}
            <CategoriasServicios />
            <Container fluid className="p-0">
                {/* seccion de comerciantes Locales*/}
                <Row id="comerciantesLocales" className="p-4 m-0">
                    <Col className="col-12">
                        <h2 className="headline-xl textBlanco">
                            Busca en tu ciudad comerciantes calificados
                        </h2>
                        <Row className="ciudades p-0 col-12">
                            <Col className="" md={3} sm={12}>
                                <ul className="body-2 align-items-center">
                                    <li>Bogota</li>
                                    <li>Medellin</li>
                                    <li>Cali</li>
                                </ul>
                            </Col>
                            <Col className="" md={3} sm={12}>
                                <ul className="body-2 align-items-center">
                                    <li>Villavicencio</li>
                                    <li>Chia</li>
                                    <li>Cota</li>
                                </ul>
                            </Col>
                            <Col className="" md={3} sm={12}>
                                <ul className="body-2 align-items-center">
                                    <li>Funza</li>
                                    <li>Mosquera</li>
                                    <li>Zipaquira</li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="" lg={6} md={6} sm={12}>
                        <img
                            src={LocalCiudades}
                            alt="Busca Comerciantes Locales"
                            height="auto"
                            width="100%"
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default NuestraComunidad
