const webpack = require("webpack");
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

const ASSET_PATH = process.env.ASSET_PATH || '';

/** @type {import('webpack').Configuration} */
module.exports = {
  name: "client",
  target: "web",
  entry: [
    "./src/index.js",
  ],
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[contenthash].js",
    publicPath: ASSET_PATH
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.css', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
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
        use: [
          'style-loader',        
          'css-loader',          
          'stylus-loader'
        ]
      },
      {
        type: "asset",
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx'],
    alias: {
      
    }
  },
  plugins: [
    // Esto nos permite utilizar de forma segura env vars en nuestro código
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({      
      appMountId: 'app',
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      hash: true,
      templateParameters: {
        titulo: 'Comunidad Dezzpo',
        pith: 'Somos una..'
      }
    })    
  ]
};
