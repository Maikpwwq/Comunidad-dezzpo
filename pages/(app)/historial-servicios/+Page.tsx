/**
 * Historial Servicios (Service History) Page
 *
 * Converted to TypeScript.
 */

export const documentProps = {
    title: 'Historial de Servicios | Comunidad Dezzpo',
    description: 'Consulta tu historial de proyectos y requerimientos.',
}

// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

// MUI
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

// Table configurations
const projectColumns = ['Imágenes', 'Descripción', 'Fecha de publicación', 'Valor aproximado', 'Ubicación']
const closedColumns = [...projectColumns, 'Postular']

// History sections
const sections = [
    { title: 'Proyectos Publicados', columns: projectColumns },
    { title: 'Proyectos cerrados', columns: closedColumns },
    { title: 'Requerimientos guardados', columns: projectColumns },
    { title: 'Requerimientos solicitados', columns: projectColumns },
]

export default function Page() {
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex align-items-start pt-4 pb-4">
                <Col className="col-10" md={10}>
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h2 className="headline-xl">{section.title}</h2>
                            <div className="p-4">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {section.columns.map((col) => (
                                                <TableCell key={col}>{col}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {section.columns.map((col) => (
                                                <TableCell key={col}>DATA...</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ))}
                </Col>
            </Row>
        </Container>
    )
}
