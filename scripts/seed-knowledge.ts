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
const BASE_URL = 'https://dezzpo.com'

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
        const section = sections[i]?.trim() || ''
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
    if (lower.includes('tienda') || lower.includes('proveedor') || lower.includes('ferretería')) return '/tiendas'
    if (lower.includes('celular') || lower.includes('sms') || lower.includes('otp') || lower.includes('registro')) return '/registro'
    if (lower.includes('ingreso') || lower.includes('login') || lower.includes('iniciar sesión')) return '/ingreso'
    if (lower.includes('referido') || lower.includes('voz a voz') || lower.includes('invitar')) return '/app/invitar-amigos'
    if (lower.includes('micrositio') || lower.includes('perfil') || lower.includes('tarjeta de presentación')) return '/app/perfil'
    if (lower.includes('contacto') || lower.includes('teléfono') || lower.includes('email') || lower.includes('whatsapp')) return '/contactenos'
    if (lower.includes('misión') || lower.includes('visión') || lower.includes('valores') || lower.includes('hseq') || lower.includes('qué es') || lower.includes('historia')) return '/nosotros'
    if (lower.includes('presupuesto') || lower.includes('solicitud de servicio')) return '/presupuestos'
    if (lower.includes('certificación') || lower.includes('calificacion') || lower.includes('cómo funciona')) return '/asi-trabajamos'
    if (lower.includes('catálogo') || lower.includes('especialidad') || lower.includes('portal') || lower.includes('directorio de profesionales')) return '/app/portal-servicios'
    if (lower.includes('ayuda') || lower.includes('pqrs') || lower.includes('servicio al cliente')) return '/ayuda-pqrs'
    if (lower.includes('legal') || lower.includes('términos') || lower.includes('privacidad') || lower.includes('cookies')) return '/legal'
    if (lower.includes('requerimiento') || lower.includes('nuevo proyecto')) return '/app/nuevo-proyecto'
    if (lower.includes('clasificación') || lower.includes('niveles de usuario')) return '/clasificacion-usuarios'
    if (lower.includes('asesoría') || lower.includes('foro')) return '/asesorias'
    if (lower.includes('blog')) return '/blog'
    if (lower.includes('contrato') || lower.includes('anticipo') || lower.includes('epayco') || lower.includes('pago')) return '/app/formas-pago'
    if (lower.includes('tarifa') || lower.includes('precio') || lower.includes('membresía')) return '/app/suscripciones'
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

    // 4. Generate embeddings (with local cache support)
    const CACHE_FILE = path.join(KNOWLEDGE_DIR, '.embeddings-cache.json')
    let cache: Record<string, number[]> = {}
    if (fs.existsSync(CACHE_FILE)) {
        try {
            cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
            console.log(`📦 Loaded ${Object.keys(cache).length} cached embeddings from .embeddings-cache.json`)
        } catch { /* ignore corrupted cache */ }
    }

    const allEmbeddings: number[][] = []
    const chunksToEmbed: { chunk: KnowledgeChunk; index: number }[] = []

    for (let i = 0; i < allChunks.length; i++) {
        const chunk = allChunks[i]!
        if (cache[chunk.content]) {
            allEmbeddings[i] = cache[chunk.content]!
        } else {
            chunksToEmbed.push({ chunk, index: i })
        }
    }

    if (chunksToEmbed.length > 0) {
        console.log(`🧠 Generating ${chunksToEmbed.length} new embeddings (gemini-embedding-001 → ${TARGET_DIMS}d)...`)
        const totalBatches = Math.ceil(chunksToEmbed.length / BATCH_SIZE)

        for (let i = 0; i < chunksToEmbed.length; i += BATCH_SIZE) {
            const batch = chunksToEmbed.slice(i, i + BATCH_SIZE)
            const { embeddings } = await embedMany({
                model: google.textEmbeddingModel('gemini-embedding-001'),
                values: batch.map(b => b.chunk.content),
            })

            for (let j = 0; j < batch.length; j++) {
                const targetIndex = batch[j]!.index
                const content = batch[j]!.chunk.content
                const truncated = embeddings[j]!.slice(0, TARGET_DIMS)
                allEmbeddings[targetIndex] = truncated
                cache[content] = truncated
            }

            const batchNum = Math.floor(i / BATCH_SIZE) + 1
            console.log(`   ✓ Batch ${batchNum}/${totalBatches}`)

            if (batchNum < totalBatches) {
                console.log('   ⏳ Waiting 35s (free-tier rate limit)...')
                await new Promise(r => setTimeout(r, 35_000))
            }
        }

        // Persist cache to disk
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8')
        console.log(`💾 Saved updated embeddings to .embeddings-cache.json`)
    } else {
        console.log('⚡ All chunks retrieved from local cache (0 API calls needed)!')
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

    console.log(`\n✅ Knowledge seed complete! ${rows.length} chunks inserted into Supabase.`)
}

seedKnowledge().catch(err => {
    console.error('💥 Seed failed:', err)
    process.exit(1)
})
