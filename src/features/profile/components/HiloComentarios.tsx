/**
 * HiloComentarios Component
 *
 * Comment thread display for profile pages.
 * Migrated from src/app/components/HiloComentarios.jsx
 *
 * Note: Original was just a JSX fragment. This is a proper component.
 */

import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Typography } from '@mui/material'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export interface CommentThread {
    id: string
    title: string
    authorName: string
    createdAt: Date | string
    content: string
}

export interface HiloComentariosProps {
    /** Thread data to display */
    thread?: CommentThread
    /** Title of the thread */
    title?: string
}

export function HiloComentarios({
    thread,
    title = 'Hilo de conversación',
}: HiloComentariosProps): React.ReactElement {
    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date
        return format(d, "dd/MM/yyyy 'a las' HH:mm", { locale: es })
    }

    if (!thread) {
        return (
            <Row className="m-0 w-100 d-flex pt-3">
                <Col md={10}>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        No hay comentarios aún
                    </Typography>
                </Col>
            </Row>
        )
    }

    return (
        <Row className="m-0 w-100 d-flex pt-3">
            <Col md={10}>
                <Typography variant="h6">{thread.title || title}</Typography>
                <div>
                    <Typography variant="body1" className="body-1">
                        Publicado el {formatDate(thread.createdAt)}, por @{thread.authorName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {thread.content}
                    </Typography>
                </div>
            </Col>
        </Row>
    )
}

export default HiloComentarios
