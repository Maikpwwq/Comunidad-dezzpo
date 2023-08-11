// import react from "@vitejs/plugin-react"; babel to SWC
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vite-plugin-ssr/plugin'
import { cjsInterop } from 'vite-plugin-cjs-interop'
// import vercel from 'vite-plugin-vercel'
// import vercelSsr from '@magne4000/vite-plugin-vercel-ssr'
import * as path from 'path'

export default defineConfig(async ({ command, mode }) => {
    console.log('defineConfig', command, mode)
    return {
        plugins: [
            react(),
            ssr({
                // Use the default pre-render config:
                prerender: true,
                ...(process.env.NODE_ENV === 'production'
                    ? {
                          noExternal: [
                            '@mui/material',
                            //   '@mui/utils',
                            //   '@mui/base',
                            //   '@mui/icons-material',
                            //   '@mui/x-data-grid',
                            //   '@emotion/react',
                            //   '@emotion/styled',
                            //   'react-bootstrap',
                            //   '@types/react',
                            //   '@types/react',
                            //   '@types/react',
                          ],
                      }
                    : { noExternal: [] }),
            }),

            cjsInterop({
                // List of CJS dependencies that require interop
                dependencies: [
                    '@mui/material/*',
                    'react-bootstrap/cjs/*',
                ],
            }),
            // vercel(),
            // vercelSsr(),
        ],
        resolve: {
            // Prefix your path aliases with a special character, most commonly #
            alias: [
                { find: '#@', replacement: path.resolve(__dirname, 'src') },
                {
                    find: '#P',
                    replacement: path.resolve(__dirname, 'src/pages'),
                },
                {
                    find: '#R',
                    replacement: path.resolve(
                        __dirname,
                        'src/pages/index/renderer'
                    ),
                },
                {
                    find: '#PP',
                    replacement: path.resolve(__dirname, 'src/pages/app'),
                },
                {
                    find: '#PR',
                    replacement: path.resolve(
                        __dirname,
                        'src/pages/app/renderer'
                    ),
                },
            ],
        },
    }
})
