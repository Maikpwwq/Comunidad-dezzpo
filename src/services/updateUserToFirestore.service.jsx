import { collection, doc, setDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { firestore, auth } from 'firebase/firebaseClient'

import { sharingInformationService } from 'services/sharing-information'

const updateUserToFirestore = (props) => {
    const user = auth.currentUser || {}
    const _firestore = firestore

    const { firestoreUserID, userRol, userEditInfo } = props

    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const userProResToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersProResRef, userID), updateInfo, { merge: true })
    }

    const userComCalToFirestore = async (updateInfo, userID) => {
        await setDoc(doc(usersComCalRef, userID), updateInfo, { merge: true })
    }

    const userToFirestore = async () => {
        try {
            if (userRol === 1) {
                const snap = userProResToFirestore(
                    userEditInfo,
                    firestoreUserID
                )
                snap.then((docSnap) => {
                    // handleAlert(
                    //     'Se actualizó correctamente su información!',
                    //     'success'
                    // )
                    console.log(docSnap)
                })
            } else if (userRol === 2) {
                const snap = userComCalToFirestore(
                    userEditInfo,
                    firestoreUserID
                )
                snap.then((docSnap) => {
                    // handleAlert(
                    //     'Se actualizó correctamente su información!',
                    //     'success'
                    // )
                    console.log(docSnap)
                })
            }
            sendInfo()
        } catch (err) {
            console.log('Error getting user: ', err)
        }
    }

    // Firebase Auth
    const sendInfo = () => {
        const profile = {
            displayName: userEditInfo.userName,
            phoneNumber: userEditInfo.userPhone,
            photoURL: userEditInfo.userPhotoUrl,
        }
        if (user !== null) {
            // console.log(auth)
            updateProfile(user, profile)
                .then((result) => {
                    console.log(`Se actualizo el perfil de usuario ${result}`)
                })
                .catch((error) => {
                    console.log(
                        `Se produjo un error al actualizar el perfil de usuario ${error}`
                    )
                })
        }
    }

    userToFirestore().then((data) => {
        if (data) {
            const res = data.data()
            sharingInformationService.setSubject(res)
        }
    })
}

export default updateUserToFirestore
