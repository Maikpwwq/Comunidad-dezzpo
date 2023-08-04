// /pages/index.page.route.js

// Parameters available at:
//  - `pageContext.routeParams.id`
// export default '/app/perfil/@id'

// Parameters available at:
//  - `pageContext.routeParams['*']`
// export default '/app/perfil/*'

export default (pageContext) => {
    if (!pageContext.urlPathname.startsWith('/app/perfil/')) return false

    // Route guard
    // if (!pageContext.user.isAdmin) {
    //     return false
    // }

    const id = pageContext.urlPathname.split('/')[3]
    console.log( 'routeParams', id)

    return {
      precedence: 99,
      // Make `id` available as pageContext.routeParams.id
      routeParams: { id }
    }
  }