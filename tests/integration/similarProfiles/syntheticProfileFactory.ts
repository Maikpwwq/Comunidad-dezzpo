/**
 * Synthetic Merchant Profile Factory for Scaled Testing
 *
 * Generates >= 1,000 synthetic merchant profiles with:
 * - Dense categories (Plomería, Pintura, Albañilería) and sparse categories (Ascensores, Estudios de suelos)
 * - Varied zones across Bogotá localities and national municipalities
 * - Varied operational structures and states (active, suspended, hidden, deleted)
 * - Missing fields and deliberately injected private fields (emails, phones, fcmTokens, etc.)
 */

export interface RawMerchantDoc {
    readonly id: string
    readonly userName?: string | undefined
    readonly userRazonSocial?: string | undefined
    readonly userContactName?: string | undefined
    readonly userProfession?: string | undefined
    readonly userDescription?: string | undefined
    readonly userExperience?: string | undefined
    readonly userPhotoUrl?: string | undefined
    readonly userJoined?: string | undefined
    readonly userCategories?: string[] | undefined
    readonly userClasification?: string | undefined
    readonly userCiudad?: string | undefined
    readonly userDirection?: string | undefined
    readonly userDepartamento?: string | undefined
    readonly userCodigoPostal?: string | undefined
    readonly userZonasCobertura?: string[] | undefined
    readonly coberturaTodaLaCiudad?: boolean | undefined
    readonly userGrade?: string | undefined
    readonly profileTier?: 'free' | 'destacado' | undefined
    readonly isAvailableNow?: boolean | undefined
    readonly lastActive?: string | undefined
    readonly trustScore?: number | undefined
    readonly earnedBadges?: Array<{ category: string; issuedAt: string }> | undefined
    readonly favoritesCount?: number | undefined
    readonly status?: string | undefined
    readonly isDeleted?: boolean | undefined
    readonly userSelectedRol?: number | undefined
    // ⚠️ SENSITIVE / PRIVATE FIELDS (must never leak into public output per Invariant I6)
    readonly userMail?: string | undefined
    readonly userPhone?: string | undefined
    readonly emails?: Array<{ address: string; isPrimary: boolean }> | undefined
    readonly phones?: Array<{ number: string; isPrimary: boolean }> | undefined
    readonly fcmTokens?: string[] | undefined
    readonly userIdentification?: string | undefined
    readonly internalNotes?: string | undefined
    readonly privateBillingAddress?: string | undefined
}

const DENSE_CATEGORIES = ['Plomería', 'Pintura', 'Albañilería', 'Red electrica', 'Carpintería']
const SPARSE_CATEGORIES = ['Ascensores', 'Estudios de suelos', 'Domótica']
const ALL_CATEGORIES = [...DENSE_CATEGORIES, ...SPARSE_CATEGORIES, 'Cerrajería', 'Impermeabilización']

const ZONES = ['suba', 'chapinero', 'usaquen', 'kennedy', 'engativa', 'chia', 'soacha', 'medellin', 'cali']
const STRUCTURES = ['persona natural', 'micro empresa', 'pyme de servicios', 'empresa']

export function generateSyntheticProfiles(count = 1000): RawMerchantDoc[] {
    const profiles: RawMerchantDoc[] = []

    for (let i = 1; i <= count; i++) {
        const id = `synthetic_merchant_${i}`
        const isSparse = i % 50 === 0
        const categories = isSparse
            ? [SPARSE_CATEGORIES[i % SPARSE_CATEGORIES.length]!]
            : [
                  DENSE_CATEGORIES[i % DENSE_CATEGORIES.length]!,
                  ...(i % 3 === 0 ? [ALL_CATEGORIES[(i + 1) % ALL_CATEGORIES.length]!] : []),
              ]

        const isSuspended = i % 25 === 0
        const isHidden = i % 35 === 0
        const isDeleted = i % 50 === 0
        const status = isSuspended ? 'suspended' : isHidden ? 'hidden' : 'active'

        const zone = ZONES[i % ZONES.length]!
        const structure = STRUCTURES[i % STRUCTURES.length]!

        profiles.push({
            id,
            userName: i % 10 === 0 ? undefined : `Profesional Técnico ${i}`,
            userRazonSocial: `Comercializadora ${i} S.A.S.`,
            userContactName: `Contacto ${i}`,
            userProfession: `Técnico en ${categories[0]}`,
            userDescription: i % 8 === 0 ? '' : `Servicios profesionales de ${categories[0]} con calidad certificada.`,
            userExperience: `${(i % 15) + 1} años`,
            userPhotoUrl: i % 5 === 0 ? undefined : `https://storage.dezzpo.com/avatars/${id}.jpg`,
            userJoined: '15-01-2025',
            userCategories: categories,
            userClasification: structure,
            userCiudad: zone === 'medellin' ? 'Medellín' : zone === 'cali' ? 'Cali' : 'Bogotá',
            userDirection: `${zone}, Bogotá`,
            userDepartamento: zone === 'medellin' ? 'Antioquia' : zone === 'cali' ? 'Valle' : 'Cundinamarca',
            userCodigoPostal: `110${(i % 90) + 10}`,
            userZonasCobertura: [zone],
            coberturaTodaLaCiudad: i % 4 === 0,
            userGrade: i % 3 === 0 ? 'Verificado' : undefined,
            profileTier: i % 10 === 0 ? 'destacado' : 'free',
            isAvailableNow: i % 6 === 0,
            lastActive: new Date(Date.now() - (i % 60) * 24 * 60 * 60 * 1000).toISOString(),
            trustScore: (i % 60) + 40,
            earnedBadges: i % 7 === 0 ? [{ category: categories[0]!, issuedAt: '2026-01-01' }] : undefined,
            favoritesCount: i % 20,
            status,
            isDeleted,
            userSelectedRol: i % 100 === 99 ? 1 : 2, // 1% accidental non-merchant roles

            // ⚠️ Deliberate private payload injection to verify Invariant I6 leakage prevention
            userMail: `privado_${i}@email-secreto.com`,
            userPhone: `300123${(i % 9000) + 1000}`,
            emails: [{ address: `contacto_${i}@dezzpo-interno.com`, isPrimary: true }],
            phones: [{ number: `+57310000${(i % 9000) + 1000}`, isPrimary: true }],
            fcmTokens: [`fcm_token_device_secret_${i}`],
            userIdentification: `1024${i}789`,
            internalNotes: `Nota de auditoría interna confidencial #${i}`,
            privateBillingAddress: `Carrera ${i} # ${i * 2} - 15 Oficina 301`,
        })
    }

    return profiles
}
