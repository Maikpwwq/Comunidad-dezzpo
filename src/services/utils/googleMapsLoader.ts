import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

const googleApiKey = import.meta.env.VITE_APP_GOOGLE_APIKEY

let initialized = false

export const googleLoader = {
    load: async () => {
        if (!initialized) {
            setOptions({
                key: googleApiKey,
                v: 'weekly',
                libraries: ['places'],
            })
            initialized = true
        }
        
        // Ensure core libraries are loaded
        await Promise.all([
            importLibrary('maps'),
            importLibrary('places'),
            importLibrary('marker'),
            importLibrary('geocoding')
        ])

        return globalThis.google
    }
}

export const mapOptions = {
    center: {
        lat: 4.624335,
        lng: -74.063644,
    },
    zoom: 8,
    auth_referrer_policy: 'origin',
}
