import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { styled } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const ExpandMore = styled((props) => {
    const { expand, ...other } = props
    return <IconButton {...other} />
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}))

export default function DraftCard({ props }) {
    const {
        draftName,
        draftDescription,
        draftRooms,
        draftPlans,
        draftPermissions,
        draftAtachments,
        draftBestSchedule,
        draftProperty,
        draftPostalCode,
    } = props
    const [expanded, setExpanded] = React.useState(false)

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }
    const handleVerSitio = () => {}
    const handleCotizar = () => {}
    const handleFavorite = () => {}
    const handleShare = () => {}

    return (
        <>
            <Card
                className="d-flex"
                // lg={6}
                // md={6}
                // sm={10}
                sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            >
                {/* maxWidth: 345, */}
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <CardMedia
                        component="img"
                        height="194"
                        image="http://placeimg.com/260/194/arch"
                        // src="http://placeimg.com/260/194/arch"
                        alt="Paella dish"
                        style={{ maxWidth: '345px' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/* TODO: Categorias*/}

                        <CardHeader
                            avatar={
                                <Avatar
                                    // src={userPhotoUrl}
                                    sx={{ bgcolor: red[500] }}
                                    aria-label="recipe"
                                >
                                    CD
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={draftName}
                            subheader={draftRooms}
                        ></CardHeader>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {draftDescription}
                            </Typography>
                            <br />
                        </CardContent>
                    </Box>
                    <CardActions className="d-flex flex-column" disableSpacing>
                        <Button className="" onClick={handleVerSitio}>
                            Ver sitio
                        </Button>
                        <Button className="" onClick={handleCotizar}>
                            Cotizar
                        </Button>
                        <IconButton
                            aria-label="add to favorites"
                            onClick={handleFavorite}
                        >
                            <FavoriteIcon />
                            {/* TODO: Contactar */}
                        </IconButton>
                        <IconButton aria-label="share" onClick={handleShare}>
                            <ShareIcon />
                        </IconButton>

                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                Tipo propiedad: {draftProperty}
                            </Typography>
                            <Typography paragraph>
                                CodigoPostal: {draftPostalCode}
                            </Typography>
                            <Typography paragraph>
                                Programar mejor: {draftBestSchedule}
                            </Typography>
                            <Typography paragraph>
                                Planos: {draftPlans}
                            </Typography>
                            <Typography paragraph>
                                Permisos: {draftPermissions}
                            </Typography>
                            <Typography paragraph>
                                Adjuntos: {draftAtachments}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Box>
            </Card>
        </>
    )
}

DraftCard.defaultProps = {
    props: {
        draftName: 'The App Name',
        draftDescription: 'The App Name',
        draftRooms: 'The App Name',
        draftPlans: 'The App Name',
        draftPermissions: 'The App Name',
        draftAtachments: 'The App Name',
        draftBestSchedule: 'The App Name',
        draftProperty: 'The App Name',
        draftPostalCode: 'The App Name',
    },
}
