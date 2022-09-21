import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { firestore, auth } from '../../firebase/firebaseClient'
import PropTypes from 'prop-types'

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
    const user = auth.currentUser || {}
    const userID = user.uid || '' // Este es el id de la cuenta de Auth
    const navigate = useNavigate()
    const {
        draftId,
        draftPropietarioResidente,
        draftName,
        draftDescription,
        draftRooms,
        draftPlans,
        draftPermissions,
        draftProperty,
        draftPostalCode,
        draftTotal,
        draftProject,
        draftCategory,
        // draftSubCategory,
        draftCreated,
        draftPriority,
        draftCity,
        draftDirection,
        draftSize,
        // draftAtachments,
        draftBestScheduleDate,
        draftBestScheduleTime,
        draftApply,
    } = props
    console.log(props)
    const [expanded, setExpanded] = useState(false)

    const localRole = localStorage.getItem('role')
    const selectRole = parseInt(JSON.parse(localRole))
    const [userRol, setUserRol] = useState({
        rol: selectRole ? selectRole : 2,
    })

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }
    const handleVerRequerimiento = () => {
        console.log(draftId)
        navigate('/app/ver-requerimiento', { state: { draftId: draftId } })
    }
    const handleAplicar = () => {
        navigate('/app/cotizacion', {
            state: { draftId: draftId },
        })
    }
    const handleEditar = () => {
        navigate('/app/editar-requerimiento', {
            state: { draftId: draftId },
        })
    }
    const handleFavorite = () => {}
    const handleShare = () => {}

    return (
        <>
            <Card
                className="d-flex mb-2"
                // lg={6}
                // md={6}
                // sm={10}
                sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            >
                {/* maxWidth: 345, */}
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    {/* <CardMedia
                        component="img"
                        height="194"
                        image="http://placeimg.com/260/194/arch"
                        // src="http://placeimg.com/260/194/arch"
                        alt="Paella dish"
                        style={{ maxWidth: '345px' }}
                    /> */}
                    <Box
                        className="w-100"
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
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
                            action={draftCreated}
                            // action={
                            //     <IconButton aria-label="settings">
                            //         <MoreVertIcon />
                            //     </IconButton>
                            // }
                            title={(draftCategory, draftName)}
                            subheader={(draftProject, draftSize, draftRooms)}
                        ></CardHeader>
                        <CardContent>
                            <Typography variant="body1" color="text.secondary">
                                {draftDescription}
                            </Typography>
                            <br />
                            <Typography variant="body2" color="text.secondary">
                                Prioridad: {draftPriority}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Presupuesto: {draftTotal}
                            </Typography>
                        </CardContent>
                        <CardActions className="d-flex" disableSpacing>
                            <Button
                                className=""
                                onClick={handleVerRequerimiento}
                            >
                                Ver requerimiento
                            </Button>
                            {draftApply.length < 4 && (
                                <Button className="" onClick={handleAplicar}>
                                    Aplicar
                                </Button>
                            )}
                            {/* TODO: mostrar solo al propietario que crea el requerimiento */}
                            {userRol.rol === 1 &&
                            draftPropietarioResidente === userID ? (
                                <Button className="" onClick={handleEditar}>
                                    Editar
                                </Button>
                            ) : (
                                <></>
                            )}
                            <IconButton
                                aria-label="add to favorites"
                                onClick={handleFavorite}
                            >
                                <FavoriteIcon />
                                {/* TODO: Contactar */}
                            </IconButton>
                            <IconButton
                                aria-label="share"
                                onClick={handleShare}
                            >
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
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>
                                Tipo propiedad: {draftProperty}
                            </Typography>
                            <Typography paragraph>
                                Ubicación: {draftCity}, {draftDirection}
                                CodigoPostal: {draftPostalCode}
                            </Typography>
                            <Typography paragraph>
                                Programar mejor: {draftBestScheduleDate},{' '}
                                {draftBestScheduleTime}
                            </Typography>
                            <Typography paragraph>
                                Requiere planos: {draftPlans}
                            </Typography>
                            <Typography paragraph>
                                Requiere Permisos: {draftPermissions}
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Box>
            </Card>
        </>
    )
}

DraftCard.propTypes = {
    props: PropTypes.object.isRequired,
    draftId: PropTypes.string.isRequired,
    draftPropietarioResidente: PropTypes.string.isRequired,
    draftName: PropTypes.string.isRequired,
    draftDescription: PropTypes.string.isRequired,
    draftRooms: PropTypes.string.isRequired,
    draftPlans: PropTypes.string,
    draftPermissions: PropTypes.string,
    draftAtachments: PropTypes.any,
    draftBestSchedule: PropTypes.string.isRequired,
    draftProperty: PropTypes.string.isRequired,
    draftPostalCode: PropTypes.string.isRequired,
    draftApply: PropTypes.string,
    draftTotal: PropTypes.number.isRequired,
    draftProject: PropTypes.string.isRequired,
    draftCategory: PropTypes.string.isRequired,
    draftSubCategory: PropTypes.string.isRequired,
    draftCreated: PropTypes.string,
    draftPriority: PropTypes.string,
    draftCity: PropTypes.string.isRequired,
    draftDirection: PropTypes.string.isRequired,
    draftSize: PropTypes.string.isRequired,
    draftBestScheduleDate: PropTypes.string.isRequired,
    draftBestScheduleTime: PropTypes.string.isRequired,
}
