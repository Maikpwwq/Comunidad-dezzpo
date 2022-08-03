import * as React from 'react'
import '../../../../public/assets/css/nuestra_comunidad.css'
import CategoriasServicios from '../../components/categorias-servicios/CategoriasServicios'
import CategoriasSlider from './CategoriasSlider'
//imagenes
//import CategoriasPopulares from '../../../../public/assets/img/CategoriasPopulares.png'
import LocalCiudades from '../../../../public/assets/img/LocalCiudades.png'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const NuestraComunidad = (props) => {


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
                        <CategoriasSlider />
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
