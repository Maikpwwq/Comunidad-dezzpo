import { describe, it, expect, beforeEach } from 'vitest'
import fc from 'fast-check'
import { useUserStore } from '@stores/userStore'

describe('UserStore State Invariants & Atomic Actions', () => {
    beforeEach(() => {
        // Reset store before each test
        useUserStore.getState().clearUser()
    })

    it('starts with unauthenticated clean state', () => {
        const state = useUserStore.getState()
        expect(state.isAuth).toBe(false)
        expect(state.userId).toBeFalsy()
        expect(state.rol).toBeFalsy()
    })

    it('property: setting arbitrary user profile maintains atomic invariants', () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 5, maxLength: 40 }), // userId
                fc.string({ minLength: 3, maxLength: 30 }), // userName
                fc.emailAddress(), // email
                fc.constantFrom(1, 2), // role: 1 = Propietario, 2 = Comerciante
                (uid, name, email, role) => {
                    const store = useUserStore.getState()
                    
                    store.updateUser({
                        userId: uid,
                        userName: name,
                        userEmail: email,
                        isAuth: true,
                        rol: role,
                    } as any)

                    const updatedState = useUserStore.getState()
                    expect(updatedState.isAuth).toBe(true)
                    expect(updatedState.userId).toBe(uid)
                    expect(updatedState.rol).toBe(role)

                    // Reset and verify clean clearUser state invariant
                    updatedState.clearUser()
                    const loggedOutState = useUserStore.getState()
                    expect(loggedOutState.isAuth).toBe(false)
                    expect(loggedOutState.userId).toBeFalsy()
                }
            ),
            { numRuns: 200 }
        )
    })
})
