const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const { DuplicatesPlugin } = require("inspectpack/plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");
const Dotenv = require("dotenv-webpack");
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");


module.exports = {
  entry: path.join(__dirname,'src','index.js'), //APP ENTRY POINT
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  target: 'web',
  devtool: '#source-map',
  // Webpack 4 does not have a CSS minifier, although
  // Webpack 5 will likely come with one
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
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
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
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        // Loads images into CSS and Javascript files
        test: /\.jpg$/,
        use: [{loader: 'url-loader'}]
      },
      {
        // Loads CSS into a file when you import it via Javascript
        // Rules are set in MiniCssExtractPlugin
      
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
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html/",
      filename: "./index.html",
      excludeChunks: [ 'server' ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
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