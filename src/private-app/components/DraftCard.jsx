import * as React from 'react'
import Box from '@mui/material/Box'
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
    // const [expanded, setExpanded] = React.useState(false)

    // const handleExpandClick = () => {
    //     setExpanded(!expanded)
    // }

    return (
        <Card
            className="d-flex w-50"
            // lg={6}
            // md={6}
            // sm={10}
            sx={{ width: '100%', display: 'flex', flexDirection: 'row' }}
        >
            {/* maxWidth: 345, */}
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
                    <Typography>
                        {draftProperty} - {draftPostalCode}
                        <br />
                        {draftPlans} - {draftPermissions}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                        {/* TODO: Contactar */}
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                    {draftAtachments}
                    {draftBestSchedule}
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
