import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from '#@/firebase/firebaseClient'
import PropTypes from 'prop-types'

import { sharingInformationService } from '#@/services/sharing-information'

export { doSearchFromFirestore }

const doSearchFromFirestore = (props) => {
    const _firestore = firestore
    const { searchInput } = props
    console.log('doSearchFromFirestore', searchInput)

    // const usersProResRef = collection(_firestore, 'usersPropietariosResidentes')
    const usersComCalRef = collection(
        _firestore,
        'usersComerciantesCalificados'
    )

    const searchFromFirestore = async () => {
        try {
            // TODO: Refactor this query to search in categories from users profiles
            let response = []
            const queryRef = query(
                usersComCalRef,
                where('userCategories', 'array-contains-any', [searchInput])
            )
            const searchUsers = await getDocs(queryRef)
            searchUsers.forEach((DOC) => {
                response.push(DOC.data())
            })
            return response
        } catch (err) {
            console.log(
                'Error al obtener los datos de busqueda en la colleccion Comerciantes Calificados: ',
                err
            )
        }
    }

    searchFromFirestore().then((data) => {
        if (data) {
            console.log('searchFromFirestore', data)
            // const search = data?.docs.map((element) => ({
            //     ...element.data(),
            // }))
            // console.log('searchFromFirestore', search)
            // if (search) {}
            sharingInformationService.setSubject({ search: data })
        } else {
            console.log(
                'No se encontro información sobre esta collección de usuarios!'
            )
        }
    })
}

doSearchFromFirestore.propTypes = {
    searchInput: PropTypes.string.isRequired,
}
