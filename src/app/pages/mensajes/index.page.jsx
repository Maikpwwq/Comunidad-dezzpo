export { Page }
export { LayoutAppPaperbase as Layout} from '#@/app/components/LayoutAppPaperbase'

// Pagina de Usuario - Mensajes
import React from 'react'
import es from 'date-fns/locale/es'
import { auth } from '#@/firebase/firebaseClient'
// import { App as SendBirdApp } from '@sendbird/uikit-react'
// react-bootrstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// import FormControl from '@mui/material/FormControl'
// import InputLabel from '@mui/material/InputLabel'
// import Select from '@mui/material/Select'
// import MenuItem from '@mui/material/MenuItem'
// import TextareaAutosize from '@mui/material/TextareaAutosize'

const Page = () => {
    let userId = auth?.currentUser?.uid || undefined
    let appId = import.meta.env.VITE_APP_SENDBIRD_APPID
    // let appId = process.env.VITE_APP_SENDBIRD_APPID

    return (
        <>
            <Container fluid className="p-0 h-100">
                <Row className="m-0 w-100 d-flex align-items-start pt-4 pb-4">
                    <Col
                        className="col-10"
                        md={10}
                        sm={12}
                        style={{ height: '50vh' }}
                    >
                        <h2 className="headline-xl">Mensajes</h2>
                        {/* <SendBirdApp
                            appId={appId} // Sendbird application ID.
                            userId={userId} // user ID.
                            dateLocale={es}
                        /> */}
                        {/* <FormControl
                            fullWidth
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <InputLabel forHtml="bandejaMensajes">
                                Adicionar metodo
                            </InputLabel>
                            <Select
                                name="bandejaMensajes"
                                id="bandejaMensajes"
                                autoWidth
                                label="Bandeja Mensajes"
                            >
                                <MenuItem value="">
                                    <em>Categoría</em>
                                </MenuItem>
                                <MenuItem value="nuevosMensajes">
                                    Nuevos Mensajes
                                </MenuItem>
                                <MenuItem value="inquietudesPropietarios">
                                    Consultar inquietudes de los propietarios
                                </MenuItem>
                                <MenuItem value="AsesoriaProfesional">
                                    Asesorias con un profesional
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <div>
                            <label for="nuevosMensajes">Nuevos Mensajes </label>
                            <br />
                            <TextareaAutosize
                                minRows={3}
                                cols="30"
                                placeholder="Nuevos Mensajes"
                            ></TextareaAutosize>
                            <label for="inquietudesPropietarios ">
                                Consultar inquietudes de los propietarios
                            </label>
                            <TextareaAutosize
                                maxRows={3}
                                cols="30"
                                placeholder="Consultar inquietudes de los propietarios"
                            ></TextareaAutosize>
                            <label for="AsesoriaProfesional">
                                Asesorias con un profesional
                            </label>
                            <TextareaAutosize
                                maxRows={3}
                                cols="30"
                                placeholder="Asesorias con un profesional"
                            ></TextareaAutosize>
                        </div> */}
                    </Col>
                </Row>
            </Container>
        </>
    )
}
