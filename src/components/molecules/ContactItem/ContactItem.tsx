import React from 'react'
import IcoMoon from 'react-icomoon'
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
import iconSet from '@assets/icomoon/selection.json'
import clsx from 'clsx'
import styles from './ContactItem.module.scss'
import { contactConfig } from '@config/contactConfig'

export interface ContactItemProps {
    type: keyof typeof contactConfig
    variant: 'footer' | 'page'
    className?: string
}

export const ContactItem = ({ type, variant, className }: ContactItemProps) => {
    const data = contactConfig[type]

    // Determine content to render
    const renderContent = () => {
        if (variant === 'page' && 'fullAddress' in data) {
            return (data as any).fullAddress.map((line: string, i: number) => (
                <span key={i} className="d-block">{line}</span>
            ))
        }
        return data.display
    }

    return (
        <a
            href={data.link}
            className={clsx(styles['contact-link'], styles[`variant-${variant}`], className)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <span className={styles.icon}>
                <IcoMoon
                    iconSet={iconSet as any}
                    icon={data.icon}
                    style={{ width: '1em', height: '1em' }}
                />
            </span>
            <span className={clsx(variant === 'footer' ? 'body-2' : 'headline-s', styles.text)}>
                {renderContent()}
            </span>
        </a>
    )
}

export default ContactItem
