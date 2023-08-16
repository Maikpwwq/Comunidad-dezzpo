export { Ubicacion }
import React, { useState, useEffect } from 'react'
import AutoComplete from 'react-google-autocomplete'
// import { Loader } from '@googlemaps/js-api-loader'
import { googleLoader } from '#@/google/GoogleMapsAdmin'
// import Marker from '#P/index/components/maps/Marker'
import '#@/assets/css/ubicacion.css'

// import { Row, Col, Container, Button, Form } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import PropTypes from 'prop-types'

const Ubicacion = ({ setLocInfo, locInfo, setOpen }) => {
    const googleApiKey = import.meta.env.VITE_APP_GOOGLE_APIKEY
    const [clicks, setClicks] = useState({
        lat: 4.624335,
        lng: -74.063644,
    })

    const [locationInfo, setLocationInfo] = useState({
        city: '',
        street: '',
        postalCode: '',
    })
    const loader = googleLoader
    // The latitude of Bogotá, Colombia is 4.624335, and the longitude is -74.063644.
    const mapOptions = {
        center: {
            lat: 4.624335,
            lng: -74.063644,
        },
        zoom: 8,
        auth_referrer_policy: 'origin',
    }

    let map
    useEffect(() => {
        loader
            .load()
            .then((google) => {
                map = new google.maps.Map(
                    document.getElementById('map'),
                    mapOptions
                )
                map.addListener('click', (e) => {
                    const marker = new google.maps.Marker({
                        position: e.latLng,
                        map: map,
                    })
                    if (e.latLng.toJSON()) {
                        const coordenadas = e.latLng.toJSON()
                        // const coordenadas = JSON.stringify(
                        //     e.latLng.toJSON(),
                        //     null,
                        //     2
                        // )
                        console.log('coordenadas', coordenadas)
                        setClicks({
                            lat: coordenadas.lat,
                            lng: coordenadas.lng,
                        })
                    }
                })
                if (clicks.lat !== 4.624335) {
                    const geocoder = new google.maps.Geocoder()
                    const infowindow = new google.maps.InfoWindow()
                    console.log(typeof clicks.lat, typeof clicks.lng)
                    geocoder.geocode({ location: clicks }).then((response) => {
                        if (response.results[0]) {
                            map.setZoom(8)
                            const marker = new google.maps.Marker({
                                position: clicks,
                                map: map,
                            })
                            const formattedAddress =
                                response.results[0].formatted_address
                            // const ZipCode =
                            //     response.results[0].address_components[7]
                            //         .long_name
                            console.log(response.results[0])
                            infowindow.setContent(formattedAddress)
                            setLocationInfo({
                                ...locationInfo,
                                street: formattedAddress,
                                // postalCode: ZipCode,
                            })
                            infowindow.open(map, marker)
                        } else {
                            window.alert('No results found')
                        }
                    })
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }, [clicks])

    useEffect(() => {
        if (locInfo) {
            if (locInfo.draftId) {
                console.log(locInfo.draftId)
                setLocInfo({
                    ...locInfo,
                    draftCity: locationInfo.city,
                    draftDirection: locationInfo.street,
                    draftPostalCode: locationInfo.postalCode,
                })
                console.log('DirectionChanged')
            }
            if (locInfo.userId) {
                console.log(locInfo.userId)
                setLocInfo({
                    ...locInfo,
                    userDirection: locationInfo.street,
                    userCiudad: locationInfo.city,
                    userCodigoPostal: locationInfo.postalCode,
                })
                console.log('DirectionChanged')
            }
        }
    }, [locationInfo])

    const handleChange = (event) => {
        setLocationInfo({
            ...locationInfo,
            [event.target.name]: event.target.value,
        })
    }

    const handleConsult = () => {
        setOpen(false)
    }

    return (
        <>
            <Container fluid className="p-0">
                <Row className="ingresoUbicacion m-0 w-100">
                    <Col className="left p-4 w-100">
                        <Form action="busquedaCiudad">
                            <h3 className="headline-l textBlanco">
                                Ingresa tu ubicación
                            </h3>
                            <p className="body-1 textBlanco">
                                Podras consultar con mejor precision los costos
                                y tiempos de entrega.
                            </p>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicCity"
                            >
                                <Form.Label className="mb-0">
                                    1. Elija su ciudad
                                </Form.Label>
                                <br />
                                <AutoComplete
                                    className="w-100"
                                    apiKey={googleApiKey}
                                    onPlaceSelected={(place) => {
                                        const { formatted_address } = place // , geometry
                                        // const {location} = geometry
                                        // const {lat} = location
                                        // console.log(place)
                                        setLocationInfo({
                                            ...locationInfo,
                                            city: formatted_address,
                                        })
                                    }}
                                    name="city"
                                />
                            </Form.Group>
                            <Form.Group
                                className="mb-2"
                                controlId="formBasicStreet"
                            >
                                <Form.Label className="mb-0">
                                    2. Clickear una dirección en el mapa
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Registre la dirección"
                                    name="street"
                                    value={locationInfo.street}
                                    onChange={handleChange}
                                    variant="filled"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Col>
                                    <hr />
                                    <Button
                                        className="btn-round btn-high"
                                        variant="primary"
                                        // type="submit"
                                        onClick={handleConsult}
                                    >
                                        Confirmar dirección
                                    </Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                    {/* className="imagenUbicacion" */}
                    <Col className="p-0">
                        <div
                            id="map"
                            style={{ height: '450px', width: '700px' }}
                        >
                            {/* {clicks.map((latLng, i) => (
                                <Marker key={i} position={latLng} />
                            ))} */}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

// const Marker = (options) => {
//     const [marker, setMarker] = useState()

//     useEffect(() => {
//         if (!marker) {
//             setMarker(new google.maps.Marker())
//         }

//         // remove marker from map on unmount
//         return () => {
//             if (marker) {
//                 marker.setMap(null)
//             }
//         }
//     }, [marker])
//     useEffect(() => {
//         if (marker) {
//             marker.setOptions(options)
//         }
//     }, [marker, options])
//     return null
// }

Ubicacion.propTypes = {
    setOpen: PropTypes.func,
    setLocInfo: PropTypes.func,
    locInfo: PropTypes.object,
}
