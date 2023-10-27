// /pages/index.page.route.js

// Parameters available at:
//  - `pageContext.routeParams.id`
// export default '/app/portal-servicios/@searchInput'

// Parameters available at:
//  - `pageContext.routeParams['*']`
// export default '/app/portal-servicios/*'
import { resolveRoute } from 'vike/routing'

export default async (pageContext) => {
    {
        const result = resolveRoute(
            '/app/portal-servicios/',
            pageContext.urlPathname
        )
        if (result.match) {
            return result
        }
    }

    const result = resolveRoute(
        '/app/portal-servicios/@searchInput',
        pageContext.urlPathname
    )
    return result
}
