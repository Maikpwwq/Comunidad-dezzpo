import { collection, doc, setDoc } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseClient'
import PropTypes from 'prop-types'

import { sharingInformationService } from '@/services/sharing-information'

const updateQuotationToFirestore = (props) => {
    const _firestore = firestore
    const { firestoreUserID, userRol } = props
    console.log('updateQuotationToFirestore', firestoreUserID, userRol)

    const quotationRef = collection(_firestore, 'quotation')

    const quotationToFirestore = async (updateInfo, docId) => {
        try {
            const quotationData = await setDoc(
                doc(quotationRef, docId),
                updateInfo
            )
            sharingInformationService.setSubject(quotationData)
            return quotationData
        } catch (err) {
            console.log('Error getting draft: ', err)
        }
    }

    // var solution = () => {
    quotationToFirestore().then((data, onfulfilled) => {
        console.log('data', data, onfulfilled)
        if (onfulfilled) {
            return data
        }
    })
    // }
    return userFromFirestore
    // if (solution !== undefined) {
    //     return solution
    // }
}

updateQuotationToFirestore.propTypes = {
    firestoreUserID: PropTypes.string.isRequired,
    userRol: PropTypes.number.isRequired,
}

export default updateQuotationToFirestore
