import React, { useState } from 'react'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

const Rol = () => {
    const { state } = useLocation() || {}
    const userId = state || ' ' // Este es el id como parametro de busqueda de un perfil especifico
    
}

export default Rol