import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

/**
 * AllFontStyles Component
 * 
 * Development utility for visually inspecting all available font styles and variants.
 * Used for CDN and theme verification.
 */
export const AllFontStyles: React.FC = () => {
    return (
        <Box className="d-flex flex-col flex-wrap align-items-center justify-content-center p-6" sx={{ gap: 2 }}>
            <Typography className="me-6" variant='h1'>variant h1</Typography>
            <Typography className="me-6" variant='h2'>variant h2</Typography>
            <Typography className="me-6" variant='h3'>variant h3</Typography>
            <Typography className="me-6" variant='h4'>variant h4</Typography>
            <Typography className="me-6" variant='h5'>variant h5</Typography>
            <Typography className="me-6" variant='h6'>variant h6</Typography>
            <Typography className="me-6" variant='body1'>variant body1</Typography>
            <Typography className="me-6" variant='body2'>variant body2</Typography>

            {/* Custom Variants mapped to Typography if extended, otherwise classes */}
            <Typography className="me-6" variant='subtitle1'>variant subtitle1</Typography>
            <Typography className="me-6" variant='subtitle2'>variant subtitle2</Typography>
            <Typography className="me-6" variant='caption'>variant caption</Typography>
            <Typography className="me-6" variant='overline'>variant overline</Typography>

            {/* Legacy Classes - Visual Check */}
            <Typography className="me-6 dezzpo-svg">className dezzpo-svg</Typography>
            <Typography className="me-6 headline-xxl">className headline-xxl</Typography>
            <Typography className="me-6 headline-xl">className headline-xl</Typography>
            <Typography className="me-6 headline-l">className headline-l</Typography>
            <Typography className="me-6 headline-m">className headline-m</Typography>
            <Typography className="me-6 headline-s">className headline-s</Typography>
            <Typography className="me-6 headline-xs">className headline-xs</Typography>
            <Typography className="me-6 headline-subtitle">className headline-subtitle</Typography>

            <Typography className="me-6 field">className field</Typography>
            <Typography className="me-6 caption">className caption (class)</Typography>
            <Typography className="me-6 tituloTabla">className tituloTabla</Typography>
            <Typography className="me-6 table-head">className table-head</Typography>
            <Typography className="me-6 headerTitle">className headerTitle</Typography>
            <Typography className="me-6 tituloSticker">className tituloSticker</Typography>
            <Typography className="me-6 p-description">className p-description</Typography>
            <Typography className="me-6 body-1">className body-1</Typography>
            <Typography className="me-6 body-2">className body-2</Typography>
            <Typography className="me-6 descripcionSticker">className descripcionSticker</Typography>

            {/* Button Classes */}
            <Typography className="me-6 btn-TEXT">Comunidad Dezzpo (btn-TEXT)</Typography>
            <Typography className="me-6 btn btn-round btn-high">Comunidad Dezzpo (btn-high)</Typography>
            <Typography className="me-6 btn btn-round btn-middle">Comunidad Dezzpo (btn-middle)</Typography>
            <Typography className="me-6 btn btn-low">Comunidad Dezzpo (btn-low)</Typography>
            <Typography className="me-6 btn btn-orange">Comunidad Dezzpo (btn-orange)</Typography>
            <Typography className="me-6 btn btn-avanzar">Comunidad Dezzpo (btn-avanzar)</Typography>
            <Typography className="me-6 btn btn-blog">Comunidad Dezzpo (btn-blog)</Typography>
            <Typography className="me-6 btn btn-green">Comunidad Dezzpo (btn-green)</Typography>
            <Typography className="me-6 btn btn-main">Comunidad Dezzpo (btn-main)</Typography>
            <Typography className="me-6 btn btn-buscador">Comunidad Dezzpo (btn-buscador)</Typography>
            <Typography className="me-6 btn btn-siguiente">Comunidad Dezzpo (btn-siguiente)</Typography>
            <Typography className="me-6 btn btn-vinculate">Comunidad Dezzpo (btn-vinculate)</Typography>
            <Typography className="me-6 btn btn-red">Comunidad Dezzpo (btn-red)</Typography>
        </Box>
    )
}

export default AllFontStyles
