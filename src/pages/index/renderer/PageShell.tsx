import React from 'react'
// import PropTypes from 'prop-types'
// import { childrenPropType } from './PropTypeValues'
import type { PageContext } from './types'
// import logo from './logo.svg'
// import './PageShell.css'
import { PageContextProvider } from './usePageContext'
// import { Link } from './Link'
import { LayoutPaperbase } from '#P/index/components/LayoutPaperbase'
// import createEmotionCache from './createEmotionCache';

import './App.scss'
import './index.scss'

export { PageShell }

// PageShell.propTypes = {
//     pageContext: PropTypes.any,
//     children: childrenPropType,
// }

function PageShell({
    children,
    pageContext,
}: {
    children: React.ReactNode
    pageContext: PageContext
}) {
    // const Layout = LayoutPaperbase || pageContext.exports.Layout
    //const cache = createEmotionCache();

    return (
        <React.StrictMode>
            {/* <CacheProvider value={cache}> */}
            <PageContextProvider pageContext={pageContext}>
                <LayoutPaperbase>{children}</LayoutPaperbase>
                {/* <Layout>
                  <Sidebar>
                    <Logo />
                    <Link className="navitem" href="/">
                      Home
                    </Link>
                    <Link className="navitem" href="/about">
                      About
                    </Link>
                  </Sidebar>
                  <Content>{children}</Content>
                </Layout> */}
            </PageContextProvider>
            {/* </CacheProvider> */}
        </React.StrictMode>
    )
}

// Layout.propTypes = {
//   children: childrenPropType
// }
// function Layout({ children }) {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         maxWidth: 900,
//         margin: 'auto'
//       }}
//     >
//       {children}
//     </div>
//   )
// }

// Sidebar.propTypes = {
//   children: childrenPropType
// }
// function Sidebar({ children }) {
//   return (
//     <div
//       style={{
//         padding: 20,
//         flexShrink: 0,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         lineHeight: '1.8em'
//       }}
//     >
//       {children}
//     </div>
//   )
// }

// Content.propTypes = {
//   children: childrenPropType
// }
// function Content({ children }) {
//   return (
//     <div
//       style={{
//         padding: 20,
//         paddingBottom: 50,
//         borderLeft: '2px solid #eee',
//         minHeight: '100vh'
//       }}
//     >
//       {children}
//     </div>
//   )
// }

// function Logo() {
//   return (
//     <div
//       style={{
//         marginTop: 20,
//         marginBottom: 10
//       }}
//     >
//       <a href="/">
//         <img src={logo} height={64} width={64} alt="logo" />
//       </a>
//     </div>
//   )
// }
