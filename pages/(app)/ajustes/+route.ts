import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
    // Try to match with ID first
    const resultWithId = resolveRoute('/app/ajustes/@id', pageContext.urlPathname)
    if (resultWithId.match) {
        return resultWithId
    }

    // Fallback to own settings (no ID)
    const resultDefault = resolveRoute('/app/ajustes', pageContext.urlPathname)
    // @ts-ignore
    resultDefault.precedence = -1
    return resultDefault
}
