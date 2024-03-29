export { Page }
export { LayoutAppPaperbase as Layout } from '#@/app/components/LayoutAppPaperbase'

import React from 'react' // , { useState, useEffect }
// import { firestore, storage } from '#@/firebase/firebaseClient'
// import { collection, doc, getDocFromServer } from 'firebase/firestore'
import PropTypes from 'prop-types'

import Container from 'react-bootstrap/Container'

const Page = ({ draftId, quotationId, proponentId }) => {
    return (
        <>
            <Container fluid className="p-0">
                Contrato de servicios
                {draftId}, {quotationId}, {proponentId}
                pagar
            </Container>
        </>
    )
}

Page.propTypes = {
    draftId: PropTypes.string,
    quotationId: PropTypes.string,
    proponentId: PropTypes.string,
}
