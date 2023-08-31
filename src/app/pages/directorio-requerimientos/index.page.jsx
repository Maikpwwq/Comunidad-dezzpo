export { Page }
export { LayoutAppPaperbase as Layout} from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Portal_Servicios
import React, { useState, useEffect } from 'react'
import { firestore } from '#@/firebase/firebaseClient' // storage,
import { collection, getDocs } from 'firebase/firestore' // , query, where

import { DraftCard } from '#@/app/components/DraftCard'

// react-bootrstrap
// import { Row, Col, Container, Button } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Page = () => {
    const _firestore = firestore
    const draftRef = collection(_firestore, 'drafts')
    const [draftsData, setDraftsData] = useState({})

    useEffect(() => {
        const draftsFromFirestore = async () => {
            try {
                const draftData = await getDocs(draftRef)
                return draftData
            } catch (err) {
                console.log(
                    'Error al obtener los datos de la colleccion users: ',
                    err
                )
            }
        }
        draftsFromFirestore()
            .then((docSnap) => {
                if (docSnap) {
                    console.log('draftsFromFirestore', docSnap)
                    const data = docSnap.docs.map((element) => ({
                        ...element.data(),
                    }))
                    console.log(data)
                    setDraftsData({
                        data,
                    })
                } else {
                    console.log(
                        'No se encontro información en la colleccion proyectos!'
                    )
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [draftRef])

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex">
                    <Col className="p-2" lg={8} md={8} sm={10} xs={12}>
                        <h2 className="headline-xl">
                            Directorio Requerimientos{'  '}
                            <Button className="body-1 btn-round btn-high">
                                Aplica gratis a un requerimiento
                            </Button>
                        </h2>
                        <h3 className="headline-l">
                            Buscar Requerimientos: Obtener o Aplicar con
                            Cotizaciones
                        </h3>
                        <p className="body-2">Requerimientos activos </p>
                        {/* TODO: Para el propietario proponente cambiar la accion de Aplicar por Editar */}
                        <Row className="m-0 d-flex">
                            {draftsData.data ? (
                                draftsData.data.map((draft) => (
                                    <DraftCard
                                        key={draft.id}
                                        props={draft}
                                    ></DraftCard>
                                ))
                            ) : (
                                <></>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
