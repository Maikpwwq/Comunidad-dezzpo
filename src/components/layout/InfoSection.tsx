import React from 'react'
import { Row, Col } from 'react-bootstrap'
import clsx from 'clsx'

interface InfoSectionProps {
    title: string
    subtitle?: string
    description?: string
    children?: React.ReactNode
    className?: string
    centered?: boolean
}

export const InfoSection = ({
    title,
    subtitle,
    description,
    children,
    className,
    centered = false
}: InfoSectionProps) => {
    return (
        <Col className={clsx("pt-4 pb-4 p-0", className)} xs={12}>
            <div className={clsx("mb-4", centered && "text-center")}>
                <h3 className="headline-l mb-3">{title}</h3>
                {subtitle && <h4 className="headline-m color-green mb-2">{subtitle}</h4>}
                {description && <p className="body-2 px-2" style={{ maxWidth: centered ? '800px' : '100%', margin: centered ? '0 auto' : undefined }}>{description}</p>}
            </div>
            {children && (
                <Row className="m-0 w-100 d-flex justify-content-center">
                    {children}
                </Row>
            )}
        </Col>
    )
}
