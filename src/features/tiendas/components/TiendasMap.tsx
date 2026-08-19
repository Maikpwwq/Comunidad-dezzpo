import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Box, Paper, Typography, Alert, AlertTitle, CircularProgress } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { googleLoader } from '@services/utils/googleMapsLoader'
import { ListadoCategoriasTiendas } from '@assets/data/ListadoCategoriasTiendas'
import type { TiendaDocument } from '@services/tiendas'

interface TiendasMapProps {
    tiendas: TiendaDocument[]
    selectedCategory?: string
    selectedZone?: string
    height?: string
}

interface PlaceFallbackItem {
    place_id: string
    name: string
    address: string
    lat: number
    lng: number
}

const BOGOTA_CENTER = { lat: 4.624335, lng: -74.063644 }

export const TiendasMap: React.FC<TiendasMapProps> = ({
    tiendas,
    selectedCategory,
    selectedZone,
    height = '550px',
}) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
    const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([])
    const [isFallbackActive, setIsFallbackActive] = useState(false)
    const [fallbackItems, setFallbackItems] = useState<PlaceFallbackItem[]>([])
    const [loadingFallback, setLoadingFallback] = useState(false)
    const activeInfoWindow = useRef<google.maps.InfoWindow | null>(null)

    // Clear current markers
    const clearMarkers = useCallback(() => {
        markers.forEach((m) => {
            m.map = null
        })
        setMarkers([])
    }, [markers])

    // Initialize Map
    useEffect(() => {
        if (!mapRef.current) return

        googleLoader
            .load()
            .then((google: typeof globalThis.google) => {
                if (!mapRef.current) return

                const mapOptions: google.maps.MapOptions = {
                    center: BOGOTA_CENTER,
                    zoom: 11,
                    mapId: 'DEZZPO_TIENDAS_MAP',
                }

                const map = new google.maps.Map(mapRef.current, mapOptions)
                setMapInstance(map)
            })
            .catch((err) => {
                console.error('[TiendasMap] Failed to load Google Maps:', err)
            })
    }, [])

    // Plot markers when map and tiendas change
    useEffect(() => {
        if (!mapInstance || !globalThis.google) return

        // If we have curated tiendas matching filter
        if (tiendas.length > 0) {
            setIsFallbackActive(false)
            setFallbackItems([])
            clearMarkers()

            const newMarkers: google.maps.marker.AdvancedMarkerElement[] = []
            const bounds = new google.maps.LatLngBounds()
            let hasValidCoords = false

            tiendas.forEach((tienda) => {
                tienda.sedes.forEach((sede) => {
                    const lat = sede.lat || BOGOTA_CENTER.lat
                    const lng = sede.lng || BOGOTA_CENTER.lng

                    if (sede.lat && sede.lng) {
                        hasValidCoords = true;
                        bounds.extend({ lat, lng })
                    }

                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        position: { lat, lng },
                        map: mapInstance,
                        title: `${tienda.nombre} - ${sede.nombreSede}`,
                    })

                    const phoneString = (sede.telefonos || []).join(', ')
                    const contentString = `
                        <div style="padding: 8px; max-width: 250px; font-family: sans-serif;">
                            <h4 style="margin: 0 0 4px 0; color: #0A2540;">${tienda.nombre}</h4>
                            <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #0070F3;">${sede.nombreSede}</p>
                            <p style="margin: 0 0 6px 0; font-size: 12px; color: #555;">📍 ${sede.direccion}</p>
                            ${phoneString ? `<p style="margin: 0; font-size: 12px; color: #333;">📞 ${phoneString}</p>` : ''}
                        </div>
                    `

                    marker.addListener('click', () => {
                        if (activeInfoWindow.current) {
                            activeInfoWindow.current.close()
                        }
                        const infoWindow = new google.maps.InfoWindow({
                            content: contentString,
                        })
                        infoWindow.open({ anchor: marker, map: mapInstance })
                        activeInfoWindow.current = infoWindow
                    })

                    newMarkers.push(marker)
                })
            })

            setMarkers(newMarkers)

            if (hasValidCoords) {
                mapInstance.fitBounds(bounds)
            } else {
                mapInstance.setCenter(BOGOTA_CENTER)
                mapInstance.setZoom(11)
            }
        } 
        // Zero-result state for a selected category -> Run Google Places Fallback
        else if (selectedCategory) {
            setIsFallbackActive(true)
            setLoadingFallback(true)
            clearMarkers()

            const categoryObj = ListadoCategoriasTiendas.find((c) => c.key === selectedCategory)
            const queryTerm = categoryObj ? `${categoryObj.label} Bogotá` : 'Ferretería Bogotá'

            const dummyDiv = document.createElement('div')
            const service = new google.maps.places.PlacesService(dummyDiv)

            const request: google.maps.places.TextSearchRequest = {
                query: queryTerm,
                location: BOGOTA_CENTER,
                radius: 15000,
            }

            service.textSearch(request, (results, status) => {
                setLoadingFallback(false)
                if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                    const fallbackList: PlaceFallbackItem[] = []
                    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = []
                    const bounds = new google.maps.LatLngBounds()

                    results.slice(0, 15).forEach((place) => {
                        if (!place.geometry || !place.geometry.location) return

                        const lat = place.geometry.location.lat()
                        const lng = place.geometry.location.lng()
                        const name = place.name || 'Tienda Proveedora'
                        const address = place.formatted_address || 'Bogotá'

                        bounds.extend({ lat, lng })
                        fallbackList.push({ place_id: place.place_id || '', name, address, lat, lng })

                        const marker = new google.maps.marker.AdvancedMarkerElement({
                            position: { lat, lng },
                            map: mapInstance,
                            title: `${name} (Google Maps)`,
                        })

                        const contentString = `
                            <div style="padding: 8px; max-width: 250px; font-family: sans-serif;">
                                <h4 style="margin: 0 0 4px 0; color: #0A2540;">${name}</h4>
                                <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #e65100;">PROVEEDOR GOOGLE MAPS</p>
                                <p style="margin: 0; font-size: 12px; color: #555;">📍 ${address}</p>
                            </div>
                        `

                        marker.addListener('click', () => {
                            if (activeInfoWindow.current) {
                                activeInfoWindow.current.close()
                            }
                            const infoWindow = new google.maps.InfoWindow({
                                content: contentString,
                            })
                            infoWindow.open({ anchor: marker, map: mapInstance })
                            activeInfoWindow.current = infoWindow
                        })

                        newMarkers.push(marker)
                    })

                    setFallbackItems(fallbackList)
                    setMarkers(newMarkers)
                    mapInstance.fitBounds(bounds)
                }
            })
        }
    }, [mapInstance, tiendas, selectedCategory, selectedZone])

    return (
        <Paper
            elevation={2}
            sx={{
                position: 'relative',
                width: '100%',
                height,
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            {/* Inline Fallback Alert Banner */}
            {isFallbackActive && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        width: '90%',
                        maxWidth: 600,
                    }}
                >
                    <Alert
                        severity="info"
                        icon={loadingFallback ? <CircularProgress size={20} /> : <InfoIcon />}
                        sx={{
                            borderRadius: 2,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <AlertTitle sx={{ fontWeight: 700, fontSize: '0.9rem', m: 0 }}>
                            {loadingFallback
                                ? 'Buscando tiendas en Google Maps...'
                                : 'Aún no tenemos tiendas verificadas por Dezzpo en esta categoría'}
                        </AlertTitle>
                        <Typography variant="caption" color="text.secondary">
                            {fallbackItems.length > 0
                                ? `Mostrando ${fallbackItems.length} resultados de búsqueda en tiempo real de Google Maps para tu comodidad.`
                                : 'Mostrando resultados de búsqueda en tiempo real de Google Maps para tu comodidad.'}
                        </Typography>
                    </Alert>
                </Box>
            )}

            {/* Map Canvas */}
            <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />
        </Paper>
    )
}
