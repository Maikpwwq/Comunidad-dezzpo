const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
require('dotenv').config()

// para uso en local dejar vacio " ", para postear en Github pages usar "/"
const ASSET_PATH = process.env.ASSET_PATH || '/'
const isDevelopment = process.env.NODE_ENV !== 'production'

// @type {import('webpack').Configuration}

module.exports = {
    name: 'client',
    mode: isDevelopment ? 'development' : 'production',
    target: isDevelopment ? 'web' : 'browserslist',
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, '/dist'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.css', '.json'],
        alias: {},
    },
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.styl$/,
                use: ['stylus-loader'],
            },
            {
                type: 'asset',
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 4kb
                    },
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        // Esto nos permite utilizar de forma segura env vars en nuestro código
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            appMountId: 'app',
            template: path.resolve(__dirname, '/public/index.html'),
            filename: 'index.html',
            hash: true,
            templateParameters: {
                titulo: 'Comunidad Dezzpo',
                pith: 'Somos una..',
            },
        }),
    ],
}
