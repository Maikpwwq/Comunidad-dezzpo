/**
 * Chat API Route — Dezzpo RAG
 *
 * POST /api/v1/chat
 * Body: { messages: Message[], currentPathname?: string }
 *
 * Pipeline:
 * 1. Embed user query → Google Text Embedding 004
 * 2. Retrieve context → Supabase match_dezzpo_documents RPC
 *    - topK:3 filtered by pathname (local context)
 *    - topK:2 global fallback (no filter)
 * 3. Stream response → Gemini 1.5 Pro via Vercel AI SDK
 */

import type { Context } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { google } from '@ai-sdk/google'
import { streamText, embed } from 'ai'

// Bridge VITE_APP_ env vars to AI SDK expected names
process.env.GOOGLE_GENERATIVE_AI_API_KEY ??= process.env.VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY

// ── Supabase server client (lazy init) ───────────────────────────────────────

let supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
    if (supabase) return supabase
    supabase = createClient(
        process.env.VITE_APP_SUPABASE_PROJECT_URL!,
        process.env.VITE_APP_SUPABASE_SECRET_KEY!
    )
    return supabase
}

// ── Types ────────────────────────────────────────────────────────────────────

interface RetrievedDoc {
    id: number
    content: string
    metadata: { url?: string; pathname?: string; title?: string }
    similarity: number
}

// ── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Eres el asistente oficial de Comunidad Dezzpo, una plataforma digital que conecta propietarios residenciales con comerciantes profesionales calificados en mantenimiento general, reformas y servicios para el hogar.

Comunidad Dezzpo es una red profesional similar a LinkedIn pero especializada en el sector de mantenimiento residencial. Los comerciantes verificados ofrecen servicios como:
- Mantenimiento general e instalaciones
- Acabados inmobiliarios y remodelaciones
- Construcción civil, carpintería, plomería, electricidad
- Administración de propiedad horizontal

Tu comportamiento:
- Profesional, directo, resolutivo.
- Si la información NO está en el contexto proporcionado, admítelo claramente: "No tengo información específica sobre eso en este momento."
- NUNCA inventes datos, precios, nombres de comerciantes o servicios que no estén en el contexto.
- Incluye citas a las URLs fuente cuando uses información del contexto, en formato: [Fuente](url)
- Responde en español colombiano.
- Sé conciso pero completo.`

// ── Handler ──────────────────────────────────────────────────────────────────

export async function chatHandler(c: Context) {
    try {
        const body = await c.req.json()
        const { messages, currentPathname } = body

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return c.json({ error: 'messages[] is required' }, 400)
        }

        // Extract the latest user message for embedding
        const lastUserMessage = [...messages]
            .reverse()
            .find((m: any) => m.role === 'user')

        if (!lastUserMessage) {
            return c.json({ error: 'No user message found' }, 400)
        }

        const queryText = lastUserMessage.content as string

        // Step 1: Generate embedding for the user query
        const { embedding: queryEmbedding } = await embed({
            model: (google.textEmbeddingModel as any)('gemini-embedding-001', {
                outputDimensionality: 768,
            }),
            value: queryText,
        })

        const db = getSupabase()

        // Step 2a: Retrieve context filtered by pathname (local context)
        const localDocs: RetrievedDoc[] = []
        if (currentPathname && currentPathname !== '/') {
            const { data } = await db.rpc('match_dezzpo_documents', {
                query_embedding: JSON.stringify(queryEmbedding),
                match_count: 3,
                filter_pathname: currentPathname,
            } as any)
            if (data) localDocs.push(...(data as RetrievedDoc[]))
        }

        // Step 2b: Retrieve global fallback (no pathname filter)
        const { data: globalData } = await db.rpc('match_dezzpo_documents', {
            query_embedding: JSON.stringify(queryEmbedding),
            match_count: 2,
            filter_pathname: null,
        } as any)
        const globalDocs: RetrievedDoc[] = (globalData as unknown as RetrievedDoc[]) || []

        // Merge and deduplicate by id, local docs first
        const seenIds = new Set<number>()
        const allDocs: RetrievedDoc[] = []
        for (const doc of [...localDocs, ...globalDocs]) {
            if (!seenIds.has(doc.id)) {
                seenIds.add(doc.id)
                allDocs.push(doc)
            }
        }

        // Step 3: Build context block with citations
        const contextBlock = allDocs.length > 0
            ? allDocs
                .map((doc, i) => {
                    const url = doc.metadata?.url || ''
                    const title = doc.metadata?.title || 'Documento'
                    return `[Fuente ${i + 1}: ${title}](${url})\n${doc.content}`
                })
                .join('\n\n---\n\n')
            : 'No se encontró contexto relevante en la base de conocimiento.'

        // Build the full system message with injected context
        const systemWithContext = `${SYSTEM_PROMPT}

--- CONTEXTO RECUPERADO (usa esto para responder) ---
${contextBlock}
--- FIN DEL CONTEXTO ---

Recuerda: responde SOLO con base en el contexto anterior. Si la pregunta no puede responderse con este contexto, indícalo.`

        // Step 4: Stream response via Gemini 1.5 Pro
        const result = streamText({
            model: google('gemini-1.5-pro'),
            system: systemWithContext,
            messages,
        })

        // Return Vercel AI SDK compatible stream response
        return result.toTextStreamResponse()
    } catch (error) {
        console.error('[chat API] Error:', error)
        return c.json(
            { error: 'Internal server error during chat processing' },
            500
        )
    }
}
