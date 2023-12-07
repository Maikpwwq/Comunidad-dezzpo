import React from 'react'

// import Row from 'react-bootstrap/Row'
// import Col from 'react-bootstrap/Col'
// import Container from 'react-bootstrap/Container'

const Rol = ({ state }) => {
    const userId = state || ' ' // Este es el id como parametro de busqueda de un perfil especifico
    return <>{userId}</>
}

export default Rol