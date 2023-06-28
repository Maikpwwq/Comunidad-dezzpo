import { collection, doc, getDocFromServer } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseClient'
import PropTypes from 'prop-types'

import { sharingInformationService } from '@/services/sharing-information'

const readUserFromFirestore = (props) => {
    const _firestore = firestore
    const { firestoreUserID, userSelectedRol } = props
    // console.log('readUserFromFirestore', firestoreUserID, userSelectedRol)

    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const userFromFirestore = async () => {
        try {
            if (userSelectedRol === 1) {
                const userData = await getDocFromServer(
                    doc(usersProResRef, firestoreUserID)
                )
                return userData
            } else if (userSelectedRol === 2) {
                const userData = await getDocFromServer(
                    doc(usersComCalRef, firestoreUserID)
                )
                return userData
            }
        } catch (err) {
            console.log('Error getting user: ', err)
        }
    }
    // var solution = () => {
    userFromFirestore().then((data) => {
        if (data) {
            const res = data.data()
            sharingInformationService.setSubject(res)
        }
    })
}

readUserFromFirestore.propTypes = {
    firestoreUserID: PropTypes.string.isRequired,
    userSelectedRol: PropTypes.number.isRequired,
}

export default readUserFromFirestore
