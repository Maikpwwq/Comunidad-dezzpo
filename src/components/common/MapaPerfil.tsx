import React, { useEffect, useRef, useMemo } from 'react'
import { useGoogleMaps } from '@hooks/useGoogleMaps'
import { Container, Row, Col } from 'react-bootstrap'

interface MapaPerfilProps {
    userInfo: {
        userId?: string | null
        userRazonSocial?: string | null
        userName?: string | null
        userDirection?: string | null
        userCiudad?: string | null
        userCodigoPostal?: string | null
        [key: string]: any
    }
}

const DEFAULT_CENTER = {
    lat: 4.624335,
    lng: -74.063644,
}

/**
 * Build a geocodable address string from the user's structured fields.
 * Returns null when no meaningful data is present.
 */
function buildAddressQuery(
    direction?: string | null,
    ciudad?: string | null,
    codigoPostal?: string | null
): string | null {
    const parts = [direction, ciudad, codigoPostal]
        .map((p) => (p ?? '').trim())
        .filter(Boolean)

    return parts.length > 0 ? parts.join(', ') : null
}

export const MapaPerfil: React.FC<MapaPerfilProps> = ({ userInfo }) => {
    // Initialize map once with Bogotá defaults — never re-created
    const { mapRef, map, isLoaded, addMarker } = useGoogleMaps({
        center: DEFAULT_CENTER,
        zoom: 14,
    })

    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

    // Memoize address so geocoding only fires when fields actually change
    const addressQuery = useMemo(
        () =>
            buildAddressQuery(
                userInfo?.userDirection,
                userInfo?.userCiudad,
                userInfo?.userCodigoPostal
            ),
        [userInfo?.userDirection, userInfo?.userCiudad, userInfo?.userCodigoPostal]
    )

    // Forward-geocode address → pan map + place marker
    useEffect(() => {
        if (!isLoaded || !map || !userInfo?.userId) return

        // Build InfoWindow label
        const label = [userInfo.userRazonSocial || userInfo.userName, userInfo.userDirection]
            .filter(Boolean)
            .join(', ')

        const placeMarker = (position: google.maps.LatLngLiteral) => {
            // Remove old marker
            if (markerRef.current) {
                markerRef.current.map = null
            }

            markerRef.current = addMarker(position.lat, position.lng)

            // InfoWindow
            if (!infoWindowRef.current) {
                infoWindowRef.current = new google.maps.InfoWindow()
            }
            if (label && markerRef.current) {
                infoWindowRef.current.setContent(label)
                infoWindowRef.current.open({ anchor: markerRef.current, map })
            }

            map.panTo(position)
        }

        if (addressQuery) {
            // Forward-geocode the user's address
            const geocoder = new google.maps.Geocoder()
            geocoder
                .geocode({ address: addressQuery })
                .then((response) => {
                    const location = response.results[0]?.geometry?.location
                    if (location) {
                        placeMarker({ lat: location.lat(), lng: location.lng() })
                    } else {
                        // Geocode returned no results — fall back
                        placeMarker(DEFAULT_CENTER)
                    }
                })
                .catch((e) => {
                    console.error('Geocoding failed for:', addressQuery, e)
                    placeMarker(DEFAULT_CENTER)
                })
        } else {
            // No address data — use Bogotá default
            placeMarker(DEFAULT_CENTER)
        }
    }, [isLoaded, map, addressQuery, userInfo?.userId, addMarker])

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
