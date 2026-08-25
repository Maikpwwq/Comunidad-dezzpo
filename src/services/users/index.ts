/**
 * Users Service Index
 */

export {
    getUser,
    updateUser,
    setUser,
    getUsersByCategories,
    getUserByUsername,
    getUsers,
} from './userService'

export {
    findUserByPhone,
    getPhoneVariants,
    type FindUserByPhoneResult,
} from './findUserByPhone'

export {
    getProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    setPropertiesList
} from './propertiesService'

