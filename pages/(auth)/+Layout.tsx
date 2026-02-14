import React, { useEffect } from 'react'
import { navigate } from 'vike/client/router'
import { useIsAuthenticated } from '@stores/userStore'
import { MenuComunidad } from '@features/marketing'
import SliderAction from '@components/common/SliderAction'
import Footer from '@components/layout/Footer'

export function Layout({ children }: { children: React.ReactNode }) {
    const isAuth = useIsAuthenticated()

    useEffect(() => {
        if (isAuth) {
            navigate('/app/portal-servicios')
        }
    }, [isAuth])

    return (
        <>
            <MenuComunidad />
            <SliderAction />
            <main>
                {children}
            </main>
            <Footer />
        </>
    )
}
