/**
 * ProfileGallery Component
 * 
 * Displays the merchant or professional's work portfolio / project gallery.
 * Supports structured projects with Before/After comparisons (ADR Option C)
 * and provides legacy fallback for existing userGalleryUrl images.
 */
import React, { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import {
    Box,
    Typography,
    Button,
    Chip,
    Card,
    CardContent,
} from '@mui/material'
import { Row, Col } from 'react-bootstrap'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import VerifiedIcon from '@mui/icons-material/Verified'
import { AdjuntarArchivos } from '@components/common'
import { ProjectFormModal } from './ProjectFormModal'
import { getProjectsByComerciante } from '@services/projects'
import type { ProjectFirestoreDocument } from '@services/projects'
import type { UserRole } from '@services/types'
import styles from './ProfileGallery.module.scss'

export interface ProfileGalleryProps {
    images?: string[]
    userName?: string
    isOwnProfile: boolean
    currentUserId?: string | null
    viewerRole?: UserRole | null
    profileTier?: 'free' | 'destacado'
    onUpdateUserInfo: React.Dispatch<React.SetStateAction<any>>
    userInfoState: Record<string, unknown>
}

export const ProfileGallery: React.FC<ProfileGalleryProps> = ({
    images = [],
    userName = 'comercio',
    isOwnProfile,
    currentUserId,
    viewerRole,
    profileTier = 'free',
    onUpdateUserInfo,
    userInfoState,
}) => {
    const [structuredProjects, setStructuredProjects] = useState<ProjectFirestoreDocument[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchProjects = useCallback(async () => {
        if (!currentUserId) return
        try {
            const res = await getProjectsByComerciante(currentUserId)
            if (res.success && res.data) {
                setStructuredProjects(res.data)
            }
        } catch (err) {
            console.warn('[ProfileGallery] Error loading projects:', err)
        }
    }, [currentUserId])

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleProjectCreated = (newProject: ProjectFirestoreDocument) => {
        setStructuredProjects((prev) => [newProject, ...prev])
    }

    const hasStructured = structuredProjects.length > 0
    const hasLegacy = images.length > 0

    if (!hasStructured && !hasLegacy && !isOwnProfile) {
        return null
    }

    const isAnnualMember = profileTier === 'destacado'

    return (
        <div className="w-100">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 4, pb: 2 }}>
                <Typography variant="h5" className={clsx(styles.SectionTitle)} align="left">
                    Proyectos y Portafolio
                </Typography>

                {isOwnProfile && currentUserId && (
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AutoAwesomeIcon />}
                        onClick={() => setIsModalOpen(true)}
                        sx={{
                            textTransform: 'none',
                            bgcolor: '#0d9488',
                            '&:hover': { bgcolor: '#0f766e' },
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                    >
                        Publicar Proyecto (Antes / Después)
                    </Button>
                )}
            </Box>

            {/* Structured Projects (ADR Option C) */}
            {hasStructured && (
                <Row className="w-100 g-4 pb-3 m-0">
                    {structuredProjects.map((project) => (
                        <Col key={project.projectId} lg={6} md={6} xs={12} className="p-2">
                            <Card
                                elevation={0}
                                sx={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'box-shadow 0.2s',
                                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
                                }}
                            >
                                {/* Before / After comparison if present */}
                                {project.beforeAfterPairs && project.beforeAfterPairs.length > 0 ? (
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, bgcolor: '#0f172a' }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <Box
                                                component="img"
                                                src={project.beforeAfterPairs[0].beforeUrl}
                                                alt="Antes"
                                                sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                                            />
                                            <Chip
                                                label="ANTES"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    left: 8,
                                                    bgcolor: 'rgba(0,0,0,0.7)',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.68rem',
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ position: 'relative' }}>
                                            <Box
                                                component="img"
                                                src={project.beforeAfterPairs[0].afterUrl}
                                                alt="Después"
                                                sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                                            />
                                            <Chip
                                                label="DESPUÉS"
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    fontWeight: 'bold',
                                                    fontSize: '0.68rem',
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ) : project.galleryUrls && project.galleryUrls.length > 0 ? (
                                    <Box
                                        component="img"
                                        src={project.galleryUrls[0]}
                                        alt={project.title}
                                        sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                                    />
                                ) : null}

                                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={project.category}
                                            size="small"
                                            sx={{ bgcolor: '#f1f5f9', fontWeight: 600, fontSize: '0.72rem' }}
                                        />
                                        <Chip
                                            label={project.zone}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: '0.72rem' }}
                                        />
                                        {project.clientConsent?.granted && (
                                            <Chip
                                                icon={<VerifiedIcon style={{ fontSize: 13, color: '#0d9488' }} />}
                                                label="Autorizado por cliente"
                                                size="small"
                                                sx={{ bgcolor: '#f0fdfa', color: '#0d9488', fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Box>

                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 0.5 }}>
                                        {project.title}
                                    </Typography>

                                    {project.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                            {project.description}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Legacy gallery fallback */}
            {hasLegacy && (
                <>
                    {hasStructured && (
                        <Typography variant="subtitle2" color="text.secondary" sx={{ pt: 2, pb: 1 }}>
                            Otras fotos del portafolio
                        </Typography>
                    )}
                    <Row className="w-100 g-4 pb-3 m-0">
                        {images.map((imagen: string, index: number) => (
                            <Col
                                key={`gallery-${index}`}
                                lg={images.length === 1 ? 8 : 6}
                                md={6}
                                xs={12}
                                className="p-2"
                            >
                                <Box className={clsx(styles.GalleryCard)}>
                                    <Box
                                        component="img"
                                        src={imagen || ''}
                                        alt={`Publicación ${index + 1} de ${userName}`}
                                        className={clsx(styles.GalleryImage)}
                                    />
                                </Box>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {!hasStructured && !hasLegacy && (
                <Typography variant="body2" className="body-2 mb-3" style={{ color: '#888' }}>
                    No hay proyectos ni imágenes publicadas en el portafolio.
                </Typography>
            )}

            {/* Fast upload button for legacy photos if owner */}
            {isOwnProfile && currentUserId && (
                <Box sx={{ mt: 2, mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <AdjuntarArchivos
                        name="galleryPhoto"
                        multiple={true}
                        idPerson={currentUserId}
                        rol={viewerRole}
                        route={`profiles/${currentUserId}`}
                        functionState={onUpdateUserInfo}
                        state={userInfoState}
                    />
                </Box>
            )}

            {/* Project Creation Wizard Modal */}
            {currentUserId && (
                <ProjectFormModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    comercianteId={currentUserId}
                    isAnnualMember={isAnnualMember}
                    existingProjectsCount={structuredProjects.length}
                    onProjectCreated={handleProjectCreated}
                />
            )}
        </div>
    )
}
