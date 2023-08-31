export { Page }
export { LayoutAppPaperbase as Layout} from '#@/app/components/LayoutAppPaperbase'

import React, { useState, useEffect } from 'react'
import { usePageContext } from '#R/usePageContext'
import { firestore, storage } from '#@/firebase/firebaseClient'
import { collection, doc, getDocFromServer } from 'firebase/firestore'

import Container from 'react-bootstrap/Container'

const Page = () => {
    const pageContext = usePageContext()
    // pageContext.routeParams
    return (
        <>
            <Container fluid className="p-0">
                Cargar cotizacion
            </Container>
        </>
    )
}
