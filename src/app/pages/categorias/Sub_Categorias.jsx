import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const SubCategorias = ({ props }) => {
    const navigate = useNavigate()

    const {
        subCategoria,
        subCategoriaDescription,
        subCategoriaPrecio,
        subCategoriaPhotoUrl,
        subCategoriaCantidad,
    } = props

    const handleSeleccionar = () => {
        // navigate('/app/perfil', { state: { id: userId } })
        // navigate(`/app/perfil/${userId}`)
    }

    return (
        <Card className="mb-4" sx={{ maxWidth: 345 }}>
            {/* TODO: Categorias*/}
            <CardHeader
                // avatar={
                //     <Avatar
                //         src={subCategoriaPhotoUrl}
                //         sx={{ bgcolor: red[500] }}
                //         aria-label="recipe"
                //     >
                //         CD
                //     </Avatar>
                // }
                // action={
                //     <IconButton aria-label="settings">
                //         <MoreVertIcon />
                //     </IconButton>
                // }
                title={subCategoria}
            ></CardHeader>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {subCategoriaDescription}
                </Typography>
                <br />
                <Typography>Precio: {subCategoriaPrecio}</Typography>
                <Typography>Cantidad: {subCategoriaCantidad}</Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Button className="" onClick={handleSeleccionar}>
                    Seleccionar
                </Button>
            </CardActions>
        </Card>
    )
}

SubCategorias.defaultProps = {
    props: {
        subCategoria: '',
        subCategoriaDescription: '',
        subCategoriaPrecio: '',
        subCategoriaPhotoUrl: '',
        subCategoriaCantidad: '',
    },
}

export default SubCategorias
