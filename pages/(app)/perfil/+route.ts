import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
    const { urlPathname } = pageContext

    // 1. Try vanity URL: /app/perfil/@username
    const vanityMatch = urlPathname.match(/^\/app\/perfil\/@(.+)$/)
    if (vanityMatch) {
        return {
            match: true,
            routeParams: { username: decodeURIComponent(vanityMatch[1]!) },
            precedence: 10,
        }
    }

    // 2. Try to match with ID: /app/perfil/:id
    const resultWithId = resolveRoute('/app/perfil/@id', urlPathname)
    if (resultWithId.match) {
        return resultWithId
    }

    // 3. Fallback to own profile (no ID)
    const resultDefault = resolveRoute('/app/perfil', urlPathname)
    // @ts-ignore
    resultDefault.precedence = -1
    return resultDefault
}
