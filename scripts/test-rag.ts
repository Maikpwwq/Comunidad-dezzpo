import 'dotenv/config'

process.env.GOOGLE_GENERATIVE_AI_API_KEY ??= process.env.VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY

import { createClient } from '@supabase/supabase-js'
import { google } from '@ai-sdk/google'
import { embed, generateText } from 'ai'

async function testRAG() {
    console.log('🧪 Probando pipeline RAG de Comunidad Dezzpo...')

    const supabase = createClient(
        process.env.VITE_APP_SUPABASE_PROJECT_URL!,
        process.env.VITE_APP_SUPABASE_SECRET_KEY!
    )

    const query = '¿Cómo funciona el directorio de tiendas y qué categorías de materiales ofrecen?'
    console.log(`\n❓ Pregunta: "${query}"`)

    // 1. Generar embedding
    const { embedding: rawEmbedding } = await embed({
        model: google.textEmbeddingModel('gemini-embedding-001'),
        value: query,
    })
    const queryEmbedding = rawEmbedding.slice(0, 768)

    // 2. Consultar Supabase
    const { data, error } = await supabase.rpc('match_dezzpo_documents', {
        query_embedding: queryEmbedding,
        match_count: 3,
        filter_pathname: null,
    } as any)

    if (error) {
        console.error('❌ Error RPC en Supabase:', error)
        return
    }

    console.log(`\n📚 Documentos recuperados de Supabase (${data?.length || 0}):`)
    data?.forEach((doc: any, i: number) => {
        console.log(`\n--- [Doc ${i + 1}] (${doc.metadata?.pathname || '/'} | Similitud: ${(doc.similarity * 100).toFixed(1)}%) ---`)
        console.log(doc.content.slice(0, 180) + '...')
    })

    // 3. Generar respuesta con Gemini 2.5 Flash
    const contextBlock = data
        ?.map((doc: any, i: number) => `[Fuente ${i + 1}: ${doc.metadata?.title}](${doc.metadata?.url})\n${doc.content}`)
        .join('\n\n---\n\n')

    const response = await generateText({
        model: google('gemini-2.5-flash'),
        system: `Eres el asistente oficial de Comunidad Dezzpo (https://dezzpo.com). Responde basándote en el contexto recuperado e incluye citas a las fuentes.`,
        prompt: `Contexto:\n${contextBlock}\n\nPregunta: ${query}`,
    })

    console.log('\n🤖 Respuesta del Chatbot (Gemini 2.5 Flash):')
    console.log(response.text)
}

testRAG().catch(console.error)
