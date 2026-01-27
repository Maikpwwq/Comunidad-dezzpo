/**
 * Patrocinadores (Sponsors) Page
 *
 * Converted to TypeScript.
 */
// Styles
import '@assets/css/patrocinadores.css'
// Assets (using public path for these)
import LogoBictia from '/assets/img/LogoBictia.png'
import LogoMisionTic2022 from '/assets/img/LogoMisionTic2022.png'
import LogoTecnoparque from '/assets/img/LogoTecnoparque.png'
// Bootstrap
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
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
        <Container fluid className="p-0">
            <Row className="containerPatrocinadores">
                <Col className="col-10 align-items-start">
                    <div className="patrocinadoresMensaje">
                        <span className="tituloDocumento">
                            <h2 className="headline-xl">
                                Estos son algunos de <br /> nuestros patrocinadores
                            </h2>
                        </span>
                        <ul className="p-description flex-row align-items-center">
                            {sponsors.map((sponsor) => (
                                <li key={sponsor.name}>
                                    <a
                                        href={sponsor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={sponsor.logo}
                                            alt={`Logo ${sponsor.name}`}
                                            height={sponsor.height}
                                            className={`my-3 ${sponsor.className || ''}`}
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
