/**
 * ContactInfoCard Component
 * 
 * Displays direct communication channels (verified/primary emails and formatted phones).
 */
import React from 'react'
import clsx from 'clsx'
import { Box, Typography } from '@mui/material'
import MailIcon from '@mui/icons-material/Mail'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import type { ContactEmail, ContactPhone } from '@services/types'
import styles from './ContactInfoCard.module.scss'

export interface ContactInfoCardProps {
    emails?: ContactEmail[]
    phones?: ContactPhone[]
    userMail?: string | null
    userPhone?: string | null
    className?: string
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
    emails = [],
    phones = [],
    userMail = '',
    userPhone = '',
    className
}) => {
    const activeEmails = emails.filter((e) => e.address && e.address.trim() !== '')
    const displayEmails = activeEmails.length > 0
        ? activeEmails
        : (userMail ? [{ address: userMail, isPrimary: true, verified: false }] : [])

    const activePhones = phones.filter((p) => p.number && p.number.trim() !== '')
    const displayPhones = activePhones.length > 0
        ? activePhones
        : (userPhone ? [{ number: userPhone, isPrimary: true, type: 'personal' as const }] : [])

    const hasContacts = displayEmails.length > 0 || displayPhones.length > 0

    if (!hasContacts) {
        return (
            <Typography variant="body2" className="body-2" style={{ color: '#888' }}>
                No hay canales directos de contacto registrados
            </Typography>
        )
    }

    return (
        <Box className={clsx(styles.ContactCard, className)}>
            {displayEmails.length > 0 && (
                <div className={styles.ContactGroup}>
                    <span className={styles.ContactGroupTitle}>
                        Correos electrónicos
                    </span>
                    <div className={styles.ContactList}>
                        {displayEmails.map((email, idx) => (
                            <a
                                key={`email-${idx}`}
                                href={`mailto:${email.address}`}
                                className={styles.ContactItemLink}
                                aria-label={`Enviar correo a ${email.address}`}
                            >
                                <MailIcon className={styles.ContactItemIcon || ''} />
                                <span className={styles.ContactItemText}>{email.address}</span>
                                {email.isPrimary && (
                                    <span className={styles.ContactPrimaryBadge}>Principal</span>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {displayPhones.length > 0 && (
                <div className={styles.ContactGroup}>
                    <span className={styles.ContactGroupTitle}>
                        Teléfonos de contacto
                    </span>
                    <div className={styles.ContactList}>
                        {displayPhones.map((phone, idx) => {
                            const cleanPhone = phone.number.replace(/\s+/g, '')
                            return (
                                <a
                                    key={`phone-${idx}`}
                                    href={`tel:${cleanPhone}`}
                                    className={styles.ContactItemLink}
                                    aria-label={`Llamar al teléfono ${phone.number}`}
                                >
                                    <PhoneIphoneIcon className={styles.ContactItemIcon || ''} />
                                    <span className={styles.ContactItemText}>{phone.number}</span>
                                    {phone.type === 'trabajo' && (
                                        <span className={styles.ContactTypeBadge}>Trabajo</span>
                                    )}
                                    {phone.isPrimary && (
                                        <span className={styles.ContactPrimaryBadge}>Principal</span>
                                    )}
                                </a>
                            )
                        })}
                    </div>
                </div>
            )}
        </Box>
    )
}
