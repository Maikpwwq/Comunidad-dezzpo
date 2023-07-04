export { CincoEstrellas }

import React, { useState } from 'react'

import Row from 'react-bootstrap/Row'
import Icon from '@mui/material/Icon'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'

const CincoEstrellas = (props) => {
    const [value, setValue] = useState(4.5)

    return (
        <>
            <Row className="p-2">
                {/* <Typography component="legend">Read only</Typography> */}
                <Rating name="read-only" value={value} readOnly />
                {/* <Icon fontSize="medium" className="p-0">
                    <StarIcon
                        sx={{
                            verticalAlign: 'baseline',
                            color: '#ffca2d',
                        }}
                    />
                </Icon>
                <Icon fontSize="medium" className="p-0">
                    <StarIcon
                        sx={{
                            verticalAlign: 'baseline',
                            color: '#ffca2d',
                        }}
                    />
                </Icon>
                <Icon fontSize="medium" className="p-0">
                    <StarIcon
                        sx={{
                            verticalAlign: 'baseline',
                            color: '#ffca2d',
                        }}
                    />
                </Icon>
                <Icon fontSize="medium" className="p-0">
                    <StarIcon
                        sx={{
                            verticalAlign: 'baseline',
                            color: '#ffca2d',
                        }}
                    />
                </Icon>
                <Icon fontSize="medium" className="p-0">
                    <StarIcon
                        sx={{
                            verticalAlign: 'baseline',
                            color: '#ffca2d',
                        }}
                    />
                </Icon> */}
            </Row>
        </>
    )
}
