import React, { useState, useEffect } from 'react'
import { navigate } from 'vite-plugin-ssr/client/router'
import { firestore, auth } from '../../../firebase/firebaseClient'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
// import CardMedia from '@mui/material/CardMedia'
// import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
// import MoreVertIcon from '@mui/icons-material/MoreVert'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import { styled } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'

// const ExpandMore = styled((props) => {
//     const { expand, ...other } = props
//     return <IconButton {...other} />
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
// }))

export { DraftCard }

function DraftCard({ props }) {
    console.log('DraftCard', props)
    const user = auth?.currentUser || {}
    const userID = user?.uid || '' // Este es el id de la cuenta de Auth
    const {
        draftId,
        draftPropietarioResidente,
        draftName,
        draftDescription,
        // draftRooms,
        // draftPlans,
        // draftPermissions,
        // draftProperty,
        // draftPostalCode,
        draftTotal,
        // draftProject,
        draftCategory,
        // draftSubCategory,
        draftCreated,
        // draftPriority,
        // draftCity,
        // draftDirection,
        // draftSize,
        // draftAtachments,
        // draftBestScheduleDate,
        // draftBestScheduleTime,
        draftApply,
    } = props
    // console.log(props)
    const [expanded] = useState(false) // , setExpanded

    let selectRole
    useEffect(() => {
        // Perform localStorage action
        const localRole = localStorage.getItem('role')
        selectRole = parseInt(JSON.parse(localRole))
    }, [])

    const [userRol, setUserRol] = useState({
        rol: selectRole ? selectRole : 2,
    })

    // const handleExpandClick = () => {
    //     setExpanded(!expanded)
    // }
    const handleVerRequerimiento = () => {
        console.log(draftId)
        navigate(`/app/ver-requerimiento/${draftId}`)
    }
    const handleAplicar = () => {
        navigate(`/app/cotizacion/${draftId}`)
    }
    const handleEditar = () => {
        navigate(`/app/editar-requerimiento/${draftId}`)
    }
    const handleFavorite = () => {}
    const handleShare = () => {}

    return (
        <>
            <Card
                className="card-draft d-flex pt-2 pb-2 mb-4"
                elevation={16}
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box
                        className="w-100"
                        sx={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <CardHeader
                            className="align-items-start"
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
                                <Typography
                                    variant="caption"
                                    display="block"
                                    gutterBottom
                                    color="text.secondary"
                                >
                                    Publicado hace {draftCreated}
                                </Typography>
                            }
                            title={draftPropietarioResidente}
                            // subheader={}
                        ></CardHeader>
                        <CardContent sx={{ textAlign: 'left' }} className="p-2">
                            <Typography variant="h6">{draftName}</Typography>
                            <Typography variant="subtitle1">
                                {draftCategory}
                            </Typography>
                            <Typography variant="body1">
                                $ {draftTotal}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {draftDescription}
                            </Typography>
                        </CardContent>
                        <CardActions
                            className="d-flex p-0 pt-2 m-2 mt-0"
                            sx={{
                                borderTop: 'solid 1.5px',
                            }}
                            disableSpacing
                        >
                            <Button
                                className="body-1"
                                onClick={handleVerRequerimiento}
                            >
                                Ver requerimiento
                            </Button>

                            {/* TODO: mostrar solo al propietario que crea el requerimiento */}
                            {userRol.rol === 1 &&
                            draftPropietarioResidente === userID ? (
                                <Button
                                    style={{ paddingRight: '10px' }}
                                    className="body-1 w-auto"
                                    // variant="primary"
                                    onClick={handleEditar}
                                >
                                    Editar
                                </Button>
                            ) : (
                                <>
                                    {userRol.rol === 2 &&
                                        draftApply.length < 4 && (
                                            <Button
                                                className="btn-round btn-high body-1 w-auto"
                                                onClick={handleAplicar}
                                            >
                                                Aplicar
                                            </Button>
                                        )}
                                </>
                            )}
                            <IconButton
                                style={{ marginLeft: 'auto' }}
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

                            {/* <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore> */}
                        </CardActions>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            More...
                            {/* <Typography paragraph>
                                Tipo propiedad: {draftProperty}
                            </Typography>
                            <Typography paragraph>
                                Ubicación: {draftCity}, {draftDirection}
                                CodigoPostal: {draftPostalCode}
                            </Typography>
                            <Typography paragraph>
                                Programar mejor: {draftBestScheduleDate},
                                {draftBestScheduleTime}
                            </Typography>
                            <Typography paragraph>
                                Requiere planos: {draftPlans}
                            </Typography>
                            <Typography paragraph>
                                Requiere Permisos: {draftPermissions}
                            </Typography> */}
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
