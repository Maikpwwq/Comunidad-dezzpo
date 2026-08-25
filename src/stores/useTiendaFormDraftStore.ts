import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { SedeLocation } from '@services/tiendas'

/** Shape of the draft data persisted to sessionStorage */
/** A single primary contact entry (phone + optional WhatsApp) */
export interface ContactoPrincipal {
    telefono: string
    whatsapp: string
}

export interface TiendaFormDraft {
    nombre: string
    razonSocial: string
    nit: string
    descripcion: string
    emails: string[]
    sitioWeb: string
    /** @deprecated Kept for backwards compat with existing sessionStorage drafts */
    telefonoPrincipal: string
    /** @deprecated Kept for backwards compat with existing sessionStorage drafts */
    whatsappPrincipal: string
    /** New multi-number support */
    telefonosPrincipales: ContactoPrincipal[]
    selectedCategoryKeys: string[]
    sedes: SedeLocation[]
}

const EMPTY_SEDE: SedeLocation = {
    id: 'sede_1',
    nombreSede: 'Sucursal Principal',
    direccion: '',
    departamento: 'Bogotá D.C.',
    ciudad: 'Bogotá, Colombia',
    codigoPostal: '',
    zona: 'bogota',
    hasCustomPhones: false,
    telefonos: [''],
    whatsapp: '',
    horario: 'Lun-Vie 8:00 - 17:00',
}

const EMPTY_CONTACTO: ContactoPrincipal = { telefono: '', whatsapp: '' }

const INITIAL_DRAFT: TiendaFormDraft = {
    nombre: '',
    razonSocial: '',
    nit: '',
    descripcion: '',
    emails: [''],
    sitioWeb: '',
    telefonoPrincipal: '',
    whatsappPrincipal: '',
    telefonosPrincipales: [EMPTY_CONTACTO],
    selectedCategoryKeys: [],
    sedes: [EMPTY_SEDE],
}

interface TiendaFormDraftState {
    draft: TiendaFormDraft
    hasDraft: boolean
    updateDraft: (partial: Partial<TiendaFormDraft>) => void
    clearDraft: () => void
}

export const useTiendaFormDraftStore = create<TiendaFormDraftState>()(
    persist(
        (set) => ({
            draft: INITIAL_DRAFT,
            hasDraft: false,

            updateDraft: (partial) =>
                set((state) => ({
                    draft: { ...state.draft, ...partial },
                    hasDraft: true,
                })),

            clearDraft: () =>
                set({
                    draft: INITIAL_DRAFT,
                    hasDraft: false,
                }),
        }),
        {
            name: 'dezzpo-tienda-form-draft',
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
)

export { INITIAL_DRAFT, EMPTY_SEDE, EMPTY_CONTACTO }
