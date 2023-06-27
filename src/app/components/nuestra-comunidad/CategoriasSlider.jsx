import * as React from 'react'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import Row from 'react-bootstrap/Row'
import Box from '@mui/material/Box'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay, virtualize, bindKeyboard } from 'react-swipeable-views-utils'

import PopularCerrajeria from '@/assets/img/Cerrajeria.png'
import PopularCarpinteria from '@/assets/img/Carpinteria.png'
import PopularPintura from '@/assets/img/Pintura.png'

const AutoPlaySwipeableViews = bindKeyboard(autoPlay(SwipeableViews))

const AcabadosMuros = '/assets/img/categories/Acabados en muros.jpg'
const AcabadosMuros2 = '/assets/img/categories/Acabados en muros2.jpg'
const AcabadosMuros3 = '/assets/img/categories/Acabados en muros3.jpg'
const AcabadosMuros4 = '/assets/img/categories/Acabados en muros4.webp'
const AdministrarPH = '/assets/img/categories/AdministrarPH.jpg'
const AdministrarPH2 = '/assets/img/categories/AdministrarPH2.jpg'
const AislamientoAcustico = '/assets/img/categories/AislamientoAcústico.jpg'
const Albañileria = '/assets/img/categories/Albañilería.jpg'
const Alfombras = '/assets/img/categories/Alfombras.webp'
const Arquitectura = '/assets/img/categories/Arquitectura.webp'
const ArtesaniasManualidades =
    '/assets/img/categories/Artesanías y manualidades.webp'
const ArtesaniasManualidades2 =
    '/assets/img/categories/Artesanías y manualidades2.jpg'
const AutomatizacionDomotica =
    '/assets/img/categories/AutomatizaciónDomotica.jpg'
const AutomatizacionDomotica2 =
    '/assets/img/categories/AutomatizaciónDomotica2.jpg'
const AutomatizacionDomotica3 =
    '/assets/img/categories/AutomatizaciónDomotica3.jpg'
const CarpinteriaAluminio = '/assets/img/categories/AutomatizaciónDomotica3.jpg'
const CarpinteriaMetalica = '/assets/img/categories/Carpintería metálica.webp'
const CarpinteriaMetalica2 = '/assets/img/categories/Carpintería metálica2.jpg'
const CarpinteriaMetalica3 = '/assets/img/categories/Carpintería metálica3.jpg'
const Carpinteria = '/assets/img/categories/Carpintería.webp'
const Carpinteria2 = '/assets/img/categories/Carpintería2.jpg'
const Cerrajeria = '/assets/img/categories/Cerrajería.jpg'
const ConstruccionObra = '/assets/img/categories/Construcción obra.jpg'
const ConstruccionObra2 = '/assets/img/categories/Construcción obra2.jpg'
const ConstruccionObra3 = '/assets/img/categories/Construcción obra3.webp'
const ControlAcceso = '/assets/img/categories/Control de acceso.jpg'
const ControlAcceso2 = '/assets/img/categories/Control de acceso2.jpg'
const ControlPlagas = '/assets/img/categories/Control de plagas.jpg'
const ControlPlagas2 = '/assets/img/categories/Control de plagas.webp'
const ControlPlagas3 = '/assets/img/categories/Control de plagas2.webp'
const Demoliciones = '/assets/img/categories/Demoliciones.jpg'
const DiseñoImpresion = '/assets/img/categories/Diseño e impresión.webp'
const DiseñoImpresion2 = '/assets/img/categories/Diseño e impresión2.webp'
const DiseñoImpresion3 = '/assets/img/categories/Diseño e impresión3.webp'
const DrenajesInundaciones =
    '/assets/img/categories/Drenajes e inundaciones.jpg'
const DrenajesInundaciones2 =
    '/assets/img/categories/Drenajes e inundaciones2.jpg'
const DrenajesInundaciones3 =
    '/assets/img/categories/Drenajes e inundaciones4.jpg'
