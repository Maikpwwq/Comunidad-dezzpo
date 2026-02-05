/**
 * Configuración de Privacidad (Privacy Settings) Page
 *
 * Converted to TypeScript.
 */
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// MUI
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
// Privacy settings data
const privacySettings = [
    { setting: 'Quién puede ver las publicaciones de tu perfil', value: 'Público' },
    { setting: 'Quién puede responder a tus solicitudes', value: 'Público' },
    { setting: 'Quién puede ver tu lista de amigos', value: 'Público' },
    { setting: 'Quién puede buscarte con el número de teléfono que proporcionaste', value: 'Público' },
    { setting: 'Quién puede buscarte con el correo electrónico que proporcionaste', value: 'Público' },
]
export default function Page() {
    return (
        <Container fluid className="p-0 h-100">
            <Row className="p-4">
                <Col className="col-10 m-0 w-100 d-flex justify-content-start">
                    <h1 className="type-hero-title">Configuración de privacidad</h1>
                    <Row md={10}>
                        <Col className="col-10 p-4">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Configuración</TableCell>
                                        <TableCell>Privacidad</TableCell>
                                        <TableCell>Editar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {privacySettings.map((item) => (
                                        <TableRow key={item.setting}>
                                            <TableCell>{item.setting}</TableCell>
                                            <TableCell>{item.value}</TableCell>
                                            <TableCell>
                                                <Button>Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}
