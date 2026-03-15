-- =============================================================================
-- Supabase Schema for Dezzpo RAG Chatbot
-- Run this in the Supabase SQL Editor ONCE.
-- =============================================================================

-- 1. Habilitar la extensión vectorial de PostgreSQL
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Tabla principal de conocimiento
-- Google Text Embedding 004 → 768 dimensiones
CREATE TABLE dezzpo_documents (
    id bigserial PRIMARY KEY,
    content text NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    embedding vector(768)
);

-- 3. Índice HNSW para búsqueda semántica
CREATE INDEX dezzpo_documents_embedding_idx 
ON dezzpo_documents 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- 4. Función RPC para búsqueda con filtrado por pathname
CREATE OR REPLACE FUNCTION match_dezzpo_documents (
  query_embedding vector(768),
  match_count int DEFAULT 5,
  filter_pathname text DEFAULT NULL
) RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
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

-- 5. RLS para acceso público de lectura
ALTER TABLE dezzpo_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to dezzpo_documents" 
ON dezzpo_documents FOR SELECT 
TO anon 
USING (true);
