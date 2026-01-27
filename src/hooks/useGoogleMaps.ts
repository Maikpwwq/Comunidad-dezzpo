/**
 * useGoogleMaps Hook
 *
 * Reusable hook for Google Maps initialization.
 * Extracted from ProfileMap and Ubicacion components.
 */

import { useEffect, useState, useRef, useCallback } from 'react'
import { googleLoader } from '@services/utils/googleMapsLoader'

export interface MapOptions {
    /** Center coordinates */
    center?: { lat: number; lng: number }
    /** Zoom level */
    zoom?: number
    /** Click handler */
    onClick?: (lat: number, lng: number, address?: string) => void
}

export interface UseGoogleMapsReturn {
    /** Ref to attach to map container */
    mapRef: React.RefObject<HTMLDivElement>
    /** Whether map is loaded */
    isLoaded: boolean
    /** Map instance (if available) */
    map: google.maps.Map | null
    /** Error if loading failed */
    error: Error | null
    /** Add a marker to the map */
    addMarker: (lat: number, lng: number, title?: string) => google.maps.Marker | null
}

const DEFAULT_CENTER = { lat: 4.624335, lng: -74.063644 } // Bogotá, Colombia

/**
 * Hook for Google Maps initialization and interaction
 *
 * @example
 * ```tsx
 * const { mapRef, isLoaded, addMarker } = useGoogleMaps({
 *   center: { lat: 4.624335, lng: -74.063644 },
 *   zoom: 10,
 *   onClick: (lat, lng) => console.log('Clicked:', lat, lng)
 * })
 *
 * return <div ref={mapRef} style={{ height: '400px' }} />
 * ```
 */
export function useGoogleMaps(options: MapOptions = {}): UseGoogleMapsReturn {
    const { center = DEFAULT_CENTER, zoom = 8, onClick } = options
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    // Initialize map
    useEffect(() => {
        if (!mapRef.current) return

        googleLoader
            .load()
            .then((google: typeof globalThis.google) => {
                if (!mapRef.current) return

                const mapInstance = new google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                })

                // Add click handler if provided
                if (onClick) {
                    mapInstance.addListener('click', async (e: google.maps.MapMouseEvent) => {
                        if (!e.latLng) return

                        const coords = e.latLng.toJSON()

                        // Try to get address via reverse geocoding
                        try {
                            const geocoder = new google.maps.Geocoder()
                            const response = await geocoder.geocode({ location: coords })
                            const address = response.results[0]?.formatted_address
                            onClick(coords.lat, coords.lng, address)
                        } catch {
                            onClick(coords.lat, coords.lng)
                        }
                    })
                }

                setMap(mapInstance)
                setIsLoaded(true)
            })
            .catch((err: Error) => {
                setError(err)
            })
    }, [center.lat, center.lng, zoom, onClick])

    // Add marker helper
    const addMarker = useCallback(
        (lat: number, lng: number, title?: string): google.maps.Marker | null => {
            if (!map) return null

            return new google.maps.Marker({
                position: { lat, lng },
                map,
                ...(title && { title }),
            })
        },
        [map]
    )

    return {
        mapRef,
        isLoaded,
        map,
        error,
        addMarker,
    }
}

export default useGoogleMaps
