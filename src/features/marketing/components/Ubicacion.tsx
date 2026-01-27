/**
 * Ubicacion (LocationPicker) Component
 *
 * Google Maps location picker with autocomplete.
 * Migrated from src/index/components/ubicacion/Ubicacion.jsx
 */

import React, { useState, useEffect, useCallback, useRef } from 'react'
import AutoComplete from 'react-google-autocomplete'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { googleLoader } from '@services/utils/googleMapsLoader'
import '@assets/css/ubicacion.css'

interface LocationInfo {
    city: string
    street: string
    postalCode: string
}

interface Coordinates {
    lat: number
    lng: number
}

export interface UbicacionProps {
    /** Location info state */
    locInfo?: Record<string, unknown>
    /** Location info setter */
    setLocInfo?: (info: Record<string, unknown>) => void
    /** Dialog open state setter */
    setOpen?: (open: boolean) => void
}

const DEFAULT_COORDS: Coordinates = {
    lat: 4.624335,
    lng: -74.063644,
}

export function Ubicacion({
    locInfo,
    setLocInfo,
    setOpen,
}: UbicacionProps): React.ReactElement {
    const googleApiKey = import.meta.env.VITE_APP_GOOGLE_APIKEY as string
    const [loaded, setLoaded] = useState(false)
    const [locationInfo, setLocationInfo] = useState<LocationInfo>({
        city: '',
        street: '',
        postalCode: '',
    })
    const mapRef = useRef<HTMLDivElement>(null)

    // Initialize Google Maps
    useEffect(() => {
        googleLoader
            .load()
            .then((google: typeof globalThis.google) => {
                if (!google || !mapRef.current) return

                const mapOptions = {
                    center: DEFAULT_COORDS,
                    zoom: 8,
                }

                const map = new google.maps.Map(mapRef.current, mapOptions)

                map.addListener('click', (e: google.maps.MapMouseEvent) => {
                    if (!e.latLng) return

                    new google.maps.Marker({
                        position: e.latLng,
                        map: map,
                    })

                    const coordenadas = e.latLng.toJSON()

                    // Reverse geocode to get address
                    const geocoder = new google.maps.Geocoder()
                    geocoder.geocode({ location: coordenadas }).then((response: google.maps.GeocoderResponse) => {
                        if (response.results[0]) {
                            const formattedAddress = response.results[0].formatted_address
                            const infowindow = new google.maps.InfoWindow({
                                content: formattedAddress,
                            })

                            const marker = new google.maps.Marker({
                                position: coordenadas,
                                map: map,
                            })

                            infowindow.open(map, marker)
                            setLocationInfo((prev) => ({
                                ...prev,
                                street: formattedAddress,
                            }))
                        }
                    })
                })
            })
            .catch(console.error)
    }, [])

    // Sync location info to parent
    useEffect(() => {
        if (!locationInfo.street || loaded || !locInfo || !setLocInfo) return

        const isDraft = 'draftId' in locInfo
        const isUser = 'userId' in locInfo

        if (isDraft && locInfo.draftDirection !== locationInfo.street) {
            setLocInfo({
                ...locInfo,
                draftCity: locationInfo.city,
                draftDirection: locationInfo.street,
                draftPostalCode: locationInfo.postalCode,
            })
            setLoaded(true)
        }

        if (isUser && locInfo.userDirection !== locationInfo.street) {
            setLocInfo({
                ...locInfo,
                userDirection: locationInfo.street,
                userCiudad: locationInfo.city,
                userCodigoPostal: locationInfo.postalCode,
            })
            setLoaded(true)
        }
    }, [loaded, locInfo, locationInfo, setLocInfo])

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocationInfo((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }))
            setLoaded(false)
        },
        []
    )

    const handleConfirm = useCallback(() => {
        setOpen?.(false)
    }, [setOpen])

    const handlePlaceSelected = useCallback((place: google.maps.places.PlaceResult) => {
        if (place.formatted_address) {
            setLocationInfo((prev) => ({
                ...prev,
                city: place.formatted_address || '',
            }))
        }
    }, [])

    return (
        <Container fluid className="p-0">
            <Row className="ingresoUbicacion m-0 w-100">
                <Col className="left p-4 w-100">
                    <Form action="busquedaCiudad">
                        <h3 className="headline-l textBlanco">Ingresa tu ubicación</h3>
                        <p className="body-1 textBlanco">
                            Podras consultar con mejor precision los costos y tiempos de
                            entrega.
                        </p>

                        <Form.Group className="mb-2" controlId="formBasicCity">
                            <Form.Label className="mb-0">1. Elija su ciudad</Form.Label>
                            <br />
                            <AutoComplete
                                className="w-100"
                                apiKey={googleApiKey}
                                onPlaceSelected={handlePlaceSelected}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="formBasicStreet">
                            <Form.Label className="mb-0">
                                2. Clickear una dirección en el mapa
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Registre la dirección"
                                name="street"
                                value={locationInfo.street}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Col>
                                <hr />
                                <Button
                                    className="btn-round btn-high"
                                    variant="primary"
                                    onClick={handleConfirm}
                                >
                                    Confirmar dirección
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>

                <Col className="p-0">
                    <div ref={mapRef} id="map" style={{ height: '450px', width: '700px' }} />
                </Col>
            </Row>
        </Container>
    )
}

export default Ubicacion
