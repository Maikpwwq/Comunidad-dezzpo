/**
 * ProfileMap Component
 *
 * Display Google Maps location on user profiles.
 * Migrated from src/app/components/MapaPerfil.jsx
 */

import React, { useState, useEffect, useRef } from 'react'
import { googleLoader } from '@services/utils/googleMapsLoader'
import Box from '@mui/material/Box'

export interface UserLocationInfo {
    userId?: string
    userRazonSocial?: string
    userName?: string
    userDirection?: string
}

export interface ProfileMapProps {
    /** User information for map marker */
    userInfo: UserLocationInfo
    /** Initial latitude (defaults to Bogotá) */
    lat?: number
    /** Initial longitude (defaults to Bogotá) */
    lng?: number
    /** Map height */
    height?: string | number
    /** Map zoom level */
    zoom?: number
}

export function ProfileMap({
    userInfo,
    lat = 4.624335,
    lng = -74.063644,
    height = '270px',
    zoom = 12,
}: ProfileMapProps): React.ReactElement {
    const mapRef = useRef<HTMLDivElement>(null)
    const [latLng] = useState({ lat, lng })

    useEffect(() => {
        if (!mapRef.current || !userInfo) return

        const loadMap = async () => {
            try {
                const google = await googleLoader.load()
                if (!google || !mapRef.current) return

                const map = new google.maps.Map(mapRef.current, {
                    center: latLng,
                    zoom,
                    // auth_referrer_policy: 'origin',
                })

                const geocoder = new google.maps.Geocoder()
                const infowindow = new google.maps.InfoWindow()
                const marker = new google.maps.Marker({
                    position: latLng,
                    map,
                })

                const response = await geocoder.geocode({ location: latLng })

                if (response.results[0] && userInfo.userId) {
                    const infoContent = `${userInfo.userRazonSocial || userInfo.userName}, ${userInfo.userDirection}`
                    infowindow.setContent(infoContent)
                    infowindow.open(map, marker)
                }
            } catch (error) {
                console.error('Error loading map:', error)
            }
        }

        loadMap()
    }, [userInfo, latLng, zoom])

    return (
        <Box
            ref={mapRef}
            sx={{
                height,
                width: '100%',
                borderRadius: '15px',
                overflow: 'hidden',
            }}
        />
    )
}

export default ProfileMap
