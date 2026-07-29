import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

/**
 * Route guard for dynamic marketing service & zone landing pages (/@service/@zone).
 * Prevents route collision with app, admin, and system namespaces.
 */
export default (pageContext: PageContext) => {
    const { urlPathname } = pageContext

    // Exclude app, admin, api, auth, blog, and legal routes from dynamic service/zone matching
    if (
        urlPathname.startsWith('/app') ||
        urlPathname.startsWith('/admin') ||
        urlPathname.startsWith('/api') ||
        urlPathname.startsWith('/auth') ||
        urlPathname.startsWith('/blog') ||
        urlPathname.startsWith('/legal')
    ) {
        return false
    }

    return resolveRoute('/@service/@zone', urlPathname)
}
