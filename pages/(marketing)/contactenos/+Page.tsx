/**
 * Contáctenos (Contact) Page
 *
 * Converted to TypeScript.
 */
import { useState } from 'react'
// Styles
// Assets
import ContactenosFranja from '@assets/img/ContactenosFranja.png'
import LogoPNG from '@assets/img/LogoPNG.png'
import SelectorContactenos from '@assets/img/SelectorContactenos.png'
// Components
import { DatosContacto } from '@features/marketing'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
interface ContactFormData {
    name: string
    email: string
    phone: string
    message: string
}
export default function Page() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
    })
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement form submission
        console.log('Form submitted:', formData)
    }
    return (
        <>
            <Container fluid className="contact-page p-0">
                <Row className="m-0 w-100">
                    <Col className="m-4">
                        <h2 className="main-titulo headline-xl text-verde">CONTÁCTENOS</h2>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="p-0">
                <Row className="contactenos-mensaje row m-0 w-100">
                    <Col lg={4} md={6} sm={10}>
                        <img src={ContactenosFranja} alt="fondo comunidad dezzpo" />
                        <img src={LogoPNG} alt="Logo Comunidad Dezzpo" />
                    </Col>
                    <Col lg={4} md={6} sm={10}>
                        <div className="form-contacto">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="nombre:"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <br />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Email:"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <br />
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    placeholder="teléfono:"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <br />
                                <textarea
                                    className="mb-4"
                                    name="message"
                                    id="message"
                                    cols={30}
                                    rows={6}
                                    placeholder="mensaje:"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                <br />
                                <br />
                                <Button type="submit" className="btn-main btn-round btn-high body-1">
                                    ENVIAR
                                </Button>
                            </form>
                        </div>
                    </Col>
                    <Col lg={4} md={6} sm={10}>
                        <div className="border-blue">
                            <img src={SelectorContactenos} alt="datos de contacto" />
                            <DatosContacto />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
