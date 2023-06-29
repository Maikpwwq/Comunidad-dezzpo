import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
// const pages = import.meta.glob('./pages/*.jsx', { eager: true })

// const routes = Object.keys(pages).map((path) => {
//   const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1]
//   return {
//     name,
//     path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
//     component: pages[path].default,
//   }
// })

//Paginas
import App from './app/App'
import PrivateApp from './private-app/Private-App'

class Rutas extends React.Component {
    render() {
        return (
            <>
                {/* <nav>
                    <ul>
                        {routes.map(({ name, path }) => {
                            return (
                                <li key={path}>
                                    <Link to={path}>{name}</Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav> */}
                <Routes>
                    <Route path="/app/*" element={<PrivateApp />} />
                    <Route path="*" element={<App />} />
                    {/* {routes.map(({ path, component: RouteComp }) => {
                        return (
                            <Route
                                key={path}
                                path={path}
                                element={<RouteComp />}
                            ></Route>
                        )
                    })} */}
                </Routes>
            </>
        )
    }
}

export default Rutas
