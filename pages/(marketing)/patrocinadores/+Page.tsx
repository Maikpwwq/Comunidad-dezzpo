/**
 * Patrocinadores (Sponsors) Page
 *
 * Converted to TypeScript.
 */
// Styles
// Assets (using public path for these)
import LogoBictia from '/assets/img/LogoBictia.png'
import LogoMisionTic2022 from '/assets/img/LogoMisionTic2022.png'
import LogoTecnoparque from '/assets/img/LogoTecnoparque.png'
// Bootstrap
import { Row, Col, Container } from 'react-bootstrap'
// Sponsors data
const sponsors = [
    {
        name: 'Sena / Red Tecnoparque',
        logo: LogoTecnoparque,
        url: 'https://redtecnoparque.com/',
        height: '93px',
    },
    {
        name: 'Mintic / MisionTic2022',
        logo: LogoMisionTic2022,
        url: 'https://talentodigital.mintic.gov.co/734/w3-article-159508.html',
        height: '84px',
    },
    {
        name: 'Casa Bictia',
        logo: LogoBictia,
        url: 'https://bictia.com/',
        height: '48px',
        className: 'ms-5',
    },
]
export default function Page() {
    return (
        <Container fluid className="sponsors-page p-0">
            <Row className="containerPatrocinadores m-0 d-flex align-items-center" style={{ minHeight: '600px' }}>
                <Col className="col-12 d-flex justify-content-center">
                    <div className="patrocinadoresMensaje text-center opacidad-negro p-5 rounded-3">
                        <h1 className="type-hero-title text-blanco mb-5">
                            Estos son algunos de <br /> nuestros patrocinadores
                        </h1>
                        <ul className="list-unstyled d-flex flex-wrap justify-content-center align-items-center gap-5 m-0 p-0">
                            {sponsors.map((sponsor) => (
                                <li key={sponsor.name}>
                                    <a
                                        href={sponsor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="d-block transition-transform hover-scale"
                                    >
                                        <img
                                            src={sponsor.logo}
                                            alt={`Logo ${sponsor.name}`}
                                            height={sponsor.height}
                                            className={`img-fluid ${sponsor.className || ''}`}
                                            style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
