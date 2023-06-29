const path = require('path')
// const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
// Instead obsolete react-hot-loader use
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

require('dotenv').config()

const isDev = process.env.ENV === 'development'
const entry = ['./src/index.js']
if (isDev) {
    entry.push(
        'react-refresh/runtime',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true'
    )
}

module.exports = {
    entry,
    mode: process.env.ENV,
    output: {
        path: path.resolve(__dirname, 'ssr/public'),
        filename: isDev ? 'assets/app.js' : 'assets/app-[hash].js',
        publicPath: '/',
        assetModuleFilename: 'assets/[name][ext]',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
    // New Code here!
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    devServer: {
        port: 3000,
        static: {
            directory: path.join(__dirname, 'ssr/public'),
        },
        historyApiFallback: true,
        hot: true,
        client: false,
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            // {
            //   enforce: 'pre',
            //   test: /\.(js|jsx)$/,
            //   exclude: /node_modules/,
            //   loader: 'eslint-loader',
            // },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.js', '.jsx'],
                },
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            isDev && require.resolve('react-refresh/babel'),
                        ].filter(Boolean),
                    },
                },
            },
            // {
            //   test: /\.html$/,
            //   use: [
            //     {
            //       loader: "html-loader",
            //     },
            //   ],
            // },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|gif|jpe?g|jpg)$/,
                type: 'asset/resource',
                // OLD implementation
                // use: [
                //   {
                //     'loader': 'file-loader',
                //     options: {
                //       name: 'assets/[hash].[ext]',
                //     },
                //   },
                // ],
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: 'async',
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    reuseExistingChunk: true,
                    priority: 1,
                    filename: isDev
                        ? 'assets/vendor.js'
                        : 'assets/vendor-[contenthash].js',
                    enforce: true,
                    test: /[\\/]node_modules[\\/]/,
                    // test(module, chunks) {
                    //   const name = module.nameForCondition && module.nameForCondition();
                    //   return chunks.some((chunk) => chunk.name !== 'vendors' && /[\\/]node_modules[\\/]/.test(name));
                    // },
                },
            },
        },
    },
    plugins: [
        isDev ? new webpack.HotModuleReplacementPlugin() : () => {},
        isDev
            ? new ReactRefreshWebpackPlugin({
                  forceEnable: true,
                  overlay: {
                      sockIntegration: 'whm',
                  },
              })
            : () => {},
        // new HtmlWebPackPlugin({
        //   template: "./public/index.html",
        //   filename: "./index.html",
        // }), El punto de montaje lo realiza Webpack
        new MiniCssExtractPlugin({
            filename: isDev ? 'assets/app.css' : 'assets/app-[hash].css',
        }),
        //[path][base]
        isDev
            ? () => {}
            : new CompressionWebpackPlugin({
                  test: /\.js$|\.css$/,
                  filename: '[path].gz',
              }),
        isDev ? () => {} : new WebpackManifestPlugin(),
        isDev
            ? () => {}
            : new CleanWebpackPlugin({
                  cleanOnceBeforeBuildPatterns: path.resolve(
                      __dirname,
                      'ssr/public'
                  ),
              }),
        isDev
            ? new ESLintPlugin({
                  extensions: ['js', 'jsx'],
                  exclude: './node_modules/',
              })
            : () => {},
    ].filter(Boolean),
}
