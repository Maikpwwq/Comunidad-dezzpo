import React from 'react'
import {
    Container,
    type ContainerProps,
    Box,
    Typography,
    Breadcrumbs,
    Link
} from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

interface BreadcrumbItem {
    label: string
    href?: string
}

export interface PageContainerProps extends ContainerProps {
    title?: string
    description?: string
    breadcrumbs?: BreadcrumbItem[]
    actions?: React.ReactNode
    children: React.ReactNode
}

export function PageContainer({
    title,
    description,
    breadcrumbs,
    actions,
    children,
    maxWidth = 'lg',
    sx,
    ...props
}: PageContainerProps) {
    return (
        <Container maxWidth={maxWidth} sx={{ py: 4, ...sx }} {...props}>
            {/* Header Section */}
            {(title || breadcrumbs) && (
                <Box mb={4}>
                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" />}
                            aria-label="breadcrumb"
                            sx={{ mb: 2 }}
                        >
                            {breadcrumbs.map((item, index) => {
                                const isLast = index === breadcrumbs.length - 1
                                return isLast ? (
                                    <Typography key={item.label} color="text.primary">
                                        {item.label}
                                    </Typography>
                                ) : (
                                    <Link
                                        key={item.label}
                                        underline="hover"
                                        color="inherit"
                                        href={item.href}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </Breadcrumbs>
                    )}

                    {/* Title & Actions Row */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <Box>
                            {title && (
                                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                                    {title}
                                </Typography>
                            )}
                            {description && (
                                <Typography variant="body1" color="text.secondary">
                                    {description}
                                </Typography>
                            )}
                        </Box>
                        {actions && <Box>{actions}</Box>}
                    </Box>
                </Box>
            )}

            {/* Main Content */}
            {children}
        </Container>
    )
}
