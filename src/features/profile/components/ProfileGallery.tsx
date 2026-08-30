/**
 * ProfileGallery Component
 * 
 * Displays the merchant or professional's work portfolio / project gallery
 * and provides upload actions for the profile owner.
 */
import React from 'react'
import clsx from 'clsx'
import { Box, Typography } from '@mui/material'
import { Row, Col } from 'react-bootstrap'
import { AdjuntarArchivos } from '@components/common'
import type { UserRole } from '@services/types'
import styles from './ProfileGallery.module.scss'

export interface ProfileGalleryProps {
    images?: string[]
    userName?: string
    isOwnProfile: boolean
    currentUserId?: string | null
    viewerRole?: UserRole | null
    onUpdateUserInfo: React.Dispatch<React.SetStateAction<any>>
    userInfoState: Record<string, unknown>
}

export const ProfileGallery: React.FC<ProfileGalleryProps> = ({
    images = [],
    userName = 'comercio',
    isOwnProfile,
    currentUserId,
    viewerRole,
    onUpdateUserInfo,
    userInfoState
}) => {
    if (images.length === 0 && !isOwnProfile) {
        return null
    }

    return (
        <div className="w-100">
            <Typography
                variant="h5"
                className={clsx(styles.SectionTitle, 'pt-4 pb-3 w-100')}
                align="left"
            >
                Portafolio
            </Typography>

            {images.length > 0 ? (
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
            ) : (
                <Typography variant="body2" className="body-2 mb-3" style={{ color: '#888' }}>
                    No hay imágenes publicadas en el portafolio
                </Typography>
            )}

            {isOwnProfile && currentUserId && (
                <div className="mt-2 mb-4">
                    <AdjuntarArchivos
                        name="galleryPhoto"
                        multiple={true}
                        idPerson={currentUserId}
                        rol={viewerRole}
                        route={`profiles/${currentUserId}`}
                        functionState={onUpdateUserInfo}
                        state={userInfoState}
                    />
                </div>
            )}
        </div>
    )
}
