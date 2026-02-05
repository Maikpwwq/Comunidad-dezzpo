// Route definition for Directorio Requerimientos
import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
    return resolveRoute('/app/directorio-requerimientos', pageContext.urlPathname)
}
