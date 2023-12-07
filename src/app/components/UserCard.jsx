import React, { useState, useContext } from 'react'
import { navigate } from 'vike/client/router'

import ChipsCategories from '#@/app/components/ChipsCategories'
import  { ListadoCategorias } from '#@/index/components/ListadoCategorias'
import { UserAuthContext } from '#@/providers/UserAuthProvider'

import updateUserToFirestore from '#@/services/updateUserToFirestore.service'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
// import Box from '@mui/material/Box'
// import CardMedia from '@mui/material/CardMedia'
// import MoreVertIcon from '@mui/icons-material/MoreVert'

// import { styled } from '@mui/material/styles'
// import Collapse from '@mui/material/Collapse'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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

function UserCard({ props }) {
    const { currentUser } = useContext(UserAuthContext)
    const userAuthID = currentUser?.userId

    const [chips, setChips] = useState([])
    const {
        userId,
        userRazonSocial,
        userDirection,
        userProfession,
        userPhotoUrl,
        userJoined,
        userExperience,
        userDescription,
        userCategories,
    } = props
    // const [expanded, setExpanded] = useState(false)

    // const handleExpandClick = () => {
    //     setExpanded(!expanded)
    // }
    const userLink = `/app/perfil/${userId}`

    const handleVerSitio = () => {
        navigate(userLink)
    }
    const handleCotizarVisitaTecnica = () => {
        // Todo redirect to pay transaction
        // navigate('/nuevo-proyecto')
    }
    const handleFavorite = () => {
        try {
            // TODO filter changes to profile select / unselect
            const firestoreUserID = userId
            const userSelectedRol = 2
            const userEditInfo = {
                userLikes: {
                    likedsProfiles: [userAuthID],
                },
            }
            console.log(
                'handleFavorite',
                firestoreUserID,
                userSelectedRol,
                userEditInfo
            )
            updateUserToFirestore({
                firestoreUserID,
                userSelectedRol,
                userEditInfo,
            })
        } catch (err) {
            console.error(err)
        }
    }

    const handleShare = async () => {
        try {
            const shareData = {
                title: userRazonSocial,
                text: userDescription,
                url: userLink,
            }
            if (navigator['share']) {
                await navigator['share'](shareData)
            } else {
                console.error("El navegador no es compatible con Web Share API");
            }
        } catch (err) {
            console.error(err)
        }
    }

    React.useEffect(() => {
        const chipsInfo = []
        if (userCategories && userCategories.length > 0) {
            userCategories.forEach((chip) => {
                // console.log(chip)
                ListadoCategorias.forEach((cat) => {
                    if (chip === cat.label) {
                        chipsInfo.push(cat)
                    }
                })
            })
            setChips(chipsInfo)
        }
    }, [userCategories])

    const bgAvatar = userPhotoUrl
        ? { bgcolor: 'var(--background-light-gray-color)' }
        : { bgcolor: 'var(--background-hover-green-color)' }

    return (
        <Card className="card-user mb-4" elevation={16}>
            {/* <CardMedia
                component="img"
                height="194"
                image="http://placeimg.com/260/194/arch"
                // src="http://placeimg.com/260/194/arch"
                alt="Paella dish"
            /> */}
            <CardHeader
                className="align-items-start"
                avatar={
                    <Avatar
                        src={userPhotoUrl}
                        sx={bgAvatar}
                        aria-label="recipe"
                    >
                        <Typography variant="body1" fontSize={'0.35rem'}>
                            Comunidad Dezzpo
                        </Typography>
                    </Avatar>
                }
                action={
                    <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                        color="text.secondary"
                    >
                        Se unió el <br />
                        {userJoined}
                    </Typography>
                    // <IconButton aria-label="settings">
                    //     <MoreVertIcon />
                    // </IconButton>
                }
                title={userRazonSocial}
                subheader={userProfession}
            ></CardHeader>
            <CardContent sx={{ textAlign: 'left' }} className="p-2">
                <Typography
                    variant="body1"
                    color="text.secondary"
                    style={{ overflowY: 'auto', maxHeight: 100 }}
                >
                    {userDescription}
                </Typography>
                {chips.length > 0 ? (
                    <ChipsCategories
                        listadoCategorias={chips}
                        editableContent={false}
                    />
                ) : (
                    <></>
                )}
                <br />
                {userExperience !== '' && userExperience !== undefined && (
                    <>
                        <Typography variant="body1" color="text.secondary">
                            Experiencia: {userExperience}
                        </Typography>
                    </>
                )}
                {userDirection !== '' && userDirection !== undefined && (
                    <>
                        <Typography variant="body1" color="text.secondary">
                            Ubicacion: {userDirection}
                        </Typography>
                    </>
                )}
            </CardContent>
            <CardActions
                className="d-flex p-0 pt-2 m-2 mt-0"
                sx={{
                    borderTop: 'solid 1.5px',
                }}
                disableSpacing
            >
                <Button className="body-1" onClick={handleVerSitio}>
                    Ver sitio
                </Button>
                {!!userAuthID && (
                    <>
                        <Button
                            style={{ paddingRight: '10px' }}
                            className="body-1 w-auto"
                            onClick={handleCotizarVisitaTecnica}
                        >
                            Cotizar Visita Técnica
                        </Button>

                        <IconButton
                            style={{ marginLeft: 'auto' }}
                            aria-label="add to favorites"
                            onClick={handleFavorite}
                        >
                            <FavoriteIcon />
                            {/* TODO: Contactar */}
                        </IconButton>
                    </>
                )}
                <IconButton aria-label="share" onClick={handleShare}>
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
            {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add
                        saffron and set aside for 10 minutes.
                    </Typography>
                    <Typography paragraph>
                        Heat oil in a (14- to 16-inch) paella pan or a large,
                        deep skillet over medium-high heat. Add chicken, shrimp
                        and chorizo, and cook, stirring occasionally until
                        lightly browned, 6 to 8 minutes. Transfer shrimp to a
                        large plate and set aside, leaving chicken and chorizo
                        in the pan. Add pimentón, bay leaves, garlic, tomatoes,
                        onion, salt and pepper, and cook, stirring often until
                        thickened and fragrant, about 10 minutes. Add saffron
                        broth and remaining 4 1/2 cups chicken broth; bring to a
                        boil.
                    </Typography>
                    <Typography paragraph>
                        Add rice and stir very gently to distribute. Top with
                        artichokes and peppers, and cook without stirring, until
                        most of the liquid is absorbed, 15 to 18 minutes. Reduce
                        heat to medium-low, add reserved shrimp and mussels,
                        tucking them down into the rice, and cook again without
                        stirring, until mussels have opened and rice is just
                        tender, 5 to 7 minutes more. (Discard any mussels that
                        don’t open.)
                    </Typography>
                    <Typography>
                        Set aside off of the heat to let rest for 10 minutes,
                        and then serve.
                    </Typography>
                </CardContent>
            </Collapse> */}
        </Card>
    )
}

UserCard.propTypes = {
    props: PropTypes.any,
    userId: PropTypes.string,
    userRazonSocial: PropTypes.string,
    userDirection: PropTypes.string,
    userProfession: PropTypes.string,
    userPhotoUrl: PropTypes.string,
    userJoined: PropTypes.string,
    userExperience: PropTypes.string,
    userDescription: PropTypes.string,
    userCategories: PropTypes.object,
}

export default UserCard
