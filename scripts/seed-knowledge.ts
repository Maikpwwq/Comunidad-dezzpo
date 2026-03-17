/**
 * Seed Knowledge Script — Dezzpo RAG
 *
 * Reads markdown files from knowledge/ folder and embeds them into
 * Supabase dezzpo_documents alongside the crawled data.
 *
 * Each ## section becomes a separate chunk for precise retrieval.
 *
 * Usage: npx tsx scripts/seed-knowledge.ts
 *
 * To add more knowledge:
 *   1. Edit knowledge/dezzpo-core.md (or add new .md files)
 *   2. Re-run this script
 */

import 'dotenv/config'

// Bridge VITE_APP_ env vars
process.env.GOOGLE_GENERATIVE_AI_API_KEY ??= process.env.VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY

import { createClient } from '@supabase/supabase-js'
import { google } from '@ai-sdk/google'
import { embedMany } from 'ai'
import * as fs from 'fs'
import * as path from 'path'

// ── Config ───────────────────────────────────────────────────────────────────

const KNOWLEDGE_DIR = path.resolve(process.cwd(), 'knowledge')
const TARGET_DIMS = 768
const BATCH_SIZE = 10  // Small batches for free-tier rate limits
const BASE_URL = 'https://comunidad-dezzpo.vercel.app'

// ── Clients ──────────────────────────────────────────────────────────────────

const supabase = createClient(
    process.env.VITE_APP_SUPABASE_PROJECT_URL!,
    process.env.VITE_APP_SUPABASE_SECRET_KEY!
)

// ── Parse markdown into chunks ──────────────────────────────────────────────

interface KnowledgeChunk {
    content: string
    metadata: {
        url: string
        pathname: string
        title: string
        source: string
        chunkIndex: number
    }
}

function parseMarkdownSections(filePath: string): KnowledgeChunk[] {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const fileName = path.basename(filePath, '.md')

    // Split on ## headers (level 2)
    const sections = raw.split(/^## /gm).filter(Boolean)
    const chunks: KnowledgeChunk[] = []

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i].trim()
        if (!section || section.startsWith('>') || section.length < 30) continue

        // Extract title from first line
        const firstNewline = section.indexOf('\n')
        const title = firstNewline > 0
            ? section.slice(0, firstNewline).trim()
            : section.slice(0, 80).trim()
        const content = section

        // Guess pathname from title
        const pathname = guessPathname(title)

        chunks.push({
            content: `## ${content}`,
            metadata: {
                url: `${BASE_URL}${pathname}`,
                pathname,
                title,
                source: `knowledge/${fileName}.md`,
                chunkIndex: i,
            },
        })
    }

    return chunks
}

function guessPathname(title: string): string {
    const lower = title.toLowerCase()
    if (lower.includes('contacto') || lower.includes('teléfono') || lower.includes('email')) return '/contactenos'
    if (lower.includes('misión')) return '/nosotros'
    if (lower.includes('visión')) return '/nosotros'
    if (lower.includes('política') || lower.includes('hseq')) return '/nosotros'
    if (lower.includes('valores')) return '/nosotros'
    if (lower.includes('qué es')) return '/nosotros'
    if (lower.includes('historia')) return '/nosotros'
    if (lower.includes('equipo')) return '/nosotros'
    if (lower.includes('presupuesto') || lower.includes('solicitud de servicio')) return '/presupuestos'
    if (lower.includes('certificación')) return '/asi-trabajamos'
    if (lower.includes('calificacion')) return '/asi-trabajamos'
    if (lower.includes('propietario')) return '/asi-trabajamos'
    if (lower.includes('comerciante')) return '/asi-trabajamos'
    if (lower.includes('servicios') || lower.includes('portal') || lower.includes('directorio')) return '/app/portal-servicios'
    if (lower.includes('ayuda') || lower.includes('pqrs') || lower.includes('servicio al cliente')) return '/ayuda-pqrs'
    if (lower.includes('legal') || lower.includes('términos') || lower.includes('privacidad') || lower.includes('cookies')) return '/legal'
    if (lower.includes('requerimiento') || lower.includes('nuevo proyecto')) return '/app/nuevo-proyecto'
    if (lower.includes('página') || lower.includes('sitio')) return '/'
    if (lower.includes('redes social')) return '/contactenos'
    return '/'
}

// ── Main Pipeline ────────────────────────────────────────────────────────────

async function seedKnowledge() {
    // 1. Read all .md files from knowledge/
    if (!fs.existsSync(KNOWLEDGE_DIR)) {
        console.error(`❌ Knowledge directory not found: ${KNOWLEDGE_DIR}`)
        process.exit(1)
    }

    const mdFiles = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'))
    console.log(`📚 Found ${mdFiles.length} knowledge file(s):`, mdFiles)

    // 2. Parse into chunks
    const allChunks: KnowledgeChunk[] = []
    for (const file of mdFiles) {
        const filePath = path.join(KNOWLEDGE_DIR, file)
        const chunks = parseMarkdownSections(filePath)
        allChunks.push(...chunks)
        console.log(`   ✓ ${file}: ${chunks.length} sections`)
    }

    if (allChunks.length === 0) {
        console.log('⚠️  No chunks found. Check your knowledge files.')
        process.exit(0)
    }
    console.log(`\n📄 Total: ${allChunks.length} knowledge chunks`)

    // 3. Delete old knowledge entries (preserve Firecrawl-scraped data)
    console.log('🗑️  Removing old knowledge entries...')
    const { error: delError } = await supabase
        .from('dezzpo_documents')
        .delete()
        .like('metadata->>source', 'knowledge/%')
    if (delError) console.warn('   ⚠️ Delete warning:', delError.message)

    // 4. Generate embeddings
    console.log(`🧠 Generating embeddings (gemini-embedding-001 → ${TARGET_DIMS}d)...`)
    const allEmbeddings: number[][] = []
    const totalBatches = Math.ceil(allChunks.length / BATCH_SIZE)

    for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
        const batch = allChunks.slice(i, i + BATCH_SIZE)
        const { embeddings } = await embedMany({
            model: google.textEmbeddingModel('gemini-embedding-001'),
            values: batch.map(c => c.content),
        })

        const truncated = embeddings.map(emb => emb.slice(0, TARGET_DIMS))
        allEmbeddings.push(...truncated)

        const batchNum = Math.floor(i / BATCH_SIZE) + 1
        console.log(`   ✓ Batch ${batchNum}/${totalBatches}`)

        // Rate-limit delay
        if (batchNum < totalBatches) {
            console.log('   ⏳ Waiting 35s (free-tier rate limit)...')
            await new Promise(r => setTimeout(r, 35_000))
        }
    }

    // 5. Insert into Supabase
    console.log('💾 Inserting into dezzpo_documents...')
    const rows = allChunks.map((chunk, i) => ({
        content: chunk.content,
        metadata: chunk.metadata,
        embedding: JSON.stringify(allEmbeddings[i]),
    }))

    for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50)
        const { error } = await supabase.from('dezzpo_documents').insert(batch)
        if (error) {
            console.error(`❌ Insert error:`, error)
            process.exit(1)
        }
    }

    console.log(`\n✅ Knowledge seed complete! ${rows.length} chunks inserted.`)
    console.log('   These supplement the Firecrawl-scraped data (not replaced).')
}

seedKnowledge().catch(err => {
    console.error('💥 Seed failed:', err)
    process.exit(1)
})