const Electricidad = '/assets/img/categories/Electricidad.jpg'
const Electricidad2 = '/assets/img/categories/Electricidad2.webp'
const Electricidad3 = '/assets/img/categories/Electricidad3.webp'
const Electricista = '/assets/img/categories/Electricista.jpg'
const Electricista2 = '/assets/img/categories/Electricista.webp'
const Electricista3 = '/assets/img/categories/Electricista2.webp'
const EstudioSuelos = '/assets/img/categories/EstudioSuelos.jpg'
const Gasodomesticos = '/assets/img/categories/Gasodomésticos.webp'
const Gasodomesticos2 = '/assets/img/categories/Gasodomésticos2.jpg'
const MantoAsfaltico =
    '/assets/img/categories/Impermeabilización Manto Asfaltico.jpg'
const Impermeabilizacion = '/assets/img/categories/Impermeabilización.webp'
const Impermeabilizacion2 = '/assets/img/categories/Impermeabilización2.webp'
const InstalacionAdoquin = '/assets/img/categories/Instalación de adoquín.jpg'
const InstalacionAdoquin2 = '/assets/img/categories/Instalación de adoquín2.jpg'
const InstalacionAdoquin3 = '/assets/img/categories/Instalación de adoquín3.jpg'
const InstalacionCeramica = '/assets/img/categories/Instalación de cerámica.jpg'
const InstalacionCeramica2 =
    '/assets/img/categories/Instalación de cerámica2.jpg'
const InstalacionCeramica3 =
    '/assets/img/categories/Instalación de cerámica3.jpg'
const InstalacionCeramica4 =
    '/assets/img/categories/Instalación de cerámica4.jpg'
const InstalacionCeramica5 =
    '/assets/img/categories/Instalación de cerámica5.jpg'
const InstalacionCubiertas =
    '/assets/img/categories/Instalación de cubiertas.jpg'
const InstalacionCubiertas2 =
    '/assets/img/categories/Instalación de cubiertas.webp'
const InstalacionCubiertas3 =
    '/assets/img/categories/Instalación de cubiertas2.webp'
const InstalacionCubiertas4 =
    '/assets/img/categories/Instalación de cubiertas3.jpg'
const InstalacionCubiertas5 =
    '/assets/img/categories/Instalación de cubiertas4.jpg'
const InstalacionParques = '/assets/img/categories/Instalación de parques.jpg'
const InstalacionParques2 =
    '/assets/img/categories/Instalación de parques2.webp'
const InstalacionVentanas = '/assets/img/categories/Instalación de ventanas.jpg'
const InstalacionVentanas2 =
    '/assets/img/categories/Instalación de ventanas2.jpg'
const Jardineria = '/assets/img/categories/Jardinería.jpg'
const Jardineria2 = '/assets/img/categories/Jardinería2.jpg'
const Lavanderia = '/assets/img/categories/Lavandería.webp'
const LimpiezaTanques = '/assets/img/categories/Limpieza Tanques de agua.jpg'
const LimpiezasTecnicas = '/assets/img/categories/Limpiezas técnicas.webp'
const LimpiezasTecnicas2 = '/assets/img/categories/Limpiezas técnicas2.webp'
const MaestroConstructor = '/assets/img/categories/Maestro Construcción.jpg'
const MaestroObra = '/assets/img/categories/Maestro Obra.webp'
const MaestroObra2 = '/assets/img/categories/Maestro Obra2.webp'
const Mecanica = '/assets/img/categories/Mecanica.jpg'
const Mecanica2 = '/assets/img/categories/Mecanica2.jpg'
const MovilizarPesos = '/assets/img/categories/Movilizar pesos.jpg'
const MovilizarPesos2 = '/assets/img/categories/Movilizar pesos.webp'
const Mudanzas = '/assets/img/categories/Mudanzas.webp'
const Mudanzas2 = '/assets/img/categories/Mudanzas2.webp'
const Mudanzas3 = '/assets/img/categories/Mudanzas3.jpg'
const Paisajismo = '/assets/img/categories/Paisajismo.jpg'
const Pintura = '/assets/img/categories/Pintura.jpg'
const Pintura2 = '/assets/img/categories/Pintura.webp'
const Pintura3 = '/assets/img/categories/Pintura2.webp'
const Pintura4 = '/assets/img/categories/Pintura3.jpg'
const Plomeria = '/assets/img/categories/Plomería.webp'
const Plomeria2 = '/assets/img/categories/Plomería2.webp'
const Plomeria3 = '/assets/img/categories/plomero3.webp'
const ReformasBaños = '/assets/img/categories/Reformas Baños.webp'
const ReformasCocinas = '/assets/img/categories/Reformas Cocinas.jpg'
const ReformasCocinas2 = '/assets/img/categories/Reformas Cocinas.webp'
const ReformasPiscinas = '/assets/img/categories/Reformas Piscinas.jpg'
const ReformasPiscinas2 = '/assets/img/categories/Reformas Piscinas.webp'
const Refrigeracion = '/assets/img/categories/Refrigeración.webp'
const Refrigeracion2 = '/assets/img/categories/Refrigeración2.webp'
const Refrigeracion3 = '/assets/img/categories/refrigeración3.webp'
const ServicioDomestico = '/assets/img/categories/Servicio doméstico.webp'
const ServicioDomestico2 = '/assets/img/categories/Servicio doméstico2.jpg'
const SistemasSeguridadAlarmas =
    '/assets/img/categories/Sistemas de Seguridad y alarmas.jpg'
