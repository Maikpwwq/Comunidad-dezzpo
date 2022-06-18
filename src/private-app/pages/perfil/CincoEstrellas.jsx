import React from 'react'

import Row from 'react-bootstrap/Row'
import Icon from '@mui/material/Icon'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import StarHalfIcon from '@mui/icons-material/StarHalf'

const CincoEstrellas = (props) => {
    return (
        <>
            <Row className="p-2">
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
                </Icon>
                <Icon fontSize="medium" className="p-0">
                    <StarIcon
                        sx={{
                            verticalAlign: 'baseline',
                            color: '#ffca2d',
                        }}
                    />
                </Icon>
            </Row>
        </>
    )
}

export default CincoEstrellas
