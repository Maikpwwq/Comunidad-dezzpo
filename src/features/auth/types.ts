/**
 * Auth Feature Types
 *
 * Shared types for authentication feature.
 */

import type { User } from 'firebase/auth'

/** User role types */
export type UserRoleNumeric = 1 | 2 | null  // 1 = Propietario, 2 = Comerciante
export type UserRoleString = 'guest' | 'propietario' | 'comerciante'

/** Alert state for auth forms */
export interface AlertState {
    open: boolean
    message: string
    severity: 'success' | 'error' | 'warning' | 'info'
}

/** Login form data */
export interface LoginFormData {
    email: string
    password: string
    role: UserRoleNumeric
}

/** Registration form data */
export interface RegisterFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
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
    userJoined: string
    userId: string
    userChannelUrl: string
    userCreatedDrafts: string[]
    userName: string | null
}

/** Auth form shared props */
export interface AuthFormProps {
    showLogo?: boolean
    draftInfo?: DraftInfo
    setDraftInfo?: (info: DraftInfo) => void
    handleSave?: () => void
    onSuccess?: (user: User, role: UserRoleNumeric) => void
}

/** Role selection props */
export interface RoleSelectionProps {
    onSelect: (role: UserRoleNumeric) => void
    selectedRole?: UserRoleNumeric
}

/** Google button props */
export interface GoogleAuthButtonProps {
    onClick: () => void
    label?: string
}
