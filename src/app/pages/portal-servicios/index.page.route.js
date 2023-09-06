// /pages/index.page.route.js

// Parameters available at:
//  - `pageContext.routeParams.id`
// export default '/app/portal-servicios/@searchInput'

// Parameters available at:
//  - `pageContext.routeParams['*']`
// export default '/app/portal-servicios/*'
import { resolveRoute } from 'vite-plugin-ssr/routing'

export default (pageContext) => {
    {
        const result = resolveRoute(
            '/app/portal-servicios/@searchInput',
            pageContext.urlPathname
        )
        if (result.match) {
            return result
        }
    }

    const result = resolveRoute(
        '/app/portal-servicios/',
        pageContext.urlPathname
    )
    return result
}
