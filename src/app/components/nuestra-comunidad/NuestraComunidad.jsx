import * as React from 'react'
import '../../../../public/assets/css/nuestra_comunidad.css'
import CategoriasServicios from '../../components/categorias-servicios/CategoriasServicios'

//imagenes
import CategoriasPopulares from '../../../../public/assets/img/CategoriasPopulares.png'
import LocalCiudades from '../../../../public/assets/img/LocalCiudades.png'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const NuestraComunidad = (props) => {
    return (
        <>
            <Container fluid className="p-0">
                <Col id="popularCategorias" className="m-0 p-0">
                    <Col className="w-80">
                        <h1> NUESTRA COMUNIDAD </h1>
                        <p>
                            Tenemos una gran cantidad de profesionales que
                            quieren trabajar en su proyecto.
                        </p>
                        <img
                            src={CategoriasPopulares}
                            alt="Categorias Populares entre la Comunidad"
                            height="170"
                            width="100%"
                            maxWidth="900"
                        />
                    </Col>
                    <Col className="categoriasPopulares">
                        <h2>
                            {' '}
                            o encuentralos dentro de las categorías populares:
                        </h2>
                        <ul>
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
                <Row id="comerciantesLocales" className="m-0">
                    <Col>
                        <div className="localCiudades">
                            <h1>Busca en tu ciudad comerciantes calificados</h1>
                            <div className="ciudades">
                                <ul>
                                    <li>Bogota</li>
                                    <li>Medellin</li>
                                    <li>Cali</li>
                                </ul>
                                <ul>
                                    <li>Villavicencio</li>
                                    <li>Chia</li>
                                    <li>Cota</li>
                                </ul>
                                <ul>
                                    <li>Funza</li>
                                    <li>Mosquera</li>
                                    <li>Zipaquira</li>
                                </ul>
                            </div>
                            <img
                                src={LocalCiudades}
                                alt="Busca Comerciantes Locales"
                                height="121px"
                                width="500px"
                            />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default NuestraComunidad
