import React from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const googleApiKey = process.env.REACT_APP_GOOGLE_APIKEY
export const googleLoader = new Loader({
    apiKey: googleApiKey,
    version: 'weekly',
    libraries: ['places'],
})
// The latitude of Bogotá, Colombia is 4.624335, and the longitude is -74.063644.
export const mapOptions = {
    center: {
        lat: 4.624335,
        lng: -74.063644,
    },
    zoom: 8,
    auth_referrer_policy: 'origin',
}
