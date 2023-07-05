export { Page }

import React, { useState } from 'react'
import '#@/assets/css/subCategoriesCard.css'
import { navigate } from 'vite-plugin-ssr/client/router'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PropTypes from 'prop-types'

const Page = ({ props, setCategoriaInfo, categoriaInfo }) => {
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
        // navigate(`/app/perfil/${userId}`)
        // console.log(e, selected)
        setSelected(!selected)
        if (selected) {
            const previewSelected = categoriaInfo.selected
            previewSelected.push(props)
            // const selectedCategories = new Array(previewSelected, props)
            setCategoriaInfo({ ...categoriaInfo, selected: previewSelected })
            // console.log(categoriaInfo)
        } else {
            const previewSelected = categoriaInfo.selected
            const deleteSelected = previewSelected.indexOf(props)
            previewSelected.splice(deleteSelected, 1)
            // const selectedCategories = new Array(previewSelected, props)
            setCategoriaInfo({ ...categoriaInfo, selected: previewSelected })
            // console.log(categoriaInfo)
        }
    }

    return (
        <Card className="card-categorie mb-4 me-4">
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
            <CardContent className="pt-0 pb-0">
                <Typography
                    variant="body2"
                    color="text.secondary"
                    className="pb-2"
                >
                    {subCategoriaDescription}
                </Typography>
                <Typography variant="body1">
                    Precio:{' '}
                    {parseInt(subCategoriaPrecio).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                    })}
                </Typography>
                <Typography variant="body1">
                    Cantidad: {subCategoriaCantidad}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <Button className="pt-4" onClick={handleSeleccionar}>
                    {/* {selected ? 'Seleccionar' : 'Quitar'} */}
                    {selected ? (
                        <>
                            <AddShoppingCartIcon /> Agregar al carrito
                        </>
                    ) : (
                        'Quitar'
                    )}
                </Button>
            </CardActions>
        </Card>
    )
}

Page.propTypes = {
    subCategoria: PropTypes.string,
    subCategoriaDescription: PropTypes.string,
    subCategoriaPrecio: PropTypes.string,
    subCategoriaPhotoUrl: PropTypes.string,
    subCategoriaCantidad: PropTypes.string,
    props: PropTypes.object,
    setCategoriaInfo: PropTypes.func,
    categoriaInfo: PropTypes.object,
}
