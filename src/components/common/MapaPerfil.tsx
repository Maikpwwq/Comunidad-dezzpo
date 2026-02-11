import React, { useEffect, useRef } from 'react'
import { useGoogleMaps } from '@hooks/useGoogleMaps'
import { Container, Row, Col } from 'react-bootstrap'

interface MapaPerfilProps {
    userInfo: {
        userId?: string | null
        userRazonSocial?: string | null
        userName?: string | null
        userDirection?: string | null
        [key: string]: any
    }
}

const DEFAULT_CENTER = {
    lat: 4.624335,
    lng: -74.063644,
}

export const MapaPerfil: React.FC<MapaPerfilProps> = ({ userInfo }) => {
    const { mapRef, map, isLoaded, addMarker } = useGoogleMaps({
        center: DEFAULT_CENTER,
        zoom: 12,
    })

    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

    useEffect(() => {
        if (isLoaded && map && userInfo?.userId) {
            // Add marker if not exists
            if (!markerRef.current) {
                markerRef.current = addMarker(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng)
            }

            // Create InfoWindow
            if (!infoWindowRef.current) {
                infoWindowRef.current = new google.maps.InfoWindow()
            }

            // Geocode and open InfoWindow
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ location: DEFAULT_CENTER }).then((response) => {
                if (response.results[0]) {
                    const infoGroup = `${userInfo.userRazonSocial || userInfo.userName
                        }, ${userInfo.userDirection}`

                    if (infoWindowRef.current && markerRef.current) {
                        infoWindowRef.current.setContent(infoGroup)
                        infoWindowRef.current.open({ anchor: markerRef.current, map })
                    }
                }
            }).catch(e => console.error("Geocoding failed", e))
        }
    }, [isLoaded, map, userInfo, addMarker])

    return (
        <Container fluid className="p-0">
            <Row className="m-0 w-100">
                <Col className="p-0">
                    <div
                        ref={mapRef}
                        id="profile-map"
                        style={{
                            height: '270px',
                            width: '100%',
                            borderRadius: '15px',
                        }}
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default MapaPerfil
