/**
 * Slugify Utility
 *
 * Converts arbitrary text into a URL-friendly, lowercase, accent-free slug.
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}
