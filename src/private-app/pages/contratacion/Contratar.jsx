import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { firestore, storage } from '../../../firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

import Container from 'react-bootstrap/Container'

const Contratar = () => {
    return (
        <>
            <Container fluid className="p-0">
                Contrato de servicios
            </Container>
        </>
    )
}

export default Contratar