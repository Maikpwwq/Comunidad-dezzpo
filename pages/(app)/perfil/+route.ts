import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
    // Try to match with ID first
    const resultWithId = resolveRoute('/app/perfil/@id', pageContext.urlPathname)
    if (resultWithId.match) {
        return resultWithId
    }

    // Fallback to own profile (no ID)
    // We use a lower precedence so it doesn't shadow specific sub-routes if any (though currently none)
    const resultDefault = resolveRoute('/app/perfil', pageContext.urlPathname)
    // @ts-ignore
    resultDefault.precedence = -1
    return resultDefault
}
