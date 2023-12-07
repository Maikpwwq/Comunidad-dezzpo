import * as React from 'react'
import '#@/assets/css/nuestra_comunidad.css'
import CategoriasSlider from '#@/index/components/nuestra-comunidad/CategoriasSlider'
// import { CategoriasPupulares } from './CategoriasPupulares/CategoriasPupulares'
//imagenes
//import CategoriasPopulares from '#@/assets/img/CategoriasPopulares.png'

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
// import BuscaEnTuCiudad from './busca-en-tu-ciudad/BuscaEnTuCiudad'

const NuestraComunidad = () => {
    return (
        <>
            <Container fluid className="p-0">
                <Col id="popularCategorias" className="m-4 p-4">
                    <Col className="w-80">
                        <h2 className="headline-xl">
                            Nuestra <strong>Comunidad</strong>
                        </h2>
                        <p className="body-1 pb-4">
                            Tenemos una gran cantidad de profesionales que
                            quieren trabajar en su proyecto.
                        </p>
                        <CategoriasSlider />
                    </Col>
                </Col>
            </Container>
            {/* seccion de categorias y servicios */}
            {/* <CategoriasPupulares />
            <BuscaEnTuCiudad /> */}
        </>
    )
}

export default NuestraComunidad