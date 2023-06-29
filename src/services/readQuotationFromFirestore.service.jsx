import { collection, doc, getDocFromServer } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseClient'
import PropTypes from 'prop-types'

import { sharingInformationService } from '@/services/sharing-information'

const readQuotationFromFirestore = (props) => {
    const _firestore = firestore
    const { docId } = props
    console.log('readQuotationFromFirestore', docId)

    const quotationRef = collection(_firestore, 'quotation')

    const quotationFromFirestore = async (docId) => {
        try {
            const quotationData = await getDocFromServer(
                doc(quotationRef, docId)
            )
            return quotationData
        } catch (err) {
            console.log('Error getting draft: ', err)
        }
    }

    // var solution = () => {
    quotationFromFirestore(docId).then((data) => {
        if (data) {
            const res = data.data()
            console.log('quotationFromFirestore', data, res)
            sharingInformationService.setSubject({ quotation: res })
        }
    })
}

readQuotationFromFirestore.propTypes = {
    docId: PropTypes.string.isRequired,
}

export default readQuotationFromFirestore
