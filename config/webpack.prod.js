const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @type {import('webpack').Configuration} */

const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [     
      {
        test: /\.(sa|sc|c)ss$/,
        use: [          
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    // minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  }
};

module.exports = merge(common, prodConfig);