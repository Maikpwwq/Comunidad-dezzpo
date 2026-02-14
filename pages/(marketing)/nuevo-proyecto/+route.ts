import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
    return resolveRoute('/nuevo-proyecto', pageContext.urlPathname)
}
