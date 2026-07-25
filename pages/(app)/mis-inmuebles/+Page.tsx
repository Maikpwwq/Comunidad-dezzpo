import React from 'react'
import { Container, Alert, Typography, Box } from '@mui/material'
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
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    La dirección e información de tus inmuebles se trata de conformidad con nuestro{' '}
                    <a
                        href="/legal?doc=aviso-privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}
                    >
                        Aviso de Privacidad
                    </a>{' '}
                    y la{' '}
                    <a
                        href="/legal?doc=politica-tratamiento-datos"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}
                    >
                        Política de Tratamiento de Datos Personales
                    </a>.
                </Typography>
            </Box>
        </Container>
    )
}

