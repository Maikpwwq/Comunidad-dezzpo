// /pages/index.page.route.js

// Parameters available at:
//  - `pageContext.routeParams.id`
// export default '/app/ajustes/@id'

// Parameters available at:
//  - `pageContext.routeParams['*']`
// export default '/app/ajustes/*'

import { resolveRoute } from 'vike/routing'

export default (pageContext) => {
    {
        const result = resolveRoute('/app/ajustes/@id', pageContext.urlPathname)
        if (result.match) {
            return result
        }
    }

    const result = resolveRoute('/app/ajustes/', pageContext.urlPathname)
    result.precedence = -1
    return result
}
