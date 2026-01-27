import React, { useEffect, useState } from 'react'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import TagFacesIcon from '@mui/icons-material/TagFaces'
import { styled } from '@mui/material/styles'

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}))

export interface CategoryItem {
    key: number
    label: string
    variant?: 'filled' | 'outlined'
    icon?: React.ReactNode
    [key: string]: any
}

interface ChipsCategoriesProps {
    setUserEditInfo?: (info: any) => void
    userEditInfo?: {
        userCategories: string[]
        [key: string]: any
    }
    listadoCategorias: CategoryItem[]
    editableContent?: boolean
    saved?: boolean
}

export const ChipsCategories: React.FC<ChipsCategoriesProps> = ({
    setUserEditInfo,
    userEditInfo,
    listadoCategorias,
    editableContent = true,
    saved,
}) => {
    // Initialize local state based on props
    const [categoriesState, setCategoriesState] = useState<CategoryItem[]>([])

    // Sync state when props change or component mounts
    useEffect(() => {
        if (listadoCategorias && userEditInfo?.userCategories) {
            const initialCategories: CategoryItem[] = listadoCategorias.map(cat => ({
                key: cat.key,
                label: cat.label,
                icon: cat.icon,
                variant: userEditInfo.userCategories.includes(cat.label) ? 'filled' : 'outlined'
            }))
            setCategoriesState(initialCategories)
        }
    }, [listadoCategorias, userEditInfo?.userCategories, saved]) // Re-sync on save or prop change

    // Handle click events
    const handleClick = (e: React.MouseEvent, key: number) => {
        e.preventDefault()
        if (!editableContent) return

        const categoryIndex = categoriesState.findIndex(c => c.key === key)
        if (categoryIndex === -1) return

        const currentCategory = categoriesState[categoryIndex]
        const isSelected = currentCategory.variant === 'filled'

        let newCategories = [...categoriesState]

        if (!isSelected) {
            // Check limit
            const currentSelectedCount = categoriesState.filter(c => c.variant === 'filled').length
            if (currentSelectedCount < 4) {
                newCategories[categoryIndex] = { ...currentCategory, variant: 'filled' } as CategoryItem
            } else {
                return // Limit reached
            }
        } else {
            // Deselect
            newCategories[categoryIndex] = { ...currentCategory, variant: 'outlined' } as CategoryItem
        }

        setCategoriesState(newCategories)

        // Update parent
        if (setUserEditInfo && userEditInfo) {
            const selectedLabels = newCategories
                .filter(c => c.variant === 'filled')
                .map(c => c.label)

            setUserEditInfo({
                ...userEditInfo,
                userCategories: selectedLabels
            })
        }
    }

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'row !important',
                justifyContent: 'center !important',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
                width: '100% !important',
                overflow: 'auto',
                boxShadow: 'none', // Optional: cleaner look
                backgroundColor: 'transparent' // Optional match
            }}
            component="ul"
        >
            {categoriesState.map((data) => {
                const IconToRender = (data.label === 'React' ? <TagFacesIcon /> : data.icon) as React.ReactElement | undefined
                return (
                    <ListItem key={data.key}>
                        <Chip
                            // className="caption"
                            icon={IconToRender}
                            color="primary"
                            label={data.label}
                            variant={data.variant || 'outlined'}
                            onClick={(e) => handleClick(e, data.key)}
                            disabled={!editableContent}
                        />
                    </ListItem>
                )
            })}
        </Paper >
    )
}

export default ChipsCategories
