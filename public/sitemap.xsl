<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="es">
        <head>
            <title>Mapa del Sitio XML — Comunidad Dezzpo</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <style type="text/css">
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    color: #1e293b;
                    background-color: #f8fafc;
                    margin: 0;
                    padding: 32px 24px;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header {
                    background: linear-gradient(135deg, #00897b 0%, #004d40 100%);
                    color: #ffffff;
                    padding: 28px 32px;
                    border-radius: 16px;
                    margin-bottom: 24px;
                    box-shadow: 0 10px 25px -5px rgba(0, 137, 123, 0.3);
                }
                .header h1 {
                    margin: 0 0 8px 0;
                    font-size: 26px;
                    font-weight: 800;
                }
                .header p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 15px;
                }
                .count-pill {
                    display: inline-block;
                    margin-top: 12px;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 700;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                }
                th {
                    background: #f1f5f9;
                    text-align: left;
                    padding: 14px 18px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #475569;
                    border-bottom: 1px solid #cbd5e1;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                td {
                    padding: 12px 18px;
                    font-size: 14px;
                    border-bottom: 1px solid #f1f5f9;
                    word-break: break-all;
                }
                tr:hover td {
                    background-color: #f8fafc;
                }
                a {
                    color: #00897b;
                    text-decoration: none;
                    font-weight: 600;
                }
                a:hover {
                    text-decoration: underline;
                }
                .badge {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 700;
                    background: #e0f2fe;
                    color: #0369a1;
                    text-transform: uppercase;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Mapa del Sitio XML (Sitemap)</h1>
                    <p>Documento oficial generado para motores de búsqueda (Googlebot, Bingbot). Contiene las URLs indexables del ecosistema Comunidad Dezzpo.</p>
                    <div class="count-pill">
                        Total de URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 60px;">#</th>
                            <th>URL Indexable</th>
                            <th style="width: 130px;">Frecuencia</th>
                            <th style="width: 100px;">Prioridad</th>
                            <th style="width: 160px;">Última Modificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="sitemap:urlset/sitemap:url">
                            <tr>
                                <td><xsl:value-of select="position()"/></td>
                                <td>
                                    <a>
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </xsl:attribute>
                                        <xsl:value-of select="sitemap:loc"/>
                                    </a>
                                </td>
                                <td><span class="badge"><xsl:value-of select="sitemap:changefreq"/></span></td>
                                <td><xsl:value-of select="sitemap:priority"/></td>
                                <td><xsl:value-of select="sitemap:lastmod"/></td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
