/**
 * Unified Inspiration Board Types (R7-T4, I1 & I4)
 *
 * Unifies "Libro de ideas" (I1) and "Moodboards de clientes" (I4) into a single entity.
 */

export type InspirationItemType = 'project_image' | 'catalog_item' | 'color_palette'

export interface InspirationItem {
    readonly id: string
    readonly type: InspirationItemType
    readonly url: string
    readonly title?: string
    readonly sourceProjectId?: string
    readonly notes?: string
    readonly addedAt: string
}

export interface InspirationBoard {
    readonly boardId: string
    readonly ownerId: string
    readonly title: string
    readonly description?: string
    readonly isPublic: boolean
    readonly items: InspirationItem[]
    readonly linkedDraftId?: string
    readonly createdAt: string
    readonly updatedAt: string
}

export interface CreateInspirationBoardParams {
    readonly ownerId: string
    readonly title: string
    readonly description?: string
    readonly isPublic?: boolean
}
