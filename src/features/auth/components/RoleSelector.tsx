/**
 * RoleSelector Component
 *
 * Shared role selection UI for auth forms.
 * Extracted from ingreso/registro pages.
 */

import React from 'react'

// Bootstrap
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Form from 'react-bootstrap/Form'

// Types
import type { UserRoleNumeric } from '../types'

import styles from './RoleSelector.module.scss'
import clsx from 'clsx'

interface RoleSelectorProps {
    onSelect: (role: UserRoleNumeric) => void
    selectedRole?: UserRoleNumeric
    className?: string
}

export function RoleSelector({ onSelect, selectedRole, className = '' }: RoleSelectorProps): React.ReactElement {
    const handleChange = (values: number | number[]) => {
        const value = Array.isArray(values) ? values[0] : values
        onSelect(value as UserRoleNumeric)
    }

    return (
        <>
            <Form.Label className="mb-0 pt-4 body-1">
                Primero, elige tu rol
            </Form.Label>
            <ToggleButtonGroup
                type="radio"
                name="userRol"
                className={`mb-5 mt-2 align-items-center ${className}`}
                vertical
                onChange={handleChange}
                value={selectedRole ?? undefined}
            >
                <ToggleButton
                    className={clsx(styles.RoleButton, "body-1 p-3 btn-round btn-high w-auto d-flex flex-row align-items-center justify-content-center")}
                    variant="light" // Use light base to avoid blue primary flash
                    value={1}
                    id="formBasicRolPropietarioInmobiliario"
                    aria-label="Soy propietario inmobiliario"
                >
                    Soy propietario inmobiliario
                </ToggleButton>
                <br className="mb-2 mt-2" />
                <ToggleButton
                    className={clsx(styles.RoleButton, "body-1 p-3 btn-round btn-middle w-auto d-flex flex-row align-items-center justify-content-center")}
                    variant="light"
                    value={2}
                    id="formBasicRolComercianteCalificado"
                    aria-label="Soy Comerciante Calificado"
                >
                    Soy comerciante calificado
                </ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}

export default RoleSelector
