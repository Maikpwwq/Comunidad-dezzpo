// Configuracion de desarrollo de webpack dev server
const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const { HotModuleReplacementPlugin } = require("webpack");
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

/** @type {import('webpack').Configuration} */

const devConfig = {
  mode: 'development',
  entry:[
    
  ],
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    contentBase: path.resolve(__dirname, 'dist'),
    open: "chrome",
    hot: true
  },  
  target: "web",
  module: {
    rules: [     
      {
        test: /\.(sa|sc|c)ss$/,
        use: [          
            'style-loader',
            'css-loader',
            'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),       
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: 'wds'
        // webpack-dev-server: wds;
        // webpack-hot-middleware: whm;
        // webpack-plugin-serve: wps;
      },
    }),
  ],  
};

module.exports = merge(common, devConfig);