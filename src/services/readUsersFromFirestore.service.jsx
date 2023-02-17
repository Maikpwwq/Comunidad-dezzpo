import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase/firebaseClient'
import PropTypes from 'prop-types'

import { sharingInformationService } from '@/services/sharing-information'

const readUsersFromFirestore = (props) => {
    const _firestore = firestore
    const { userSelectedRol } = props
    console.log('readUsersFromFirestore', userSelectedRol)

    const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const usersFromFirestore = async () => {
        try {
            if (userSelectedRol === 1) {
                const userData = await getDocs(usersProResRef)
                return userData
            } else if (userSelectedRol === 2) {
                const userData = await getDocs(usersComCalRef)
                return userData
            }
        } catch (err) {
            console.log(
                'Error al obtener los datos de la colleccion de usuarios: ',
                err
            )
        }
    }

    usersFromFirestore().then((data) => {
        if (data) {
            const consult = data.docs.map((element) => ({
                ...element.data(),
            }))
            sharingInformationService.setSubject(consult)
        } else {
            console.log(
                'No se encontro información sobre esta collección de usuarios!'
            )
        }
    })
}

readUsersFromFirestore.propTypes = {
    userSelectedRol: PropTypes.number.isRequired,
}

export default readUsersFromFirestore
