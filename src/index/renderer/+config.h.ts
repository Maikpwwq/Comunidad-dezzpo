// https://vike.dev/migration/v1-design
import type { Config } from 'vike/types'

// New way 
export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps', 'routeParams', 'redirectTo'],
  prefetchStaticAssets: 'viewport'
} satisfies Config