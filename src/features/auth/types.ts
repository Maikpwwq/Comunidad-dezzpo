/**
 * Auth Feature Types
 *
 * Shared types for authentication feature.
 */

import type { User, ConfirmationResult } from 'firebase/auth'
import type { ContactPhone } from '@services/types'

/** User role types */
export type UserRoleNumeric = 1 | 2 | null  // 1 = Propietario, 2 = Comerciante
export type UserRoleString = 'guest' | 'propietario' | 'comerciante'

/** Auth method selection */
export type AuthMethod = 'phone' | 'email'

/** Alert state for auth forms */
export interface AlertState {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
}

/** Login form data (email) */
export interface LoginFormData {
    email: string
    password: string
    role: UserRoleNumeric
}

/** Registration form data (email) */
export interface RegisterFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
    role: UserRoleNumeric
}

/** Phone auth SMS request result */
export interface PhoneSMSRequestResult {
    success: boolean
    confirmationResult?: ConfirmationResult
    error?: string
}

/** Phone registration form data */
export interface PhoneRegisterFormData {
    name: string
    phoneNumber: string
    role: UserRoleNumeric
}

/** Phone login form data */
export interface PhoneLoginFormData {
    phoneNumber: string
    role: UserRoleNumeric
}

/** Auth action result */
export interface AuthResult {
    success: boolean
    user?: User
    error?: string
}

/** Draft info for context (optional flow) */
export interface DraftInfo {
    draftId: string
    draftPropietarioResidente?: string
}

/** Firestore user document structure */
export interface UserFirestoreData {
    userMail: string | null
    userPhone?: string | undefined
    phones?: ContactPhone[] | undefined
    userJoined: string
    userId: string
    userChannelUrl: string
    userCreatedDrafts: string[]
    userName: string | null
    userContactName?: string | undefined
}

/** Auth form shared props */
export interface AuthFormProps {
    showLogo?: boolean | undefined
    draftInfo?: DraftInfo | undefined
    setDraftInfo?: ((info: DraftInfo) => void) | undefined
    handleSave?: (() => void) | undefined
    onSuccess?: ((user: User, role: UserRoleNumeric) => void) | undefined
}

/** Role selection props */
export interface RoleSelectionProps {
    onSelect: (role: UserRoleNumeric) => void
    selectedRole?: UserRoleNumeric | undefined
}

/** Google button props */
export interface GoogleAuthButtonProps {
    onClick: () => void
    label?: string | undefined
}

