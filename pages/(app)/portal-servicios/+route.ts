import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
    // Check for specific search input route first
    const resultWithSearch = resolveRoute('/app/portal-servicios/@searchInput', pageContext.urlPathname)
    if (resultWithSearch.match) {
        return resultWithSearch
    }

    // Fallback to base route
    const resultDefault = resolveRoute('/app/portal-servicios', pageContext.urlPathname)
    return resultDefault
}
