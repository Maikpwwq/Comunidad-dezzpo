// Route definition for Suscripciones
import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
    return resolveRoute('/app/suscripciones', pageContext.urlPathname)
}
