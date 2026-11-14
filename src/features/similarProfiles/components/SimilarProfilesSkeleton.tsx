/**
 * Skeleton Loader for Similar Profiles Section
 *
 * Guarantees zero Cumulative Layout Shift (CLS = 0) by reserving
 * exact layout geometry matching the compact card grid.
 */

import React from 'react'
import { Skeleton, Box } from '@mui/material'
import styles from './SimilarProfilesSection.module.scss'

export interface SimilarProfilesSkeletonProps {
    readonly count?: number
}

export function SimilarProfilesSkeleton({ count = 3 }: SimilarProfilesSkeletonProps): React.ReactElement {
    return (
        <section
            className={styles.SimilarProfilesContainer}
            aria-busy="true"
            aria-label="Cargando profesionales recomendados"
        >
            <div className={styles.Header}>
                <Skeleton variant="text" width={280} height={32} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width={200} height={20} />
            </div>

            <div className={styles.Grid}>
                {Array.from({ length: count }).map((_, index) => (
                    <Box
                        key={`skeleton-card-${index}`}
                        className={styles.CardWrapper}
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            bgcolor: 'background.paper',
                            minHeight: 200,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Skeleton variant="circular" width={44} height={44} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="75%" height={22} />
                                <Skeleton variant="text" width="50%" height={16} />
                            </Box>
                        </Box>

                        <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />

                        <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 1 }}>
                            <Skeleton variant="rectangular" width={90} height={36} sx={{ borderRadius: '18px' }} />
                            <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: '18px' }} />
                        </Box>
                    </Box>
                ))}
            </div>
        </section>
    )
}

