import React, { useState } from 'react'
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
import PropTypes from 'prop-types'

const SubCategorias = ({ props, setCategoriaInfo, categoriaInfo }) => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(true)
    const {
        subCategoria,
        subCategoriaDescription,
        subCategoriaPrecio,
        subCategoriaPhotoUrl,
        subCategoriaCantidad,
    } = props

    const handleSeleccionar = (e) => {
        e.preventDefault()
        // navigate('/app/perfil', { state: { id: userId } })
        // navigate(`/app/perfil/${userId}`)
        console.log(e, selected)
        setSelected(!selected)
        if (selected) {
            const previewSelected = categoriaInfo.selected
            previewSelected.push(props)
            // const selectedCategories = new Array(previewSelected, props)
            setCategoriaInfo({ ...categoriaInfo, selected: previewSelected })
            console.log(categoriaInfo)
        } else {
            const previewSelected = categoriaInfo.selected
            const deleteSelected = previewSelected.indexOf(props)
            previewSelected.splice(deleteSelected, 1)
            // const selectedCategories = new Array(previewSelected, props)
            setCategoriaInfo({ ...categoriaInfo, selected: previewSelected })
            console.log(categoriaInfo)
        }
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
                    {selected ? 'Seleccionar' : 'Quitar'}
                </Button>
            </CardActions>
        </Card>
    )
}

SubCategorias.propTypes = {
    subCategoria: PropTypes.string,
    subCategoriaDescription: PropTypes.string,
    subCategoriaPrecio: PropTypes.string,
    subCategoriaPhotoUrl: PropTypes.string,
    subCategoriaCantidad: PropTypes.string,
    props: PropTypes.object,
    setCategoriaInfo: PropTypes.func,
    categoriaInfo: PropTypes.object,
}

export default SubCategorias
