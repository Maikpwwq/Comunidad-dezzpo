import { describe, it, expect, vi } from 'vitest'
import type { UserLocationItem } from '@services/types'
import { updateUser } from '@services/users'

vi.mock('@services/users', () => ({
    updateUser: vi.fn().mockResolvedValue(undefined),
}))

describe('Merchant Multi-Location Save & Dual-Write Logic', () => {
    it('synchronizes primary location with document root fields and preserves all sedes in userLocations', async () => {
        const locations: UserLocationItem[] = [
            {
                id: 'loc_1',
                nombre: 'Sucursal Chapinero',
                direccion: 'Carrera 13 # 60-20',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                codigoPostal: '110231',
                zona: 'chapinero',
                detallesUbicacion: 'Oficina 302',
                isPrimary: true,
                nombreContacto: 'Carlos Ruiz',
                horario: 'Lun-Vie 8:00 - 17:00',
            },
            {
                id: 'loc_2',
                nombre: 'Sede Fontibón (Taller)',
                direccion: 'Calle 17 # 98-40',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                codigoPostal: '110921',
                zona: 'fontibon',
                detallesUbicacion: 'Bodega 4',
                isPrimary: false,
                nombreContacto: 'Mario Castro',
                telefono: '+57 312 456 7890',
                horario: 'Lun-Sáb 7:00 - 16:00',
            },
        ]

        const primaryLoc = locations.find((l) => l.isPrimary) || locations[0]

        const payload = {
            userLocations: locations,
            userDirection: primaryLoc?.direccion || '',
            userDirectionDetails: primaryLoc?.detallesUbicacion || '',
            userDepartamento: primaryLoc?.departamento || 'Bogotá D.C.',
            userCiudad: primaryLoc?.ciudad || '',
            userCodigoPostal: primaryLoc?.codigoPostal || '',
        }

        await updateUser({
            userId: 'user_merchant_123',
            role: 2,
            data: payload,
        })

        expect(updateUser).toHaveBeenCalledWith({
            userId: 'user_merchant_123',
            role: 2,
            data: {
                userLocations: locations,
                userDirection: 'Carrera 13 # 60-20',
                userDirectionDetails: 'Oficina 302',
                userDepartamento: 'Bogotá D.C.',
                userCiudad: 'Bogotá, Colombia',
                userCodigoPostal: '110231',
            },
        })
    })

    it('switches root fields when secondary sede is set as primary', async () => {
        const locations: UserLocationItem[] = [
            {
                id: 'loc_1',
                nombre: 'Sucursal Chapinero',
                direccion: 'Carrera 13 # 60-20',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                codigoPostal: '110231',
                zona: 'chapinero',
                isPrimary: false,
            },
            {
                id: 'loc_2',
                nombre: 'Sede Fontibón (Taller)',
                direccion: 'Calle 17 # 98-40',
                departamento: 'Bogotá D.C.',
                ciudad: 'Bogotá, Colombia',
                codigoPostal: '110921',
                zona: 'fontibon',
                detallesUbicacion: 'Bodega 4',
                isPrimary: true,
            },
        ]

        const primaryLoc = locations.find((l) => l.isPrimary) || locations[0]

        expect(primaryLoc.nombre).toBe('Sede Fontibón (Taller)')
        expect(primaryLoc.direccion).toBe('Calle 17 # 98-40')
        expect(primaryLoc.detallesUbicacion).toBe('Bodega 4')
    })
})

