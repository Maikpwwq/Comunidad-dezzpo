// Configuracion de desarrollo de webpack dev server
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const { HotModuleReplacementPlugin } = require('webpack')
const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

// @type {import('webpack').Configuration}

const devConfig = {
    mode: 'development',
    entry: ['react', 'react-dom', 'react-refresh/runtime'],
    devtool: 'eval-source-map',
    devServer: {
        port: 3000,
        contentBase: path.resolve(__dirname, '../dist'),
        // open: "chrome",
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // Your Babel config here
                        plugins: ['react-refresh/babel'],
                    },
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    // [style-loader](/loaders/style-loader)
                    { loader: 'style-loader' },
                    // [css-loader](/loaders/css-loader)
                    {
                        loader: 'css-loader',
                        options: {
                            // modules: true
                        },
                    },
                    // [sass-loader](/loaders/sass-loader)
                    { loader: 'sass-loader' },
                ],
            },
        ],
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: 'wds',
                // webpack-dev-server: wds;
                // webpack-hot-middleware: whm;
                // webpack-plugin-serve: wps;
            },
        }),
    ],
    optimization: {
        runtimeChunk: 'single',
    },
}

module.exports = merge(common, devConfig)