const SistemasSeguridadAlarmas2 =
    '/assets/img/categories/Sistemas de Seguridad y alarmas2.webp'
const Tapiceria = '/assets/img/categories/Tapicería.jpg'
const Tapiceria2 = '/assets/img/categories/Tapicería.webp'
const Toderos = '/assets/img/categories/Toderos.webp'
const CableadoEstructurado = '/assets/img/categories/cableado estructurado.webp'

const Categorias = [
    [AcabadosMuros, AcabadosMuros2, AcabadosMuros3],
    [AcabadosMuros4, AdministrarPH, AdministrarPH2],
    [AislamientoAcustico, Albañileria, Alfombras],
    [Arquitectura, ArtesaniasManualidades, ArtesaniasManualidades2],
    [AutomatizacionDomotica, AutomatizacionDomotica2, AutomatizacionDomotica3],
    [CarpinteriaAluminio, CarpinteriaMetalica, CarpinteriaMetalica2],
    [CarpinteriaMetalica3, Carpinteria, Carpinteria2],
    [Cerrajeria, ConstruccionObra, ConstruccionObra2],
    [ConstruccionObra3, ControlAcceso, ControlAcceso2],
    [ControlPlagas, ControlPlagas2, ControlPlagas3],
    [Demoliciones, DiseñoImpresion, DiseñoImpresion2],
    [DiseñoImpresion3, DrenajesInundaciones, DrenajesInundaciones2],
    [DrenajesInundaciones3, Electricidad, Electricidad2],
    [Electricidad3, Electricista, Electricista2],
    [Electricista3, EstudioSuelos, Gasodomesticos],
    [Gasodomesticos2, MantoAsfaltico, Impermeabilizacion],
    [Impermeabilizacion2, InstalacionAdoquin, InstalacionAdoquin2],
    [InstalacionAdoquin3, InstalacionCeramica, InstalacionCeramica2],
    [InstalacionCeramica3, InstalacionCeramica4, InstalacionCeramica5],
    [InstalacionCubiertas, InstalacionCubiertas2, InstalacionCubiertas3],
    [InstalacionCubiertas4, InstalacionCubiertas5, InstalacionParques],
    [InstalacionParques2, InstalacionVentanas, InstalacionVentanas2],
    [Jardineria, Jardineria2, Lavanderia],
    [LimpiezaTanques, LimpiezasTecnicas, LimpiezasTecnicas2],
    [MaestroConstructor, MaestroObra, MaestroObra2],
    [Mecanica, Mecanica2, MovilizarPesos],
    [MovilizarPesos2, Mudanzas, Mudanzas2],
    [Mudanzas3, Paisajismo, Pintura],
    [Pintura2, Pintura3, Pintura4],
    [Plomeria, Plomeria2, Plomeria3],
    [ReformasBaños, ReformasCocinas, ReformasCocinas2],
    [ReformasPiscinas, ReformasPiscinas2, Refrigeracion],
    [Refrigeracion2, Refrigeracion3, ServicioDomestico],
    [ServicioDomestico2, SistemasSeguridadAlarmas, SistemasSeguridadAlarmas2],
    [Tapiceria, Tapiceria2, Toderos],
    // { CableadoEstructurado },
]

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

const CategoriasSlider = (props) => {
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
                // steps={maxSteps}
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
