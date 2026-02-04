import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

/**
 * AllFontStyles Component
 *
 * Development utility for visually inspecting the complete typography system.
 * Organized into hierarchical categories matching the SCSS token system.
 *
 * @see src/styles/_variables.scss - SCSS token definitions
 * @see src/styles/components/_typography.scss - Fluid typography system
 */

interface StyleCardProps {
    title: string
    scssToken: string
    className: string
    size: string
    intent: string
    children: React.ReactNode
}

function StyleCard({ title, scssToken, className, size, intent, children }: StyleCardProps) {
    return (
        <Box
            sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 3,
                mb: 2,
                backgroundColor: '#fafafa',
                width: '100%',
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                {title}
            </Typography>
            {children}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #ccc' }}>
                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                    <strong>Class:</strong> <code>.{className}</code>
                </Typography>
                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                    <strong>Token:</strong> <code>{scssToken}</code>
                </Typography>
                <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                    <strong>Size:</strong> {size}
                </Typography>
                <Typography variant="caption" component="div" sx={{ color: '#666' }}>
                    <strong>Intent:</strong> {intent}
                </Typography>
            </Box>
        </Box>
    )
}

export const AllFontStyles: React.FC = () => {
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
                Typography System Reference
            </Typography>

            {/* ============================================================= */}
            {/* SECTION A: DISPLAY & HEADINGS */}
            {/* ============================================================= */}
            <Typography variant="h5" sx={{ mb: 2, color: '#1976d2' }}>
                A. Display & Headings (Hero/Titles)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <StyleCard
                title="H1 - Hero Title"
                scssToken="$font-size-4xl (2.5rem / 40px)"
                className="type-hero-title"
                size="60px desktop → 32px mobile (fluid)"
                intent="Main landing page titles, hero sections"
            >
                <h1 className="type-hero-title" style={{ margin: 0 }}>
                    Hero Title Example
                </h1>
            </StyleCard>

            <StyleCard
                title="H2 - Section Header"
                scssToken="$font-size-3xl (2rem / 32px)"
                className="type-section-title"
                size="36px desktop → 24px mobile (fluid)"
                intent="Major feature sections, page headers"
            >
                <h2 className="type-section-title" style={{ margin: 0 }}>
                    Section Header Example
                </h2>
            </StyleCard>

            <StyleCard
                title="H3 - Card Title"
                scssToken="$font-size-2xl (1.75rem / 28px)"
                className="type-card-title"
                size="24px desktop → 18px mobile (fluid)"
                intent="Card titles, sub-section headers"
            >
                <h3 className="type-card-title" style={{ margin: 0 }}>
                    Card Title Example
                </h3>
            </StyleCard>

            <StyleCard
                title="H4 - Sub-heading"
                scssToken="$font-size-xl (1.5rem / 24px)"
                className="headline-m"
                size="24px fixed"
                intent="Secondary headers, feature labels"
            >
                <h4 className="headline-m" style={{ margin: 0 }}>
                    Sub-heading Example
                </h4>
            </StyleCard>

            {/* ============================================================= */}
            {/* SECTION B: BODY TEXT */}
            {/* ============================================================= */}
            <Typography variant="h5" sx={{ mb: 2, mt: 5, color: '#1976d2' }}>
                B. Body Text (Content)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <StyleCard
                title="Body Large - Lead Paragraph"
                scssToken="$font-size-lg (1.25rem / 20px)"
                className="type-body-lg"
                size="18px desktop → 16px mobile (fluid)"
                intent="Introductory paragraphs, emphasized marketing copy"
            >
                <p className="type-body-lg" style={{ margin: 0 }}>
                    This is lead paragraph text. Used for introducing sections or emphasizing
                    important marketing content that should stand out from regular body copy.
                </p>
            </StyleCard>

            <StyleCard
                title="Body Medium - Standard"
                scssToken="$font-size-md / $font-size-base (1rem / 16px)"
                className="type-body"
                size="16px desktop → 14px mobile (fluid)"
                intent="Default text for all content"
            >
                <p className="type-body" style={{ margin: 0 }}>
                    This is standard body text. The default paragraph style used throughout
                    the application for general content, descriptions, and information.
                </p>
            </StyleCard>

            <StyleCard
                title="Body Small - Caption"
                scssToken="$font-size-sm (0.875rem / 14px)"
                className="type-caption"
                size="14px desktop → 12px mobile (fluid)"
                intent="Secondary info, captions, metadata, legal disclaimers"
            >
                <p className="type-caption" style={{ margin: 0 }}>
                    Small caption text for metadata, timestamps, secondary information,
                    legal notices, and fine print throughout the interface.
                </p>
            </StyleCard>

            {/* ============================================================= */}
            {/* SECTION C: SPECIALIZED SEMANTIC STYLES */}
            {/* ============================================================= */}
            <Typography variant="h5" sx={{ mb: 2, mt: 5, color: '#1976d2' }}>
                C. Specialized Semantic Styles
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <StyleCard
                title="Marketing Description"
                scssToken="fluid-type(16px, 18px)"
                className="marketing-description"
                size="18px desktop → 16px mobile"
                intent="Feature descriptions, long-form marketing copy"
            >
                <p className="marketing-description" style={{ margin: 0 }}>
                    Marketing description text with optimal line-height and max-width
                    for comfortable reading across devices.
                </p>
            </StyleCard>

            <StyleCard
                title="Section Label"
                scssToken="$font-size-sm + uppercase"
                className="section-label"
                size="16px desktop → 14px mobile"
                intent="Category labels, section identifiers (e.g., 'Propietarios')"
            >
                <span className="section-label">PROPIETARIOS</span>
            </StyleCard>

            <StyleCard
                title="Hero Subtitle - On Image"
                scssToken="fluid-type(16px, 21px) + text-shadow"
                className="hero-subtitle on-image"
                size="21px desktop → 16px mobile"
                intent="Secondary text on image/gradient backgrounds"
            >
                <Box sx={{ backgroundColor: '#333', p: 2, borderRadius: 1 }}>
                    <span className="hero-subtitle on-image" style={{ color: '#fff' }}>
                        Subtitle text with shadow for legibility on images
                    </span>
                </Box>
            </StyleCard>

            {/* ============================================================= */}
            {/* SECTION D: CONTRAST CLASSES */}
            {/* ============================================================= */}
            <Typography variant="h5" sx={{ mb: 2, mt: 5, color: '#1976d2' }}>
                D. Contrast Enforcement Classes
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <StyleCard
                title="Opacidad Negro (Dark Overlay)"
                scssToken="var(--background-smoke-color) rgba(0,0,0,0.8)"
                className="opacidad-negro"
                size="Inherits from parent"
                intent="Text overlay box for image backgrounds (WCAG compliant)"
            >
                <div className="opacidad-negro" style={{ width: '100%' }}>
                    <h3 style={{ margin: 0 }}>Título en Overlay</h3>
                    <p>Este texto es legible sobre fondos de imagen gracias al overlay oscuro.</p>
                </div>
            </StyleCard>

            <StyleCard
                title="Opacidad Blanco (Light Overlay)"
                scssToken="rgba(233, 235, 230, 0.8)"
                className="opacidad-blanco"
                size="Inherits from parent"
                intent="Light overlay for content on image backgrounds"
            >
                <div className="opacidad-blanco" style={{ width: '100%', padding: '1rem' }}>
                    <p style={{ margin: 0, color: '#4b4b4b' }}>Contenido sobre overlay blanco</p>
                </div>
            </StyleCard>

            <StyleCard
                title="Step Card Text Fix"
                scssToken="var(--content-text-color)"
                className="step-card-text"
                size="Inherits from parent"
                intent="Fixes white-on-white contrast in step cards"
            >
                <Box className="step-card-text" sx={{ backgroundColor: '#f2f2f2', p: 2, borderRadius: 1 }}>
                    <p style={{ margin: 0 }}>Card text with enforced dark color</p>
                </Box>
            </StyleCard>

            {/* ============================================================= */}
            {/* SECTION E: BUTTON TYPOGRAPHY */}
            {/* ============================================================= */}
            <Typography variant="h5" sx={{ mb: 2, mt: 5, color: '#1976d2' }}>
                E. Button Typography
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <StyleCard
                title="Primary Gradient Button"
                scssToken="font-weight: 700, border-radius: 30px"
                className="btn-primary-gradient"
                size="1rem base"
                intent="Main CTAs (Siguiente, Guardar y continuar)"
            >
                <button className="btn-primary-gradient">Siguiente</button>
            </StyleCard>

            <StyleCard
                title="Secondary Outline Button"
                scssToken="font-weight: 700, border: 2px solid"
                className="btn-secondary-outline"
                size="1rem base"
                intent="Secondary actions (Volver atrás, Cancelar)"
            >
                <button className="btn-secondary-outline">Volver atrás</button>
            </StyleCard>

            <StyleCard
                title="Icon Action Button"
                scssToken="font-weight: 700, padding-left: 48px"
                className="btn-icon-action"
                size="1rem base"
                intent="Buttons with icons (PUBLICAR, CHAT EN VIVO)"
            >
                <button className="btn-icon-action">PUBLICAR</button>
            </StyleCard>

            {/* ============================================================= */}
            {/* TYPOGRAPHY MANIFEST TABLE */}
            {/* ============================================================= */}
            <Typography variant="h5" sx={{ mb: 2, mt: 5, color: '#1976d2' }}>
                Typography Manifest
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e3f2fd' }}>
                        <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ccc' }}>Level</th>
                        <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ccc' }}>SCSS Variable</th>
                        <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ccc' }}>Desktop</th>
                        <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ccc' }}>Mobile</th>
                        <th style={{ padding: 8, textAlign: 'left', border: '1px solid #ccc' }}>Intent</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={{ padding: 8, border: '1px solid #ccc' }}>H1</td><td style={{ padding: 8, border: '1px solid #ccc' }}>$font-size-4xl</td><td style={{ padding: 8, border: '1px solid #ccc' }}>2.5rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>2rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>Hero Titles</td></tr>
                    <tr><td style={{ padding: 8, border: '1px solid #ccc' }}>H2</td><td style={{ padding: 8, border: '1px solid #ccc' }}>$font-size-3xl</td><td style={{ padding: 8, border: '1px solid #ccc' }}>2rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>1.75rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>Section Headers</td></tr>
                    <tr><td style={{ padding: 8, border: '1px solid #ccc' }}>H3</td><td style={{ padding: 8, border: '1px solid #ccc' }}>$font-size-2xl</td><td style={{ padding: 8, border: '1px solid #ccc' }}>1.75rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>1.5rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>Card Titles</td></tr>
                    <tr><td style={{ padding: 8, border: '1px solid #ccc' }}>Body L</td><td style={{ padding: 8, border: '1px solid #ccc' }}>$font-size-lg</td><td style={{ padding: 8, border: '1px solid #ccc' }}>1.25rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>1.125rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>Lead Paragraphs</td></tr>
                    <tr><td style={{ padding: 8, border: '1px solid #ccc' }}>Body M</td><td style={{ padding: 8, border: '1px solid #ccc' }}>$font-size-md</td><td style={{ padding: 8, border: '1px solid #ccc' }}>1rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>1rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>Standard Content</td></tr>
                    <tr><td style={{ padding: 8, border: '1px solid #ccc' }}>Small</td><td style={{ padding: 8, border: '1px solid #ccc' }}>$font-size-sm</td><td style={{ padding: 8, border: '1px solid #ccc' }}>0.875rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>0.875rem</td><td style={{ padding: 8, border: '1px solid #ccc' }}>Captions/Metadata</td></tr>
                </tbody>
            </Box>

            {/* ============================================================= */}
            {/* SECTION F: COLOR PALETTE (Corporate Identity) */}
            {/* ============================================================= */}
            <Typography variant="h5" sx={{ mb: 2, mt: 5, color: '#1976d2' }}>
                F. Color Palette (Corporate Identity)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Primary Brand Colors */}
            <Typography variant="h6" sx={{ mb: 2 }}>Primary Brand Colors</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <ColorSwatch color="#209da1" name="Logo Dezzpo" token="--logo-comunidad-dezzpo-color" />
                <ColorSwatch color="#00b0ab" name="Primary Green" token="--background-main-green-color" />
                <ColorSwatch color="#1ec7e6" name="Primary Cyan" token="--primary-blue-light-color" />
                <ColorSwatch color="#662382" name="Primary Purple" token="--background-dark-purple-color" />
            </Box>

            {/* Text Colors */}
            <Typography variant="h6" sx={{ mb: 2 }}>Text Colors</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <ColorSwatch color="#000000" name="Black Text" token="--primary-black-text-color" />
                <ColorSwatch color="#4d4d4d" name="Titles" token="--primary-titles-text-color" />
                <ColorSwatch color="#4b4b4b" name="Content" token="--content-text-color" />
                <ColorSwatch color="#149ba1" name="Green Text" token="--primary-green-text-color" />
                <ColorSwatch color="#ffffff" name="White Text" token="--content-text-white-color" />
            </Box>

            {/* Background Colors */}
            <Typography variant="h6" sx={{ mb: 2 }}>Background Colors</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <ColorSwatch color="#e6e6e6" name="Light Gray" token="--background-light-gray-color" />
                <ColorSwatch color="#333333" name="Dark Gray" token="--background-dark-gray-color" />
                <ColorSwatch color="rgba(0,0,0,0.8)" name="Smoke" token="--background-smoke-color" />
                <ColorSwatch color="#009999" name="Hover Green" token="--background-hover-green-color" />
                <ColorSwatch color="#ffffff" name="White" token="--background-white-color" />
            </Box>

            {/* Accent & Alert Colors */}
            <Typography variant="h6" sx={{ mb: 2 }}>Accent & Alert Colors</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <ColorSwatch color="#deaf06" name="Yellow" token="--background-yellow-color" />
                <ColorSwatch color="#92b901" name="Lemon Green" token="--background-lemon-green-color" />
                <ColorSwatch color="#069169" name="Success" token="--success-alert-color" />
                <ColorSwatch color="#a80521" name="Error" token="--error-alert-color" />
                <ColorSwatch color="#ffab00" name="Warning" token="--warning-alert-color" />
            </Box>

            {/* Utility Classes */}
            <Typography variant="h6" sx={{ mb: 2 }}>Background Utility Classes</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <Box className="bg-verde" sx={{ p: 2, borderRadius: 1, minWidth: 120, textAlign: 'center' }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.75rem' }}>.bg-verde</Typography>
                </Box>
                <Box className="bg-azul" sx={{ p: 2, borderRadius: 1, minWidth: 120, textAlign: 'center' }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.75rem' }}>.bg-azul</Typography>
                </Box>
                <Box className="bg-crema" sx={{ p: 2, borderRadius: 1, minWidth: 120, textAlign: 'center' }}>
                    <Typography sx={{ color: '#333', fontSize: '0.75rem' }}>.bg-crema</Typography>
                </Box>
                <Box className="bg-cafe" sx={{ p: 2, borderRadius: 1, minWidth: 120, textAlign: 'center' }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.75rem' }}>.bg-cafe</Typography>
                </Box>
                <Box className="bg-negro" sx={{ p: 2, borderRadius: 1, minWidth: 120, textAlign: 'center' }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.75rem' }}>.bg-negro</Typography>
                </Box>
            </Box>
        </Box>
    )
}

// Color Swatch Component
function ColorSwatch({ color, name, token }: { color: string; name: string; token: string }) {
    const isDark = color.startsWith('#') &&
        (parseInt(color.slice(1, 3), 16) + parseInt(color.slice(3, 5), 16) + parseInt(color.slice(5, 7), 16)) < 384

    return (
        <Box sx={{ textAlign: 'center', width: 100 }}>
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: color,
                    borderRadius: 2,
                    border: '1px solid #ccc',
                    mx: 'auto',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    pb: 0.5,
                }}
            >
                <Typography sx={{ fontSize: '0.6rem', color: isDark ? '#fff' : '#333' }}>
                    {color}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{name}</Typography>
            <Typography sx={{ fontSize: '0.6rem', color: '#666', fontFamily: 'monospace' }}>
                {token}
            </Typography>
        </Box>
    )
}

export default AllFontStyles

