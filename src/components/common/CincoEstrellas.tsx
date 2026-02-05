import React, { useState } from 'react'
import { Row } from 'react-bootstrap'
import { Rating } from '@mui/material'

export const CincoEstrellas: React.FC = () => {
    const [value] = useState<number | null>(4.5)

    return (
        <Row className="p-2">
            <Rating name="read-only" value={value} precision={0.5} readOnly />
        </Row>
    )
}
