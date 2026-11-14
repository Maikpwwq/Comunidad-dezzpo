/**
 * SimilarProfilesSection Component (Fase 3: R1, R2, R5, R6, R7, R8, R9)
 *
 * Renders similar, featured, and nearby professionals at the bottom of
 * profile pages exclusively for visitors.
 *
 * Strict Invariants:
 * - R1: Returns null immediately if isOwnProfile is true (no network requests, no DOM).
 * - R4/R5: Shows only if >= minResults (2); otherwise returns null.
 * - R7: Lazy-loaded via IntersectionObserver with 250px margin.
 * - R8: Accessible (WCAG 2.2 AA), responsive grid, touch targets >= 44px.
 * - R9: Zero visitor PII telemetry.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@mui/material'
import { UserCard } from '@features/profile/components/UserCard'
import { SimilarProfilesSkeleton } from './SimilarProfilesSkeleton'
import { fetchSimilarProfiles } from '@services/similarProfiles'
import { SIMILAR_PROFILES_CONFIG } from '@config/similarProfiles.config'
import {
    sectionTitle,
    type SimilarProfilesData,
} from '../domain'
import { prefetchProfileRoute } from '../utils/profilePrefetch'
import {
    trackSimilarProfilesImpression,
    trackSimilarProfilesCardClick,
    trackSimilarProfilesQuoteClick,
    trackSimilarProfilesViewAllClick,
} from '../analytics/similarProfilesAnalytics'
import styles from './SimilarProfilesSection.module.scss'

export interface SimilarProfilesSectionProps {
    readonly targetProfileId: string
    readonly targetCategories?: readonly string[] | undefined
    readonly targetCiudad?: string | undefined
    readonly targetDirection?: string | undefined
    readonly targetDepartamento?: string | undefined
    readonly isOwnProfile: boolean
    readonly currentUserId?: string | null | undefined
    readonly viewerRole?: number | null | undefined
    readonly visitorZone?: string | null | undefined
    readonly visitorPropertyType?: string | null | undefined
}

export function SimilarProfilesSection({
    targetProfileId,
    targetCategories,
    targetCiudad,
    targetDirection,
    targetDepartamento: _targetDepartamento,
    isOwnProfile,
    currentUserId,
    viewerRole: _viewerRole,
    visitorZone,
    visitorPropertyType,
}: SimilarProfilesSectionProps): React.ReactElement | null {
    // ── R1 [OB]: Invariant 1 - If owner, render nothing and execute zero queries ──
    if (isOwnProfile) {
        return null
    }

    const sentinelRef = useRef<HTMLDivElement | null>(null)
    const [inView, setInView] = useState(false)
    const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'vacio' | 'error'>('idle')
    const [data, setData] = useState<SimilarProfilesData | null>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const hasTrackedImpressionRef = useRef(false)

    // Reset on profile change (R1)
    useEffect(() => {
        setData(null)
        setStatus('idle')
        hasTrackedImpressionRef.current = false
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
        }
    }, [targetProfileId])

    // Lazy load sentinel observer (R7)
    useEffect(() => {
        if (isOwnProfile || inView) return

        const el = sentinelRef.current
        if (!el || typeof window === 'undefined') return

        if (!('IntersectionObserver' in window)) {
            setInView(true)
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setInView(true)
                    observer.disconnect()
                }
            },
            { rootMargin: SIMILAR_PROFILES_CONFIG.viewportMargin }
        )

        observer.observe(el)
        return () => {
            observer.disconnect()
        }
    }, [isOwnProfile, inView, targetProfileId])

    const executeFetch = useCallback(() => {
        if (isOwnProfile || !targetProfileId) return

        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller

        setStatus('loading')

        const effectiveZone = visitorZone || targetCiudad || targetDirection || undefined

        fetchSimilarProfiles({
            profileId: targetProfileId,
            zone: effectiveZone,
            visitorZone: visitorZone || undefined,
            visitorId: currentUserId || undefined,
            propertyType: visitorPropertyType || undefined,
            signal: controller.signal,
        })
            .then((outcome) => {
                if (controller.signal.aborted) return

                if (outcome.status === 'ok') {
                    if (outcome.data.items.length < SIMILAR_PROFILES_CONFIG.minResults) {
                        setStatus('vacio')
                    } else {
                        setData(outcome.data)
                        setStatus('ok')
                    }
                } else if (outcome.status === 'vacio') {
                    setStatus('vacio')
                } else {
                    setStatus('error')
                }
            })
            .catch(() => {
                if (!controller.signal.aborted) {
                    setStatus('error')
                }
            })
    }, [
        isOwnProfile,
        targetProfileId,
        visitorZone,
        targetCiudad,
        targetDirection,
        targetCategories,
        currentUserId,
        visitorPropertyType,
    ])

    // Trigger fetch when in view
    useEffect(() => {
        if (inView && status === 'idle') {
            executeFetch()
        }
    }, [inView, status, executeFetch])

    // Telemetry impression tracking (R9)
    useEffect(() => {
        if (status === 'ok' && data && !hasTrackedImpressionRef.current) {
            hasTrackedImpressionRef.current = true
            trackSimilarProfilesImpression({
                visitedProfileId: targetProfileId,
                categoryName: data.basis.categoryName,
                zoneSource: data.basis.zoneSource,
                resultsCount: data.items.length,
                farthestTier: data.basis.farthestTier,
            })
        }
    }, [status, data, targetProfileId])

    // Render states
    if (status === 'idle') {
        return <div ref={sentinelRef} style={{ minHeight: 1 }} aria-hidden="true" />
    }

    if (status === 'loading') {
        return <SimilarProfilesSkeleton count={3} />
    }

    if (status === 'vacio') {
        return null
    }

    if (status === 'error') {
        return (
            <div className={styles.ErrorContainer} role="region" aria-label="Aviso de opciones">
                <p className={styles.ErrorText}>No pudimos cargar profesionales recomendados en este momento.</p>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={executeFetch}
                    className={styles.RetryButton || ''}
                    aria-label="Reintentar cargar profesionales recomendados"
                >
                    Reintentar
                </Button>
            </div>
        )
    }

    if (!data || data.items.length === 0) {
        return null
    }

    const { title, subtitle } = sectionTitle(data)

    const viewAllParams = new URLSearchParams()
    if (data.basis.categoryName) {
        viewAllParams.set('cat', data.basis.categoryName)
    }
    if (data.basis.zoneName) {
        viewAllParams.set('zona', data.basis.zoneName.toLowerCase().trim())
    }
    const viewAllUrl = `/app/portal-servicios?${viewAllParams.toString()}`

    return (
        <section
            className={styles.SimilarProfilesContainer}
            aria-labelledby="similar-profiles-title"
        >
            <div className={styles.Header}>
                <h2 id="similar-profiles-title" className={styles.Title}>
                    {title}
                </h2>
                <p className={styles.Subtitle}>
                    {subtitle}
                </p>
            </div>

            <div className={styles.Grid}>
                {data.items.map((item, index) => {
                    const reasonLabels = item.reasons.map(
                        (r) => SIMILAR_PROFILES_CONFIG.reasonLabels[r] || r
                    )

                    return (
                        <div key={item.profileId} className={styles.CardWrapper}>
                            <UserCard
                                userId={item.profileId}
                                userName={item.displayName}
                                userRazonSocial={item.userRazonSocial}
                                userProfession={item.userProfession}
                                userPhotoUrl={item.userPhotoUrl}
                                userCategories={[...item.userCategories]}
                                userClasification={item.userClasification}
                                variant="compact"
                                isFeatured={item.featured}
                                reasonLabels={reasonLabels}
                                onCardClick={() => {
                                    trackSimilarProfilesCardClick({
                                        visitedProfileId: targetProfileId,
                                        targetProfileId: item.profileId,
                                        position: index + 1,
                                        tier: item.tier,
                                        primaryReason: item.reasons[0],
                                        isFeatured: item.featured,
                                    })
                                }}
                                onQuoteClick={() => {
                                    trackSimilarProfilesQuoteClick({
                                        visitedProfileId: targetProfileId,
                                        targetProfileId: item.profileId,
                                        position: index + 1,
                                    })
                                }}
                            />
                        </div>
                    )
                })}
            </div>

            <div className={styles.ViewAllWrapper}>
                <a
                    href={viewAllUrl}
                    className={styles.ViewAllLink}
                    onMouseEnter={() => prefetchProfileRoute(viewAllUrl)}
                    onFocus={() => prefetchProfileRoute(viewAllUrl)}
                    onClick={() => {
                        trackSimilarProfilesViewAllClick({
                            visitedProfileId: targetProfileId,
                            categoryName: data.basis.categoryName,
                            zoneName: data.basis.zoneName,
                        })
                    }}
                    aria-label={`Ver todos los profesionales de ${data.basis.categoryName}${
                        data.basis.zoneName ? ` en ${data.basis.zoneName}` : ''
                    }`}
                >
                    Ver todos los profesionales de {data.basis.categoryName}
                    {data.basis.zoneName ? ` en ${data.basis.zoneName}` : ''} →
                </a>
            </div>
        </section>
    )
}

export default SimilarProfilesSection

