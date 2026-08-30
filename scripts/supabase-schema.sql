-- =============================================================================
-- Supabase Hardened Schema for Dezzpo RAG Chatbot
-- =============================================================================

-- 1. Habilitar la extensión vectorial en el schema 'extensions'
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Tabla principal de conocimiento (si no existe)
-- Google Gemini Embedding 001 / Text Embedding 004 → 768 dimensiones
CREATE TABLE IF NOT EXISTS dezzpo_documents (
    id bigserial PRIMARY KEY,
    content text NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    embedding extensions.vector(768)
);

-- 3. Índice HNSW para búsqueda semántica acelerada
CREATE INDEX IF NOT EXISTS dezzpo_documents_embedding_idx 
ON dezzpo_documents 
USING hnsw (embedding extensions.vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 4. Función RPC para búsqueda semántica (Hardened con search_path explícito)
CREATE OR REPLACE FUNCTION match_dezzpo_documents (
  query_embedding extensions.vector(768),
  match_count int DEFAULT 5,
  filter_pathname text DEFAULT NULL
) RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dd.id,
    dd.content,
    dd.metadata,
    1 - (dd.embedding <=> query_embedding) AS similarity
  FROM dezzpo_documents dd
  WHERE filter_pathname IS NULL OR dd.metadata->>'pathname' = filter_pathname
  ORDER BY dd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Row Level Security (RLS)
ALTER TABLE dezzpo_documents ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
DROP POLICY IF EXISTS "Allow public read access to dezzpo_documents" ON dezzpo_documents;
CREATE POLICY "Allow public read access to dezzpo_documents" 
ON dezzpo_documents FOR SELECT 
TO anon, authenticated
USING (true);

-- =============================================================================
-- SCRIPT DE PARCHEO RÁPIDO PARA RESOLVER ADVISOR WARNINGS EN SUPABASE SQL EDITOR
-- =============================================================================
-- Si ya creaste la tabla y solo deseas limpiar los warnings del Security Advisor:
--
-- 1. Mover la extensión al schema 'extensions':
-- ALTER EXTENSION vector SET SCHEMA extensions;
--
-- 2. Fijar el search_path en la función RPC:
-- ALTER FUNCTION public.match_dezzpo_documents(extensions.vector, integer, text) 
--   SET search_path = public, extensions;
-- =============================================================================
