/**
 * RatingStars Component
 *
 * Display star rating for user profiles.
 * Migrated from src/app/components/CincoEstrellas.jsx
 *
 * @example
 * ```tsx
 * <RatingStars value={4.5} />
 * <RatingStars value={3} readOnly={false} onChange={(val) => console.log(val)} />
 * ```
 */

import React from 'react'
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'

export interface RatingStarsProps {
    /** Rating value (0-5) */
    value?: number
    /** Whether the rating is read-only */
    readOnly?: boolean
    /** Callback when rating changes */
    onChange?: (value: number | null) => void
    /** Size of the stars */
    size?: 'small' | 'medium' | 'large'
    /** Additional className */
    className?: string
}

export function RatingStars({
    value = 0,
    readOnly = true,
    onChange,
    size = 'medium',
    className,
}: RatingStarsProps): React.ReactElement {
    const handleChange = (_event: React.SyntheticEvent, newValue: number | null) => {
        onChange?.(newValue)
    }

    return (
        <Box className={className} sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating
                name="rating-stars"
                value={value}
                readOnly={readOnly}
                onChange={handleChange}
                size={size}
                precision={0.5}
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: '#ffca2d',
                    },
                    '& .MuiRating-iconHover': {
                        color: '#ffb200',
                    },
                }}
            />
        </Box>
    )
}

export default RatingStars
