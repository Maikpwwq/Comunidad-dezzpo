/**
 * Calificaciones (Ratings) Page
 *
 * Converted to TypeScript.
 * Rating form for evaluating service providers.
 */
import { useState } from 'react'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
// MUI
import Button from '@mui/material/Button'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Rating from '@mui/material/Rating'
import FormLabel from '@mui/material/FormLabel'
interface RateState {
    gestion: number
    calidad: number
    oportunidad: number
    description: string
}
// Rating criteria
const ratingCriteria = [
    {
        name: 'gestion' as const,
        label: 'Gestión',
        description: 'Cumple con los tiempos de entrega de las certificaciones, pólizas, actas y contratos.',
    },
    {
        name: 'calidad' as const,
        label: 'Calidad',
        description: 'El servicio cumplió con las especificaciones y normas técnicas establecidas, mientras el personal contratado fue suficiente.',
    },
    {
        name: 'oportunidad' as const,
        label: 'Oportunidad',
        description: 'El servicio fue prestado en las fechas y horario programados, además las facturas y documentos fueron entregados oportunamente.',
    },
]
export default function Page() {
    const [rate, setRate] = useState<RateState>({
        gestion: 0,
        calidad: 0,
        oportunidad: 0,
        description: '',
    })
    const handleRate = (value: number | null, name: keyof RateState) => {
        if (value !== null && name !== 'description') {
            setRate({ ...rate, [name]: value })
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRate({ ...rate, description: event.target.value })
    }
    const handleSubmit = () => {
        // TODO: Implement rating submission
        console.log('Rating submitted:', rate)
    }
    return (
        <Container fluid className="p-0 h-100">
            <Row className="m-0 w-100 d-flex pt-4 pb-4">
                <Col className="col-10">
                    <h2 className="headline-xl">Calificaciones</h2>
                    <p className="p-description">Evaluación del desempeño</p>
                    <p className="body-1">
                        Valore el usuario según los siguientes tres aspectos:
                    </p>
                    <Col className="col-12">
                        {ratingCriteria.map((criteria) => (
                            <FormLabel
                                key={criteria.name}
                                className="body-2 pt-4 d-flex align-items-center w-100 justify-content-between"
                            >
                                <Col className="col-10 body-1">
                                    {criteria.label}:<br />
                                    {criteria.description}
                                </Col>
                                <br />
                                <Rating
                                    name={criteria.name}
                                    value={rate[criteria.name]}
                                    onChange={(_, value) => handleRate(value, criteria.name)}
                                />
                            </FormLabel>
                        ))}
                        <TextareaAutosize
                            value={rate.description}
                            onChange={handleChange}
                            name="rateDescription"
                            placeholder="Observaciones generales"
                            cols={50}
                            minRows={4}
                            className="w-80"
                        />
                        <Row className="pt-4">
                            <Col>
                                <Button type="submit" onClick={handleSubmit}>
                                    Enviar
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </Container>
    )
}
