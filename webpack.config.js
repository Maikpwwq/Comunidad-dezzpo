const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const { DuplicatesPlugin } = require("inspectpack/plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const Dotenv = require("dotenv-webpack");
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");

module.exports = {
    mode: 'development',  // 'production'
    devtool: "inline-source-map", //'source-map'
    entry: path.join(__dirname,'src','index.js'), //APP ENTRY POINT
    // OUTPUT DIRECTORY
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    // PATH RESOLVE
    resolve: {
        extensions: ['web.js', '.js', 'web.ts', '.ts', 'web.tsx', '.tsx', 'json', 'web.jsx', '.jsx', '.node'],
        publicPath: "/build/",
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css'],
        alias: {
            'react': path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            'lodash': path.resolve(__dirname, 'node_modules/lodash'),
        }
    },
    module: {
        rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
              }
            },
            {
              test: /\.html$/,
              use: [
                {
                  loader: "html-loader",
                }
              ]
            },
            {
                test: /\.(css|scss)$/,
                use: [                    
                  {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        esModule: true,
                    },
                  },
                  'css-loader',
                ],
            },
            {                
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: [{
                        loader: "file-loader",
                        options: {
                            name: "[path][name]-[hash:8].[ext]",
                        }
                }],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    } 
                },
            },
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                }]
            },
        ]
    },
    // DEV SERVER ENTRY POINT
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname,'src')
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./public/index.html/",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new FaviconsWebpackPlugin({
            logo: 'LogoPNG.png',
            prefix: './img/',
        }),
        new DuplicatePackageCheckerPlugin(),
        new DuplicatesPlugin({
            // Emit compilation warning or error? (Default: `false`)
            emitErrors: false,
            // Handle all messages with handler function (`(report: string)`)
            // Overrides `emitErrors` output.
            emitHandler: undefined,
            // Display full duplicates information? (Default: `false`)
            verbose: false
        }),
        new DashboardPlugin(),
        new Dotenv(), 
    ] 
}