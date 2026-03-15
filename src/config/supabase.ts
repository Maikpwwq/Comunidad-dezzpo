/**
 * Supabase Client Singleton
 *
 * Server-side: uses SUPABASE_SECRET_KEY for full access (API routes, seed script)
 * Client-side: uses PUBLISHABLE_KEY for read-only access (future direct queries)
 *
 * Env vars follow existing VITE_APP_ prefix convention from the project.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-side client (used in API routes and scripts)
let serverClient: SupabaseClient | null = null

export function getSupabaseServer(): SupabaseClient {
    if (serverClient) return serverClient

    const url = process.env.VITE_APP_SUPABASE_PROJECT_URL
    const key = process.env.VITE_APP_SUPABASE_SECRET_KEY

    if (!url || !key) {
        throw new Error(
            '[Supabase] Missing env: VITE_APP_SUPABASE_PROJECT_URL or VITE_APP_SUPABASE_SECRET_KEY'
        )
    }

    serverClient = createClient(url, key)
    return serverClient
}

// Client-side client (browser-safe, uses anon/publishable key)
let browserClient: SupabaseClient | null = null

export function getSupabaseBrowser(): SupabaseClient {
    if (browserClient) return browserClient

    // In Vite, import.meta.env exposes VITE_* vars to the client
    const url = import.meta.env.VITE_APP_SUPABASE_PROJECT_URL as string
    const key = import.meta.env.VITE_APP_SUPABASE_PUBLISHABLE_KEY as string

    if (!url || !key) {
        throw new Error(
            '[Supabase] Missing env: VITE_APP_SUPABASE_PROJECT_URL or VITE_APP_SUPABASE_PUBLISHABLE_KEY'
        )
    }

    browserClient = createClient(url, key)
    return browserClient
}
