import React, { useState, useEffect } from 'react'
// import { Loader } from '@googlemaps/js-api-loader'
import { googleLoader } from '@google/GoogleMapsAdmin'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import PropTypes from 'prop-types'

const MapaPerfil = ({ userInfo }) => {
    // , setLatLng
    const [latLng] = useState({
        lat: 4.624335,
        lng: -74.063644,
    })
    const loader = googleLoader

    // The latitude of Bogotá, Colombia is 4.624335, and the longitude is -74.063644.
    const mapOptions = {
        center: {
            lat: 4.624335,
            lng: -74.063644,
        },
        zoom: 12,
        auth_referrer_policy: 'origin',
    }

    let map
    useEffect(() => {
        loader
            .load()
            .then((google) => {
                // console.log(latLng)
                if (google) {
                    map = new google.maps.Map(
                        document.getElementById('profile-map'),
                        mapOptions
                    )
                    const geocoder = new google.maps.Geocoder()
                    const infowindow = new google.maps.InfoWindow()
                    const marker = new google.maps.Marker({
                        position: latLng,
                        map: map,
                    })
                    geocoder.geocode({ location: latLng }).then((response) => {
                        if (response.results[0]) {
                            // const formattedAddress =
                            //     response.results[0].formatted_address
                            if (userInfo.userId) {
                                // console.log(userInfo.userId)
                                const infoGroup = `${
                                    userInfo.userRazonSocial || userInfo.userName
                                }, ${userInfo.userDirection}`
                                infowindow.setContent(infoGroup)
                                infowindow.open(map, marker)
                            }
                        } else {
                            if (!!window && typeof window !== 'undefined') {
                                window.alert('No results found')
                            }
                        }
                    })
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }, [userInfo])

    return (
        <>
            <Container fluid className="p-0">
                <Row className="m-0 w-100">
                    <Col className="p-0">
                        <div
                            id="profile-map"
                            style={{
                                height: '270px',
                                width: '100%',
                                borderRadius: '15px',
                            }}
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

MapaPerfil.propTypes = {
    userInfo: PropTypes.object,
}

export default MapaPerfil