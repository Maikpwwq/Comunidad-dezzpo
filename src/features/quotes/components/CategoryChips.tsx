/**
 * CategoryChips Component
 *
 * Selectable category chips for user profiles and quotes.
 * Migrated from src/app/components/ChipsCategories.jsx
 */

import React, { useEffect, useState, useCallback } from 'react'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}))

export interface CategoryData {
    key: number
    label: string
    variant: 'outlined' | 'filled'
    icon?: React.ReactElement
}

export interface UserEditInfo {
    userCategories?: string[]
    [key: string]: unknown
}

export interface CategoryChipsProps {
    /** List of available categories */
    listadoCategorias: CategoryData[]
    /** Current user edit info */
    userEditInfo?: UserEditInfo
    /** Callback to update user edit info */
    setUserEditInfo?: (info: UserEditInfo) => void
    /** Whether chips are editable */
    editableContent?: boolean
    /** Whether content has been saved */
    saved?: boolean
    /** Max number of selectable categories */
    maxSelections?: number
}

export function CategoryChips({
    listadoCategorias,
    userEditInfo,
    setUserEditInfo,
    editableContent = true,
    saved = false,
    maxSelections = 4,
}: CategoryChipsProps): React.ReactElement {
    const [chipData, setChipData] = useState({
        categorias: listadoCategorias,
        selected: {
            numbers: [] as number[],
            labels: userEditInfo?.userCategories || [],
        },
    })

    // Sync selected categories to parent
    useEffect(() => {
        if (userEditInfo && setUserEditInfo && chipData.selected.labels.length > 0) {
            setUserEditInfo({
                ...userEditInfo,
                userCategories: chipData.selected.labels,
            })
        }
    }, [chipData.selected.labels, saved])

    const handleClick = useCallback(
        (e: React.MouseEvent, numero: number) => {
            e.preventDefault()
            if (!editableContent) return

            const selectedLabels = [...chipData.selected.labels]
            const selectedNumbers = [...chipData.selected.numbers]
            const isCurrentlySelected = chipData.categorias[numero]?.variant === 'filled'

            if (!isCurrentlySelected) {
                // Select
                if (selectedNumbers.length >= maxSelections) return

                const selectLabel = listadoCategorias[numero]?.label
                if (selectLabel) {
                    setChipData(prev => ({
                        ...prev,
                        categorias: prev.categorias.map((cat, i) =>
                            i === numero ? { ...cat, variant: 'filled' } : cat
                        ),
                        selected: {
                            numbers: [...selectedNumbers, numero],
                            labels: [...selectedLabels, selectLabel],
                        },
                    }))
                }
            } else {
                // Deselect
                const labelToRemove = listadoCategorias[numero]?.label
                setChipData(prev => ({
                    ...prev,
                    categorias: prev.categorias.map((cat, i) =>
                        i === numero ? { ...cat, variant: 'outlined' } : cat
                    ),
                    selected: {
                        numbers: selectedNumbers.filter(n => n !== numero),
                        labels: selectedLabels.filter(l => l !== labelToRemove),
                    },
                }))
            }
        },
        [chipData, editableContent, listadoCategorias, maxSelections]
    )

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
                width: '100%',
                overflow: 'auto',
            }}
            component="ul"
        >
            {chipData.categorias?.map((data) => (
                <ListItem key={data.key}>
                    <Chip
                        className="caption"
                        {...(data.icon && { icon: data.icon })}
                        color="primary"
                        label={data.label}
                        variant={data.variant}
                        onClick={(e: React.MouseEvent) => handleClick(e, data.key)}
                        sx={{
                            cursor: editableContent ? 'pointer' : 'default',
                        }}
                    />
                </ListItem>
            ))}
        </Paper>
    )
}

export default CategoryChips
