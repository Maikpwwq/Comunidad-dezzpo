import createCache from '@emotion/cache'

/** Must match server and client so Emotion hydrates without duplicate sheets. */
export const EMOTION_CACHE_KEY = 'mui'

export function createEmotionCache() {
    return createCache({ key: EMOTION_CACHE_KEY, prepend: true })
}

let clientEmotionCache: ReturnType<typeof createCache> | undefined

/** Single cache for the browser session (Vike client entry). */
export function getClientEmotionCache() {
    if (clientEmotionCache === undefined) {
        clientEmotionCache = createEmotionCache()
    }
    return clientEmotionCache
}
