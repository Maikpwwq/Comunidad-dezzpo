/**
 * Projects Feature Index
 *
 * Service project request and category management.
 *
 * @example
 * ```tsx
 * import { ProjectSearchForm, CategorySelector, SubCategoryCard } from '@features/projects'
 * import type { ProjectDraftInfo, CategoryItem } from '@features/projects'
 * ```
 */

// Components
export * from './components'

// Types
export type {
    CategoryItem,
    SubCategoryItem,
    ProjectDraftInfo,
    CategorySelectionState,
    ProjectType,
} from './types'

export { PROJECT_TYPES } from './types'
