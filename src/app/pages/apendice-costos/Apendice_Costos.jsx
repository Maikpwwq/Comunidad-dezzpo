// Pagina de Apendice de costos
import React, { useState, useEffect } from 'react'
import '../../../../public/assets/css/apendice_costos.css'
import { Link } from 'react-router-dom'

// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import { collection, doc, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebase/firebaseClient'

const ApendiceCostos = () => {
    const [categoriaInfo, setCategoriaInfo] = useState([])
    const _firestore = firestore
    const categoriaRef = collection(_firestore, 'categoriasServicios')
    const subCategoriaRef = doc(categoriaRef, 'aPTAljOeD48FbniBg6Lw')

    const categoriasFromFirestore = async () => {
        try {
            const categoriaData = await getDocs(subCategoriaRef)
            return categoriaData
        } catch (err) {
            console.log(
                'Error al obtener los datos de la colleccion categorias: ',
                err
            )
        }
    }

    useEffect(() => {
        categoriasFromFirestore()
            .then((docSnap) => {
                if (docSnap) {
                    const data = docSnap.docs.map((element) => ({
                        ...element.data(),
                    }))
                    console.log(data)
                    if (data.length > 0) {
                        setCategoriaInfo({
                            data,
                        })
                        console.log(categoriaInfo)
                    }
                } else {
                    console.log(
                        'No se encontro información en la colleccion proyectos!'
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <>
            <Container fluid className="p-0">
                <Row className="apendiceCostosTitulo m-0 w-100 d-flex justify-content-end">
                    <Col lg={4} md={6} sm={10} xs={12}>
                        <h3 className="titulo headline-xl">
                            Costeo de Servicios
                            <br />
                            Comunes
                        </h3>
                    </Col>
                </Row>
            </Container>
            {/* <Container fluid className="p-0">
                <Row className="m-0 w-100 d-flex">
                    TODO insert Firebase Table!
                </Row>
            </Container> */}
            <Container fluid className="p-0">
                <Row className="apendiceCostosPreguntas m-0 w-100">
                    <Col>
                        <ul className="body-2">
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar nuevas
                                    tomacorrientes?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar una ducha electrica?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta diagnosticar un fallo
                                    electrico?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta remodelar una habitación?
                                </Link>
                            </li>
                            <li>
                                <Link to="/apendice-costos">
                                    ¿Cuánto cuesta instalar nuevas iluminaciones
                                    y lamparas?
                                </Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ApendiceCostos
