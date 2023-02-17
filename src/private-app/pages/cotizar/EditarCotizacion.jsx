import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore, storage } from '@/firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

import Container from 'react-bootstrap/Container'

const EditarCotizacion = () => {
    
    return (
        <>
            <Container fluid className="p-0">
                Cargar cotizacion
            </Container>
        </>
    )
}

export default EditarCotizacion