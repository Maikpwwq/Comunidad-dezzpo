import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest'
import {
    initializeTestEnvironment,
    assertFails,
    assertSucceeds,
    type RulesTestEnvironment
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

describe('Firestore Security Rules Isolation & Privacy (Rules Unit Testing)', () => {
    let testEnv: RulesTestEnvironment

    beforeAll(async () => {
        const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8')
        testEnv = await initializeTestEnvironment({
            projectId: 'comunidad-dezzpo-rules-test',
            firestore: {
                rules,
                host: '127.0.0.1',
                port: 8080,
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
            await testEnv.clearFirestore()
        }
    })

    // =========================================================================
    // 1. Quotations — isolation between merchants and client access
    // =========================================================================
    describe('Quotations Collection (/quotations)', () => {
        it('prevents a merchant from reading another merchant\'s quote', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'quotations', 'quote-101'), {
                    comercianteId: 'merchant-A',
                    clientId: 'client-X',
                    amount: 500000,
                    status: 'pending',
                })
            })

            // Merchant B attempts to read Merchant A's quote -> MUST FAIL
            const merchantB = testEnv.authenticatedContext('merchant-B').firestore()
            await assertFails(getDoc(doc(merchantB, 'quotations', 'quote-101')))

            // Merchant A reads own quote -> MUST SUCCEED
            const merchantA = testEnv.authenticatedContext('merchant-A').firestore()
            await assertSucceeds(getDoc(doc(merchantA, 'quotations', 'quote-101')))

            // Client X (recipient) reads the quote -> MUST SUCCEED
            const clientX = testEnv.authenticatedContext('client-X').firestore()
            await assertSucceeds(getDoc(doc(clientX, 'quotations', 'quote-101')))
        })

        it('prevents unauthenticated users from reading quotations', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'quotations', 'quote-anon'), {
                    comercianteId: 'merchant-A',
                    clientId: 'client-X',
                    amount: 100000,
                    status: 'pending',
                })
            })

            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertFails(getDoc(doc(unauth, 'quotations', 'quote-anon')))
        })

        it('enforces comercianteId === auth.uid on create', async () => {
            // Merchant tries to create a quotation as someone else -> MUST FAIL
            const merchantA = testEnv.authenticatedContext('merchant-A').firestore()
            await assertFails(
                setDoc(doc(merchantA, 'quotations', 'spoof-quote'), {
                    comercianteId: 'merchant-B', // spoofing another merchant
                    clientId: 'client-X',
                    amount: 999,
                })
            )

            // Merchant creates own quotation -> MUST SUCCEED
            await assertSucceeds(
                setDoc(doc(merchantA, 'quotations', 'real-quote'), {
                    comercianteId: 'merchant-A',
                    clientId: 'client-X',
                    amount: 999,
                })
            )
        })

        it('prevents deletion of quotations', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'quotations', 'quote-del'), {
                    comercianteId: 'merchant-A',
                    clientId: 'client-X',
                    amount: 500000,
                })
            })

            const merchantA = testEnv.authenticatedContext('merchant-A').firestore()
            await assertFails(deleteDoc(doc(merchantA, 'quotations', 'quote-del')))
        })
    })

    // =========================================================================
    // 2. Contracts — client, provider, admin scoping
    // =========================================================================
    describe('Contracts Collection (/contracts)', () => {
        it('restricts contract read to client, provider, or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'contracts', 'contract-202'), {
                    clientId: 'client-owner',
                    providerId: 'merchant-provider',
                    agreedAmount: 1200000,
                    status: 'active',
                })
            })

            // Third party -> MUST FAIL
            const intruder = testEnv.authenticatedContext('intruder-user').firestore()
            await assertFails(getDoc(doc(intruder, 'contracts', 'contract-202')))

            // Client owner -> MUST SUCCEED
            const client = testEnv.authenticatedContext('client-owner').firestore()
            await assertSucceeds(getDoc(doc(client, 'contracts', 'contract-202')))

            // Provider -> MUST SUCCEED
            const provider = testEnv.authenticatedContext('merchant-provider').firestore()
            await assertSucceeds(getDoc(doc(provider, 'contracts', 'contract-202')))

            // Admin -> MUST SUCCEED
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(getDoc(doc(admin, 'contracts', 'contract-202')))
        })

        it('prevents deletion of contracts (immutable audit trail)', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'contracts', 'contract-nodelete'), {
                    clientId: 'client-owner',
                    providerId: 'merchant-provider',
                    status: 'completed',
                })
            })

            const client = testEnv.authenticatedContext('client-owner').firestore()
            await assertFails(deleteDoc(doc(client, 'contracts', 'contract-nodelete')))

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertFails(deleteDoc(doc(admin, 'contracts', 'contract-nodelete')))
        })
    })

    // =========================================================================
    // 3. User Profiles — public read, owner/admin write
    // =========================================================================
    describe('User Profiles (/usersPropietariosResidentes & /usersComerciantesCalificados)', () => {
        it('allows public read but restricts updates to owner or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'usersComerciantesCalificados', 'comerciante-1'), {
                    userName: 'Carlos Pérez',
                    userClasification: 'Persona Natural',
                })
            })

            // Unauthenticated reads profile -> MUST SUCCEED
            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertSucceeds(getDoc(doc(unauth, 'usersComerciantesCalificados', 'comerciante-1')))

            // Another user attempts to modify -> MUST FAIL
            const otherUser = testEnv.authenticatedContext('other-user').firestore()
            await assertFails(
                updateDoc(doc(otherUser, 'usersComerciantesCalificados', 'comerciante-1'), {
                    userName: 'Hacked Name',
                })
            )

            // Owner modifies own profile -> MUST SUCCEED
            const owner = testEnv.authenticatedContext('comerciante-1').firestore()
            await assertSucceeds(
                updateDoc(doc(owner, 'usersComerciantesCalificados', 'comerciante-1'), {
                    userName: 'Carlos Pérez Remodelaciones',
                })
            )

            // Admin updates user profile -> MUST SUCCEED
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(
                updateDoc(doc(admin, 'usersComerciantesCalificados', 'comerciante-1'), {
                    userClasification: 'Empresa',
                })
            )
        })

        it('prevents profile deletion', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'usersPropietariosResidentes', 'prop-1'), {
                    userName: 'Ana López',
                })
            })

            const owner = testEnv.authenticatedContext('prop-1').firestore()
            await assertFails(deleteDoc(doc(owner, 'usersPropietariosResidentes', 'prop-1')))
        })

        it('restricts user create to matching UID only', async () => {
            // User tries to create profile for another UID -> MUST FAIL
            const userA = testEnv.authenticatedContext('user-A').firestore()
            await assertFails(
                setDoc(doc(userA, 'usersPropietariosResidentes', 'user-B'), {
                    userName: 'Spoofed',
                })
            )

            // User creates own profile -> MUST SUCCEED
            await assertSucceeds(
                setDoc(doc(userA, 'usersPropietariosResidentes', 'user-A'), {
                    userName: 'Real User',
                })
            )
        })
    })

    // =========================================================================
    // 4. User Subcollections — inmuebles & paymentMethods
    // =========================================================================
    describe('User Subcollections (/inmuebles, /paymentMethods)', () => {
        it('restricts inmuebles subcollection to owner or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'usersPropietariosResidentes', 'prop-1'), { userName: 'Ana' })
                await setDoc(doc(db, 'usersPropietariosResidentes', 'prop-1', 'inmuebles', 'apt-1'), {
                    nombre: 'Mi Apartamento',
                    direccion: 'Calle 100',
                    isPreferida: true,
                })
            })

            // Other user -> MUST FAIL
            const otherUser = testEnv.authenticatedContext('other-user').firestore()
            await assertFails(
                getDoc(doc(otherUser, 'usersPropietariosResidentes', 'prop-1', 'inmuebles', 'apt-1'))
            )

            // Owner -> MUST SUCCEED
            const owner = testEnv.authenticatedContext('prop-1').firestore()
            await assertSucceeds(
                getDoc(doc(owner, 'usersPropietariosResidentes', 'prop-1', 'inmuebles', 'apt-1'))
            )

            // Admin -> MUST SUCCEED
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(
                getDoc(doc(admin, 'usersPropietariosResidentes', 'prop-1', 'inmuebles', 'apt-1'))
            )
        })

        it('restricts paymentMethods subcollection to owner or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'usersComerciantesCalificados', 'merchant-1'), { userName: 'Carlos' })
                await setDoc(doc(db, 'usersComerciantesCalificados', 'merchant-1', 'paymentMethods', 'card-1'), {
                    type: 'credit_card',
                    lastFour: '4242',
                })
            })

            // Other user -> MUST FAIL
            const otherUser = testEnv.authenticatedContext('other-user').firestore()
            await assertFails(
                getDoc(doc(otherUser, 'usersComerciantesCalificados', 'merchant-1', 'paymentMethods', 'card-1'))
            )

            // Owner -> MUST SUCCEED
            const owner = testEnv.authenticatedContext('merchant-1').firestore()
            await assertSucceeds(
                getDoc(doc(owner, 'usersComerciantesCalificados', 'merchant-1', 'paymentMethods', 'card-1'))
            )
        })
    })

    // =========================================================================
    // 5. Certification & Inspection Requests — owner or admin only
    // =========================================================================
    describe('Certification Requests (/certificationRequests)', () => {
        it('restricts read to merchant owner or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'certificationRequests', 'cert-req-1'), {
                    comercianteId: 'comerciante-777',
                    skillCategory: 'Electricidad',
                    status: 'pending',
                })
            })

            const otherUser = testEnv.authenticatedContext('other-user').firestore()
            await assertFails(getDoc(doc(otherUser, 'certificationRequests', 'cert-req-1')))

            const owner = testEnv.authenticatedContext('comerciante-777').firestore()
            await assertSucceeds(getDoc(doc(owner, 'certificationRequests', 'cert-req-1')))

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(getDoc(doc(admin, 'certificationRequests', 'cert-req-1')))
        })

        it('prevents spoofing comercianteId on create', async () => {
            const userA = testEnv.authenticatedContext('user-A').firestore()
            await assertFails(
                setDoc(doc(userA, 'certificationRequests', 'fake-cert'), {
                    comercianteId: 'someone-else',
                    skillCategory: 'Plomería',
                    status: 'pending',
                })
            )
        })
    })

    describe('Inspection Requests (/inspectionRequests)', () => {
        it('restricts read to propietario owner or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'inspectionRequests', 'insp-1'), {
                    propietarioId: 'prop-owner',
                    propertyAddress: 'Calle 80 #12-34',
                    status: 'scheduled',
                })
            })

            const otherUser = testEnv.authenticatedContext('other-user').firestore()
            await assertFails(getDoc(doc(otherUser, 'inspectionRequests', 'insp-1')))

            const owner = testEnv.authenticatedContext('prop-owner').firestore()
            await assertSucceeds(getDoc(doc(owner, 'inspectionRequests', 'insp-1')))
        })
    })

    // =========================================================================
    // 6. Referrals & Redemptions — participant or admin
    // =========================================================================
    describe('Referrals (/referrals)', () => {
        it('allows read only for referrer, referred user, or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'referrals', 'ref-1'), {
                    referrerId: 'referrer-user',
                    referredUserId: 'referred-user',
                    points: 50,
                    status: 'registered',
                })
            })

            // Unrelated user -> MUST FAIL
            const stranger = testEnv.authenticatedContext('stranger').firestore()
            await assertFails(getDoc(doc(stranger, 'referrals', 'ref-1')))

            // Referrer -> MUST SUCCEED
            const referrer = testEnv.authenticatedContext('referrer-user').firestore()
            await assertSucceeds(getDoc(doc(referrer, 'referrals', 'ref-1')))

            // Referred user -> MUST SUCCEED
            const referred = testEnv.authenticatedContext('referred-user').firestore()
            await assertSucceeds(getDoc(doc(referred, 'referrals', 'ref-1')))
        })
    })

    describe('Referral Redemptions (/referralRedemptions)', () => {
        it('restricts read to redemption owner or admin', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'referralRedemptions', 'redemption-1'), {
                    userId: 'user-redeemer',
                    rewardId: 'reward-1',
                    couponCode: 'DEZZPO-ABC',
                    status: 'active',
                })
            })

            const stranger = testEnv.authenticatedContext('stranger').firestore()
            await assertFails(getDoc(doc(stranger, 'referralRedemptions', 'redemption-1')))

            const owner = testEnv.authenticatedContext('user-redeemer').firestore()
            await assertSucceeds(getDoc(doc(owner, 'referralRedemptions', 'redemption-1')))
        })

        it('restricts update to admin only (not even owner)', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'referralRedemptions', 'redemption-upd'), {
                    userId: 'user-redeemer',
                    rewardId: 'reward-1',
                    status: 'active',
                })
            })

            // Owner tries to update status -> MUST FAIL (only admin can update)
            const owner = testEnv.authenticatedContext('user-redeemer').firestore()
            await assertFails(
                updateDoc(doc(owner, 'referralRedemptions', 'redemption-upd'), { status: 'used' })
            )

            // Admin updates -> MUST SUCCEED
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(
                updateDoc(doc(admin, 'referralRedemptions', 'redemption-upd'), { status: 'used' })
            )
        })
    })

    // =========================================================================
    // 7. Notifications — recipient, broadcast, or admin
    // =========================================================================
    describe('Notifications (/notifications)', () => {
        it('allows read for targeted recipient or broadcast (ALL)', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'notifications', 'notif-personal'), {
                    recipientId: 'target-user',
                    title: 'Personal Notification',
                    read: false,
                })
                await setDoc(doc(db, 'notifications', 'notif-broadcast'), {
                    recipientId: 'ALL',
                    title: 'Platform Announcement',
                    read: false,
                })
            })

            // Target user reads own notification -> MUST SUCCEED
            const targetUser = testEnv.authenticatedContext('target-user').firestore()
            await assertSucceeds(getDoc(doc(targetUser, 'notifications', 'notif-personal')))

            // Any authenticated user reads broadcast -> MUST SUCCEED
            const anyUser = testEnv.authenticatedContext('random-user').firestore()
            await assertSucceeds(getDoc(doc(anyUser, 'notifications', 'notif-broadcast')))

            // Random user reads someone else's personal notification -> MUST FAIL
            await assertFails(getDoc(doc(anyUser, 'notifications', 'notif-personal')))
        })

        it('restricts write operations to admin only', async () => {
            const regularUser = testEnv.authenticatedContext('regular-user').firestore()
            await assertFails(
                setDoc(doc(regularUser, 'notifications', 'fake-notif'), {
                    recipientId: 'ALL',
                    title: 'Spam',
                })
            )

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(
                setDoc(doc(admin, 'notifications', 'real-notif'), {
                    recipientId: 'ALL',
                    title: 'Platform Update',
                })
            )
        })
    })

    // =========================================================================
    // 8. Drafts — marketplace listing: auth read, owner + draftApply write
    // =========================================================================
    describe('Drafts (/drafts)', () => {
        it('allows any authenticated user to read drafts (marketplace)', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'drafts', 'draft-1'), {
                    draftPropietarioResidente: 'prop-1',
                    draftName: 'Remodelación Cocina',
                    draftCategory: 'Cocina',
                })
            })

            const anyUser = testEnv.authenticatedContext('any-user').firestore()
            await assertSucceeds(getDoc(doc(anyUser, 'drafts', 'draft-1')))

            // Unauthenticated -> MUST FAIL
            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertFails(getDoc(doc(unauth, 'drafts', 'draft-1')))
        })

        it('prevents deletion of drafts', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'drafts', 'draft-del'), {
                    draftPropietarioResidente: 'prop-1',
                    draftName: 'Test',
                })
            })

            const owner = testEnv.authenticatedContext('prop-1').firestore()
            await assertFails(deleteDoc(doc(owner, 'drafts', 'draft-del')))
        })
    })

    // =========================================================================
    // 9. Subscriptions — public create, admin read
    // =========================================================================
    describe('Subscriptions (/subscriptions)', () => {
        it('allows public email subscription creation', async () => {
            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertSucceeds(
                setDoc(doc(unauth, 'subscriptions', 'sub-1'), {
                    email: 'visitor@example.com',
                })
            )
        })

        it('restricts read to admin only', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'subscriptions', 'sub-read'), {
                    email: 'test@example.com',
                })
            })

            // Regular user -> MUST FAIL
            const regularUser = testEnv.authenticatedContext('regular-user').firestore()
            await assertFails(getDoc(doc(regularUser, 'subscriptions', 'sub-read')))

            // Admin -> MUST SUCCEED
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(getDoc(doc(admin, 'subscriptions', 'sub-read')))
        })
    })

    // =========================================================================
    // 10. Blog Posts — public read, admin write
    // =========================================================================
    describe('Blog Posts (/blog_posts)', () => {
        it('allows public read of blog posts', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'blog_posts', 'post-1'), {
                    title: 'Tendencias en Remodelación 2026',
                    slug: 'tendencias-remodelacion-2026',
                    status: 'published',
                })
            })

            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertSucceeds(getDoc(doc(unauth, 'blog_posts', 'post-1')))
        })

        it('restricts blog write to admin only', async () => {
            const regularUser = testEnv.authenticatedContext('regular-user').firestore()
            await assertFails(
                setDoc(doc(regularUser, 'blog_posts', 'hack-post'), {
                    title: 'Unauthorized Post',
                })
            )

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(
                setDoc(doc(admin, 'blog_posts', 'admin-post'), {
                    title: 'Official Dezzpo Blog Post',
                    status: 'draft',
                })
            )
        })
    })

    // =========================================================================
    // 11. Asesorias — authenticated CRUD
    // =========================================================================
    describe('Asesorias (/asesorias)', () => {
        it('allows any authenticated user to read and create', async () => {
            const user = testEnv.authenticatedContext('user-asesoria').firestore()
            await assertSucceeds(
                setDoc(doc(user, 'asesorias', 'asesoria-1'), {
                    pregunta: '¿Cuánto cuesta remodelar un baño?',
                    userId: 'user-asesoria',
                })
            )
            await assertSucceeds(getDoc(doc(user, 'asesorias', 'asesoria-1')))
        })

        it('prevents unauthenticated access', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'asesorias', 'asesoria-priv'), {
                    pregunta: 'Test question',
                })
            })

            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertFails(getDoc(doc(unauth, 'asesorias', 'asesoria-priv')))
        })

        it('prevents deletion of asesorias', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'asesorias', 'asesoria-del'), {
                    pregunta: 'Test',
                })
            })

            const user = testEnv.authenticatedContext('user-1').firestore()
            await assertFails(deleteDoc(doc(user, 'asesorias', 'asesoria-del')))
        })
    })

    // =========================================================================
    // 12. Funnel Events — public create, admin read
    // =========================================================================
    describe('Funnel Events (/funnel_events)', () => {
        it('allows public create for analytics tracking', async () => {
            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertSucceeds(
                setDoc(doc(unauth, 'funnel_events', 'event-1'), {
                    event: 'page_view',
                    page: '/portal-servicios',
                    timestamp: Date.now(),
                })
            )
        })

        it('restricts read to admin only', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'funnel_events', 'event-read'), {
                    event: 'signup',
                })
            })

            const regularUser = testEnv.authenticatedContext('regular-user').firestore()
            await assertFails(getDoc(doc(regularUser, 'funnel_events', 'event-read')))

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(getDoc(doc(admin, 'funnel_events', 'event-read')))
        })
    })

    // =========================================================================
    // 13. Categorias de Servicios — public read, admin write
    // =========================================================================
    describe('Categorias de Servicios (/categoriasServicios)', () => {
        it('allows public read of service categories', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'categoriasServicios', 'electricidad'), {
                    nombre: 'Electricidad',
                    costoPromedio: 350000,
                })
            })

            const unauth = testEnv.unauthenticatedContext().firestore()
            await assertSucceeds(getDoc(doc(unauth, 'categoriasServicios', 'electricidad')))
        })

        it('restricts write to admin only', async () => {
            const regularUser = testEnv.authenticatedContext('regular-user').firestore()
            await assertFails(
                setDoc(doc(regularUser, 'categoriasServicios', 'hack-cat'), {
                    nombre: 'Injected Category',
                })
            )

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertSucceeds(
                setDoc(doc(admin, 'categoriasServicios', 'plomeria'), {
                    nombre: 'Plomería',
                    costoPromedio: 280000,
                })
            )
        })
    })

    // =========================================================================
    // 14. Suggested Categories (/suggestedCategories)
    // =========================================================================
    describe('Suggested Categories (/suggestedCategories)', () => {
        it('allows authenticated user to create own category suggestion', async () => {
            const user1 = testEnv.authenticatedContext('user-1').firestore()
            await assertSucceeds(
                setDoc(doc(user1, 'suggestedCategories', 'sug-1'), {
                    userId: 'user-1',
                    userName: 'User One',
                    suggestedName: 'Paneles Solares',
                    status: 'pending',
                    createdAt: '2026-08-18T20:00:00Z',
                })
            )
        })

        it('denies user from creating suggestion on behalf of another user', async () => {
            const user1 = testEnv.authenticatedContext('user-1').firestore()
            await assertFails(
                setDoc(doc(user1, 'suggestedCategories', 'sug-2'), {
                    userId: 'user-2',
                    userName: 'Impersonated User',
                    suggestedName: 'Cerrajería Digital',
                    status: 'pending',
                })
            )
        })

        it('allows author and admin to read, denies other users', async () => {
            await testEnv.withSecurityRulesDisabled(async (context) => {
                const db = context.firestore()
                await setDoc(doc(db, 'suggestedCategories', 'sug-author'), {
                    userId: 'user-author',
                    suggestedName: 'Domótica Avanzada',
                    status: 'pending',
                })
            })

            const author = testEnv.authenticatedContext('user-author').firestore()
            const otherUser = testEnv.authenticatedContext('other-user').firestore()
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()

            await assertSucceeds(getDoc(doc(author, 'suggestedCategories', 'sug-author')))
            await assertFails(getDoc(doc(otherUser, 'suggestedCategories', 'sug-author')))
            await assertSucceeds(getDoc(doc(admin, 'suggestedCategories', 'sug-author')))
        })
    })

    // =========================================================================
    // 15. Social Interception Logs (/socialInterceptionLogs)
    // =========================================================================
    describe('Social Interception Logs Collection (/socialInterceptionLogs)', () => {
        it('allows admin to read and write telemetry logs, denies regular users', async () => {
            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            const regularUser = testEnv.authenticatedContext('regular-user').firestore()

            // Admin write -> MUST SUCCEED
            await assertSucceeds(
                setDoc(doc(admin, 'socialInterceptionLogs', 'log-101'), {
                    postId: 'fb_post_1',
                    authorName: 'Carlos',
                    intent: 'DEMAND',
                    detectedTrade: 'plomero',
                    status: 'dispatched',
                    timestamp: Date.now(),
                })
            )

            // Admin read -> MUST SUCCEED
            await assertSucceeds(getDoc(doc(admin, 'socialInterceptionLogs', 'log-101')))

            // Regular user read & write -> MUST FAIL
            await assertFails(getDoc(doc(regularUser, 'socialInterceptionLogs', 'log-101')))
            await assertFails(
                setDoc(doc(regularUser, 'socialInterceptionLogs', 'log-102'), {
                    postId: 'fb_post_2',
                    status: 'dispatched',
                })
            )
        })
    })

    // =========================================================================
    // 16. Catch-all — deny everything else
    // =========================================================================
    describe('Catch-all Deny Rule', () => {
        it('denies read/write to undefined collections', async () => {
            const authed = testEnv.authenticatedContext('user-1').firestore()
            await assertFails(getDoc(doc(authed, 'secretCollection', 'doc-1')))
            await assertFails(
                setDoc(doc(authed, 'anotherUnknown', 'doc-1'), { data: 'test' })
            )

            const admin = testEnv.authenticatedContext('admin-user', { admin: true }).firestore()
            await assertFails(getDoc(doc(admin, 'unmappedCollection', 'doc-1')))
        })
    })
})
