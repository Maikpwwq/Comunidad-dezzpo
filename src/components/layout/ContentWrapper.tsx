/**
 * ContentWrapper Component
 *
 * Generic content container with search bar and actions.
 * Migrated from src/app/components/Content.jsx
 */

import React, { useState, useCallback } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'

export interface ContentWrapperProps {
    /** Content to display in the main area */
    children?: React.ReactNode
    /** Placeholder text for search */
    searchPlaceholder?: string
    /** Empty state message */
    emptyMessage?: string
    /** Show search bar */
    showSearch?: boolean
    /** Show add button */
    showAddButton?: boolean
    /** Add button label */
    addButtonLabel?: string
    /** Callback for add button */
    onAdd?: () => void
    /** Callback for refresh */
    onRefresh?: () => void
    /** Callback for search */
    onSearch?: (query: string) => void
    /** Max width of the container */
    maxWidth?: number
}

export function ContentWrapper({
    children,
    searchPlaceholder = 'Search...',
    emptyMessage = 'No content available',
    showSearch = true,
    showAddButton = true,
    addButtonLabel = 'Add',
    onAdd,
    onRefresh,
    onSearch,
    maxWidth = 936,
}: ContentWrapperProps): React.ReactElement {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value
            setSearchQuery(query)
            onSearch?.(query)
        },
        [onSearch]
    )

    const handleRefresh = useCallback(() => {
        onRefresh?.()
    }, [onRefresh])

    return (
        <Paper sx={{ maxWidth, margin: 'auto', overflow: 'hidden' }}>
            {showSearch && (
                <AppBar
                    position="static"
                    color="default"
                    elevation={0}
                    sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
                >
                    <Toolbar>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <SearchIcon color="inherit" sx={{ display: 'block' }} />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    placeholder={searchPlaceholder}
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: { fontSize: 'default' },
                                    }}
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item>
                                {showAddButton && (
                                    <Button
                                        variant="contained"
                                        sx={{ mr: 1 }}
                                        onClick={onAdd}
                                    >
                                        {addButtonLabel}
                                    </Button>
                                )}
                                <Tooltip title="Reload">
                                    <IconButton onClick={handleRefresh}>
                                        <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            )}

            {children || (
                <Typography
                    sx={{ my: 5, mx: 2 }}
                    color="text.secondary"
                    align="center"
                >
                    {emptyMessage}
                </Typography>
            )}
        </Paper>
    )
}

export default ContentWrapper
