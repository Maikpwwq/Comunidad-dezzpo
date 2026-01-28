/**
 * Projects Feature Index
 *
 * Service project request and category management.
 *
 * @example
 * ```tsx
 * import { ProjectSearchForm, CategorySelector, SubCategoryCard, ProjectSearchBar, CategorySelect } from '@features/projects'
 * import type { ProjectDraftInfo, CategoryItem } from '@features/projects'
 * ```
 */

// Components
export * from './components'
export * from './components/CategorySelect'
export * from './components/ProjectSearchBar'

// Types
export type {
    CategoryItem,
    SubCategoryItem,
    ProjectDraftInfo,
    CategorySelectionState,
    ProjectType,
} from './types'

export { PROJECT_TYPES } from './types'
