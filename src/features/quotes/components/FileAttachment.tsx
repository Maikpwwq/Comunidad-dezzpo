/**
 * FileAttachment Component
 *
 * File/image upload component for profiles and quotes.
 * Consolidates to the canonical AdjuntarArchivos component to prevent duplicate logic.
 */

import React from 'react'
import { AdjuntarArchivos } from '@components/common/AdjuntarArchivos'

export interface FileAttachmentState {
    userPhotoUrl?: string | string[]
    userCoverUrl?: string
    userGalleryUrl?: string[]
    [key: string]: unknown
}

export interface FileAttachmentProps {
    /** Input name identifier */
    name: 'profilePhoto' | 'galleryPhoto' | 'coverPhoto' | string
    /** Allow multiple file selection */
    multiple: boolean
    /** User/person ID */
    idPerson: string
    /** User role (1=PropietarioResidente, 2=ComercianteCalificado) */
    rol: 1 | 2
    /** Storage route path */
    route: string
    /** State update function */
    functionState: (state: any) => void
    /** Current state */
    state: any
    variant?: 'icon' | 'button'
    buttonText?: string
    tooltipTitle?: string
}

export function FileAttachment(props: FileAttachmentProps): React.ReactElement {
    return <AdjuntarArchivos {...props} />
}

export default FileAttachment
