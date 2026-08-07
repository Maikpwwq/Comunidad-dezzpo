import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest'
import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
    type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

describe('Storage Security Rules Isolation & Privacy (Rules Unit Testing)', () => {
    let testEnv: RulesTestEnvironment

    // Create a small valid PNG file (1x1 pixel) for upload tests
    const TINY_PNG = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
        0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x62, 0x00, 0x00, 0x00, 0x02,
        0x00, 0x01, 0xe2, 0x21, 0xbc, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
        0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ])

    const TINY_PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46]) // %PDF header bytes

    beforeAll(async () => {
        const rules = readFileSync(resolve(process.cwd(), 'storage.rules'), 'utf8')
        testEnv = await initializeTestEnvironment({
            projectId: 'comunidad-dezzpo-storage-test',
            storage: {
                rules,
                host: '127.0.0.1',
                port: 9199,
            },
        })
    })

    afterAll(async () => {
        if (testEnv) {
            await testEnv.cleanup()
        }
    })

    beforeEach(async () => {
        if (testEnv) {
            await testEnv.clearStorage()
        }
    })

    // =========================================================================
    // 1. Public Site Assets — /site/** and /html/**
    // =========================================================================
    describe('Public Static Assets (/site, /html)', () => {
        it('allows unauthenticated read of site assets', async () => {
            // Seed a file via admin context
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const storage = context.storage()
                await uploadBytes(ref(storage, 'site/logos/dezzpo-logo.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            })

            // Unauthenticated user reads -> MUST SUCCEED
            const unauth = testEnv.unauthenticatedContext().storage()
            await assertSucceeds(getDownloadURL(ref(unauth, 'site/logos/dezzpo-logo.png')))
        })

        it('restricts site asset write to admin only', async () => {
            // Regular user tries to upload to /site/ -> MUST FAIL
            const regularUser = testEnv.authenticatedContext('regular-user').storage()
            await assertFails(
                uploadBytes(ref(regularUser, 'site/logos/hack.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            )

            // Admin uploads -> MUST SUCCEED
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).storage()
            await assertSucceeds(
                uploadBytes(ref(admin, 'site/logos/new-logo.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            )
        })

        it('allows unauthenticated read of html assets', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const storage = context.storage()
                await uploadBytes(ref(storage, 'html/hero-banner.jpg'), TINY_PNG, {
                    contentType: 'image/jpeg',
                })
            })

            const unauth = testEnv.unauthenticatedContext().storage()
            await assertSucceeds(getDownloadURL(ref(unauth, 'html/hero-banner.jpg')))
        })
    })

    // =========================================================================
    // 2. User Profile Images — /profiles/{userId}/**
    // =========================================================================
    describe('User Profile Images (/profiles/{userId}/**)', () => {
        it('allows public read of profile images', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const storage = context.storage()
                await uploadBytes(ref(storage, 'profiles/user-123/avatar.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            })

            // Unauthenticated user can see profile images -> MUST SUCCEED
            const unauth = testEnv.unauthenticatedContext().storage()
            await assertSucceeds(getDownloadURL(ref(unauth, 'profiles/user-123/avatar.png')))
        })

        it('allows owner to upload images to their own folder', async () => {
            const owner = testEnv.authenticatedContext('user-123').storage()
            await assertSucceeds(
                uploadBytes(ref(owner, 'profiles/user-123/avatar.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            )
        })

        it('prevents user from uploading to another user\'s profile folder', async () => {
            const intruder = testEnv.authenticatedContext('intruder').storage()
            await assertFails(
                uploadBytes(ref(intruder, 'profiles/victim-user/malicious.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            )
        })

        it('rejects non-image files in profile folders (content type validation)', async () => {
            const owner = testEnv.authenticatedContext('user-123').storage()
            // Upload a PDF to profile folder -> MUST FAIL (isImage() check)
            await assertFails(
                uploadBytes(ref(owner, 'profiles/user-123/document.pdf'), TINY_PDF, {
                    contentType: 'application/pdf',
                })
            )
        })

        it('allows admin to upload to any user profile folder', async () => {
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).storage()
            await assertSucceeds(
                uploadBytes(ref(admin, 'profiles/any-user-456/verified-badge.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            )
        })
    })

    // =========================================================================
    // 3. Verification Documents — /verifications/{userId}/**
    // =========================================================================
    describe('Verification Documents (/verifications/{userId}/**)', () => {
        it('restricts read to owner only', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const storage = context.storage()
                await uploadBytes(ref(storage, 'verifications/user-456/cedula-front.jpg'), TINY_PNG, {
                    contentType: 'image/jpeg',
                })
            })

            // Another user tries to read -> MUST FAIL
            const otherUser = testEnv.authenticatedContext('other-user').storage()
            await assertFails(getDownloadURL(ref(otherUser, 'verifications/user-456/cedula-front.jpg')))

            // Owner reads -> MUST SUCCEED
            const owner = testEnv.authenticatedContext('user-456').storage()
            await assertSucceeds(getDownloadURL(ref(owner, 'verifications/user-456/cedula-front.jpg')))

            // Admin reads -> MUST SUCCEED
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).storage()
            await assertSucceeds(getDownloadURL(ref(admin, 'verifications/user-456/cedula-front.jpg')))
        })

        it('prevents unauthenticated read of verification documents', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const storage = context.storage()
                await uploadBytes(ref(storage, 'verifications/user-789/id-scan.jpg'), TINY_PNG, {
                    contentType: 'image/jpeg',
                })
            })

            const unauth = testEnv.unauthenticatedContext().storage()
            await assertFails(getDownloadURL(ref(unauth, 'verifications/user-789/id-scan.jpg')))
        })

        it('allows owner to upload verification documents', async () => {
            const owner = testEnv.authenticatedContext('user-456').storage()
            await assertSucceeds(
                uploadBytes(ref(owner, 'verifications/user-456/rut.pdf'), TINY_PDF, {
                    contentType: 'application/pdf',
                })
            )
        })

        it('prevents user from uploading to another user\'s verification folder', async () => {
            const intruder = testEnv.authenticatedContext('intruder').storage()
            await assertFails(
                uploadBytes(ref(intruder, 'verifications/victim/fake-doc.pdf'), TINY_PDF, {
                    contentType: 'application/pdf',
                })
            )
        })
    })

    // =========================================================================
    // 4. Root-level static files — /{fileName}
    // =========================================================================
    describe('Root-level Static Files (/{fileName})', () => {
        it('allows public read of root marketing assets', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const storage = context.storage()
                await uploadBytes(ref(storage, 'hero-image.jpg'), TINY_PNG, {
                    contentType: 'image/jpeg',
                })
            })

            const unauth = testEnv.unauthenticatedContext().storage()
            await assertSucceeds(getDownloadURL(ref(unauth, 'hero-image.jpg')))
        })

        it('restricts root write to admin only', async () => {
            const regularUser = testEnv.authenticatedContext('regular-user').storage()
            await assertFails(
                uploadBytes(ref(regularUser, 'injected-asset.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            )

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).storage()
            await assertSucceeds(
                uploadBytes(ref(admin, 'new-banner.png'), TINY_PNG, {
                    contentType: 'image/png',
                })
            )
        })
    })

    // =========================================================================
    // 5. Catch-all — deny access to undefined paths
    // =========================================================================
    describe('Catch-all Deny Rule', () => {
        it('denies access to undefined storage paths', async () => {
            const authed = testEnv.authenticatedContext('user-1').storage()
            await assertFails(
                uploadBytes(ref(authed, 'secretFolder/subfolder/file.txt'), TINY_PDF, {
                    contentType: 'text/plain',
                })
            )
        })

        it('denies unauthenticated access to undefined paths', async () => {
            const unauth = testEnv.unauthenticatedContext().storage()
            await assertFails(getDownloadURL(ref(unauth, 'nonexistent/path/file.png')))
        })
    })
})
