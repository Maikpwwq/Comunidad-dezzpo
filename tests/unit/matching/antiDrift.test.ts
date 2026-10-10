/**
 * Anti-Drift Test for docs/matching.md
 *
 * Ensures that docs/matching.md is always strictly in sync with the current
 * code in src/config/matching.config.ts and ListadoCategorias.
 *
 * If this test fails, run:
 * pnpm exec tsx scripts/generate-matching-docs.ts
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildMatchingMarkdown } from '../../../scripts/generate-matching-docs'

describe('AC-1 Anti-Drift Verification: docs/matching.md', () => {
    it('docs/matching.md exists on disk', () => {
        const filePath = resolve(process.cwd(), 'docs/matching.md')
        expect(existsSync(filePath)).toBe(true)
    })

    it('docs/matching.md content exactly matches buildMatchingMarkdown() output', () => {
        const filePath = resolve(process.cwd(), 'docs/matching.md')
        const onDisk = readFileSync(filePath, 'utf-8')
        const expected = buildMatchingMarkdown()

        expect(onDisk).toBe(expected)
    })
})
