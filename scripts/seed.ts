/**
 * Seed Script — Dezzpo RAG Knowledge Base
 *
 * Pipeline: Firecrawl (scrape) → Chunk → Google Embeddings (768d) → Supabase upsert
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Requires env vars:
 *   FIRECRAWL_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY,
 *   VITE_APP_SUPABASE_PROJECT_URL, VITE_APP_SUPABASE_SECRET_KEY
 */

import 'dotenv/config'

// Bridge VITE_APP_ env vars to the names expected by the AI SDK
process.env.GOOGLE_GENERATIVE_AI_API_KEY ??= process.env.VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY

import FirecrawlApp from '@mendable/firecrawl-js'
import { createClient } from '@supabase/supabase-js'
import { google } from '@ai-sdk/google'
import { embedMany } from 'ai'

// ── Config ───────────────────────────────────────────────────────────────────

const TARGET_URL = 'https://comunidad-dezzpo.vercel.app'
const CHUNK_SIZE = 800   // chars per chunk (sweet spot for embedding quality)
const CHUNK_OVERLAP = 100 // overlap to preserve context across boundaries

// ── Clients ──────────────────────────────────────────────────────────────────

const firecrawl = new FirecrawlApp({
    apiKey: process.env.VITE_APP_FIRECRAWL_API_KEY!,
})

const supabase = createClient(
    process.env.VITE_APP_SUPABASE_PROJECT_URL!,
    process.env.VITE_APP_SUPABASE_SECRET_KEY!
)

// ── Chunk Splitter ───────────────────────────────────────────────────────────

interface Chunk {
    content: string
    metadata: {
        url: string
        pathname: string
        title: string
        chunkIndex: number
    }
}

function splitIntoChunks(
    text: string,
    url: string,
    title: string
): Chunk[] {
    // Derive pathname from URL
    let pathname = '/'
    try {
        pathname = new URL(url).pathname
    } catch { /* keep default */ }

    const chunks: Chunk[] = []
    let start = 0
    let chunkIndex = 0

    while (start < text.length) {
        const end = Math.min(start + CHUNK_SIZE, text.length)
        const content = text.slice(start, end).trim()

        if (content.length > 50) { // Skip tiny fragments
            chunks.push({
                content,
                metadata: { url, pathname, title, chunkIndex },
            })
        }

        start += CHUNK_SIZE - CHUNK_OVERLAP
        chunkIndex++
    }

    return chunks
}

// ── Main Pipeline ────────────────────────────────────────────────────────────

async function seed() {
    console.log('🔥 [1/4] Scraping with Firecrawl...')

    // Crawl the site — Firecrawl v4 uses the v1 namespace
    const crawlResult = await firecrawl.v1.crawlUrl(TARGET_URL, {
        limit: 30,
        scrapeOptions: {
            formats: ['markdown'],
        },
    })

    if (!crawlResult.success) {
        console.error('❌ Firecrawl failed:', crawlResult)
        process.exit(1)
    }

    const pages = crawlResult.data || []
    console.log(`   ✓ Scraped ${pages.length} pages`)

    // Chunk all pages
    console.log('📄 [2/4] Chunking documents...')
    const allChunks: Chunk[] = []

    for (const page of pages) {
        const content = page.markdown || ''
        const url = page.metadata?.sourceURL || page.metadata?.url || TARGET_URL
        const title = page.metadata?.title || 'Comunidad Dezzpo'

        const chunks = splitIntoChunks(content, url, title)
        allChunks.push(...chunks)
    }
    console.log(`   ✓ Created ${allChunks.length} chunks`)

    if (allChunks.length === 0) {
        console.log('⚠️  No chunks to embed. Check if Firecrawl returned content.')
        process.exit(0)
    }

    // Generate embeddings in batches (Google API limits ~100 per request)
    console.log('🧠 [3/4] Generating embeddings with Google Text Embedding 004...')
    const BATCH_SIZE = 50
    const allEmbeddings: number[][] = []

    for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
        const batch = allChunks.slice(i, i + BATCH_SIZE)
        const { embeddings } = await embedMany({
            model: (google.textEmbeddingModel as any)('gemini-embedding-001', {
                outputDimensionality: 768,
            }),
            values: batch.map((c) => c.content),
        })
        allEmbeddings.push(...embeddings)
        console.log(`   ✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allChunks.length / BATCH_SIZE)}`)
    }

    // Upsert to Supabase
    console.log('💾 [4/4] Upserting to Supabase (dezzpo_documents)...')

    // Clear existing data for a clean seed
    await supabase.from('dezzpo_documents').delete().neq('id', 0)

    const rows = allChunks.map((chunk, i) => ({
        content: chunk.content,
        metadata: chunk.metadata,
        embedding: JSON.stringify(allEmbeddings[i]),
    }))

    // Insert in batches of 100 (Supabase row limit per request)
    for (let i = 0; i < rows.length; i += 100) {
        const batch = rows.slice(i, i + 100)
        const { error } = await supabase.from('dezzpo_documents').insert(batch)
        if (error) {
            console.error(`❌ Supabase insert error (batch ${i}):`, error)
            process.exit(1)
        }
    }

    console.log(`\n✅ Seed complete! ${rows.length} documents inserted into dezzpo_documents.`)
    console.log('   Verify in Supabase Dashboard → Table Editor → dezzpo_documents')
}

seed().catch((err) => {
    console.error('💥 Seed failed:', err)
    process.exit(1)
})
