// /pages/index.page.route.js

// Parameters available at:
//  - `pageContext.routeParams.paramCategoriaProfesional`
//  - `pageContext.routeParams.paramTipoProyecto`
// export default '/nuevo-proyecto/@paramCategoriaProfesional/@paramTipoProyecto'

// Parameters available at:
//  - `pageContext.routeParams['*']`
// export default '/nuevo-proyecto/*'

import { resolveRoute } from 'vite-plugin-ssr/routing'

export default (pageContext) => {
    {
        const result = resolveRoute(
            '/nuevo-proyecto/@paramCategoriaProfesional/@paramTipoProyecto',
            pageContext.urlPathname
        )
        if (result.match) {
            return result
        }
    }

    const result = resolveRoute(
        '/nuevo-proyecto/',
        pageContext.urlPathname
    )
    return result
}