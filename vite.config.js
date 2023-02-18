import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import ssr from 'vite-plugin-ssr/plugin'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
    //const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()], //, ssr()
        // base: "/Comunidad-dezzpo/", // gh pages
        define: {},
        resolve: {
            alias: [
                { find: '@', replacement: path.resolve(__dirname, 'src') },
                {
                    find: '~bootstrap',
                    replacement: path.resolve(
                        __dirname,
                        'node_modules/bootstrap'
                    ),
                },
            ],
        },
        esbuild: { loader: 'jsx', include: /\.(tsx?|jsx?)$/, exclude: [] },
    }
})
