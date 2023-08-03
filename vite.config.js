// import react from "@vitejs/plugin-react"; babel to SWC
import react from '@vitejs/plugin-react-swc'
import ssr from 'vite-plugin-ssr/plugin'
import * as path from 'path'

export default {
    plugins: [react(), ssr()],
    resolve: {
        // Prefix your path aliases with a special character, most commonly #
        alias: [
            { find: '#@', replacement: path.resolve(__dirname, 'src') },
            { find: '#P', replacement: path.resolve(__dirname, 'src/pages') },
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
                replacement: path.resolve(__dirname, 'src/pages/app/renderer'),
            },
        ],
    },
}
