import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
    //const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()], // htmlPlugin(htmlPluginOpt),
        // base: "/Comunidad-dezzpo/", // gh pages
        define: {
            // 'process.env.SOME_ENV': `"${process.env.SOME_ENV}"`
            // DOTENV_CONFIG_ENCODING: env.DOTENV_CONFIG_ENCODING,
            // 'process.env': process.env,
        },
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
