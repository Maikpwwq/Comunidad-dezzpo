const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const { DuplicatesPlugin } = require("inspectpack/plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const Dotenv = require("dotenv-webpack");
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");


module.exports = {
  entry: {
    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  mode: 'development',
  target: 'web',
  devtool: '#source-map',
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
        enforce: "pre",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: ["babel-loader","eslint-loader"]
        },
        query: {
          presets: ['es2015']
        },
        options: {
          emitWarning: true,
          failOnError: false,
          failOnWarning: false
        }
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins 
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            //options: { minimize: true }
          }
        ]
      },
      { 
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
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
      }
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
      filename: "./index.html",
      excludeChunks: [ 'server' ]
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FaviconsWebpackPlugin({
      logo: './img/LogoPNG.png',
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