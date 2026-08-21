/**
 * Auth Feature Index
 *
 * Public API for @features/auth
 *
 * @example
 * ```tsx
 * import { useAuthActions, RoleSelector, GoogleAuthButton } from '@features/auth'
 * ```
 */

// Hooks
export { useAuthActions } from './hooks'

// Components
export { RoleSelector, GoogleAuthButton, OrDivider, AuthMethodTabs, OTPCodeInput } from './components'

// Types
export type {
    AlertState,
    AuthMethod,
    LoginFormData,
    RegisterFormData,
    PhoneRegisterFormData,
    PhoneLoginFormData,
    PhoneSMSRequestResult,
    AuthResult,
    DraftInfo,
    UserFirestoreData,
    UserRoleNumeric,
    UserRoleString,
    AuthFormProps,
    RoleSelectionProps,
    GoogleAuthButtonProps,
} from './types'

