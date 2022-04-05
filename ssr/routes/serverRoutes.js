import React from 'react'
import { useRoutes } from 'react-router-dom'
import Home from '../../src/app/pages/Inicio'

const serverRoutes = () => {
    return useRoutes([
        {
            element: <Home />,
            path: '/',
        },
        {
            path: '*',
            element: <Home />,
        },
    ])
}

export default serverRoutes
