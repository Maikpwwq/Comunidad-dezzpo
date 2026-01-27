import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) => {
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
