import React from 'react'
import { Container, Alert } from '@mui/material'
import { useUserStore } from '@stores/userStore'
import { InmueblesList } from '@features/inmuebles'

export default function MisInmueblesPage() {
    const rol = useUserStore((state) => state.rol)

    // Role check: Only Propietario (rol === 1) is allowed access
    if (rol !== null && rol !== 1) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    El módulo de Mis Inmuebles está disponible exclusivamente para cuentas con rol Propietario.
                </Alert>
            </Container>
        )
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <InmueblesList />
        </Container>
    )
}
