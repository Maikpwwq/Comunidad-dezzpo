import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // SWC instead babel
import vike from 'vike/plugin'
// import { cjsInterop } from 'vite-plugin-cjs-interop'
import vercel from 'vite-plugin-vercel'
// import vercelSsr from '@vite-plugin-vercel/vike'

import * as path from 'path'

const isProd = process.env.NODE_ENV === 'production'

const noExternal: string[] = []
if (isProd) {
    noExternal.push(
        ...[
            // MUI needs to be pre-processed by Vite in production: https://github.com/vikejs/vike/discussions/901
            '@mui/base',
            '@mui/icons-material',
            '@mui/material',
            '@mui/utils',
            '@mui/x-data-grid',
            '@emotion/react',
            '@emotion/styled',
            'react-bootstrap',
            'date-fns',
            '@sendbird/uikit-react',
            'react-swipeable-views',
            'react-swipeable-views-utils',
            'react-google-autocomplete',
            'react-icomoon',
            'firebase',
            'rxjs',
            'prop-types',
            'uuid',
            '@googlemaps/js-api-loader',
        ]
    )
}

export default defineConfig(async ({ command, mode }) => {
    console.log('defineConfig', command, mode)
    return {
        plugins: [
            react(),
            vike({
                // Use the default pre-render config:
                prerender: true,
            }),

            // cjsInterop({
            //     // List of CJS dependencies that require interop
            //     dependencies: [
            //         '@mui/material/*',
            //         'react-bootstrap/*',
            //         'react-bootstrap/cjs/*',
            //     ],
            // }),
            vercel(),
        ],
        ssr: { noExternal },
        build: {
            chunkSizeWarningLimit: 900,
            rollupOptions: {
                onwarn(warning, warn) {
                    if (
                        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
                        warning.message.includes(`"use client"`)
                    ) {
                        return
                    }
                    warn(warning)
                },
            },
        },
        resolve: {
            // Prefix your path aliases with a special character, most commonly #
            alias: [
                { find: '#@', replacement: path.resolve(__dirname, 'src') },
                {
                    find: '#R',
                    replacement: path.resolve(__dirname, 'src/index/renderer'),
                },
            ],
        },
    }
})
