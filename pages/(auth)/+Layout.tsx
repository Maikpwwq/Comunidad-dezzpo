import React from 'react'
import { MenuComunidad } from '@features/marketing'
import SliderAction from '@components/common/SliderAction'
import Footer from '@components/layout/Footer'

export function Layout({ children }: { children: React.ReactNode }) {
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
