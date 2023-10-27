// /pages/index.page.route.js

// Parameters available at:
//  - `pageContext.routeParams.paramCategoriaProfesional`
//  - `pageContext.routeParams.paramTipoProyecto`
// export default '/nuevo-proyecto/@paramTipoProyecto/@paramCategoriaProfesional'

// Parameters available at:
//  - `pageContext.routeParams['*']`
// export default '/nuevo-proyecto/*'

import { resolveRoute } from 'vike/routing'

export default (pageContext) => {
    {
        const result = resolveRoute(
            '/nuevo-proyecto/@TipoProyecto/@CategoriaProfesional',
            pageContext.urlPathname
        )
        if (result.match) {
            return result
        }
    }

    const result = resolveRoute('/nuevo-proyecto/', pageContext.urlPathname)
    return result
}
