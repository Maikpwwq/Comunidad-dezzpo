import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AdjuntarArchivos } from '@components/common/AdjuntarArchivos'
import * as firebaseServices from '@services/firebase'
import * as storageModule from 'firebase/storage'
import * as firestoreModule from 'firebase/firestore'

vi.mock('@services/firebase', () => ({
    storage: {},
    firestore: {},
    isFirebaseAvailable: vi.fn(() => true),
}))

vi.mock('firebase/storage', () => ({
    ref: vi.fn((_st, path) => ({ fullPath: path })),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
    collection: vi.fn((_db, name) => ({ id: name })),
    doc: vi.fn((_col, id) => ({ id })),
    setDoc: vi.fn(),
}))

describe('AdjuntarArchivos Component', () => {
    const mockFunctionState = vi.fn()
    const mockState = {
        userId: 'user-123',
        userName: 'Test User',
        userPhotoUrl: '',
        userCoverUrl: '',
        userGalleryUrl: [],
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders icon variant by default for profilePhoto', () => {
        const { container } = render(
            <AdjuntarArchivos
                name="profilePhoto"
                multiple={false}
                idPerson="user-123"
                rol={2}
                route="profiles/user-123"
                functionState={mockFunctionState}
                state={mockState}
            />
        )

        const input = container.querySelector('input[type="file"]')
        expect(input).not.toBeNull()
        expect(input?.id).toBe('icon-button-file-profilePhoto')
    })

    it('renders button variant with custom text and tooltip for coverPhoto', () => {
        render(
            <AdjuntarArchivos
                name="coverPhoto"
                multiple={false}
                idPerson="user-123"
                rol={2}
                route="profiles/user-123"
                functionState={mockFunctionState}
                state={mockState}
                variant="button"
                buttonText="+ Agregar imagen de portada"
                tooltipTitle="Recomendado: 1584 x 396 px (Aspect Ratio 4:1)"
            />
        )

        expect(screen.getByText('+ Agregar imagen de portada')).toBeInTheDocument()
    })

    it('successfully uploads coverPhoto and updates state with userCoverUrl', async () => {
        const mockFile = new File(['mock content'], 'test-cover.png', { type: 'image/png' })
        const fakeUrl = 'https://firebasestorage.googleapis.com/v0/b/test/portada-dezzpo-123.png'

        vi.mocked(storageModule.uploadBytes).mockResolvedValue({
            metadata: {
                bucket: 'test-bucket',
                fullPath: 'profiles/user-123/portada-dezzpo-123.png',
            },
        } as any)

        vi.mocked(storageModule.getDownloadURL).mockResolvedValue(fakeUrl)
        vi.mocked(firestoreModule.setDoc).mockResolvedValue(undefined as any)

        const { container } = render(
            <AdjuntarArchivos
                name="coverPhoto"
                multiple={false}
                idPerson="user-123"
                rol={2}
                route="profiles/user-123"
                functionState={mockFunctionState}
                state={mockState}
                variant="button"
                buttonText="Editar imagen de portada"
            />
        )

        const input = container.querySelector('input[type="file"]') as HTMLInputElement
        expect(input).not.toBeNull()

        fireEvent.change(input, { target: { files: [mockFile] } })

        await waitFor(() => {
            expect(storageModule.uploadBytes).toHaveBeenCalled()
            expect(mockFunctionState).toHaveBeenCalledWith(
                expect.objectContaining({
                    userCoverUrl: fakeUrl,
                })
            )
            expect(firestoreModule.setDoc).toHaveBeenCalledWith(
                expect.anything(),
                { userCoverUrl: fakeUrl },
                { merge: true }
            )
        })
    })

    it('rejects files larger than 10MB', async () => {
        // Create an oversized file (11MB)
        const bigFile = new File([''], 'big.jpg', { type: 'image/jpeg' })
        Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 })

        const { container } = render(
            <AdjuntarArchivos
                name="coverPhoto"
                multiple={false}
                idPerson="user-123"
                rol={2}
                route="profiles/user-123"
                functionState={mockFunctionState}
                state={mockState}
                variant="button"
            />
        )

        const input = container.querySelector('input[type="file"]') as HTMLInputElement
        fireEvent.change(input, { target: { files: [bigFile] } })

        await waitFor(() => {
            expect(screen.getByText(/El archivo no debe superar los 10 MB/i)).toBeInTheDocument()
            expect(storageModule.uploadBytes).not.toHaveBeenCalled()
        })
    })
})
