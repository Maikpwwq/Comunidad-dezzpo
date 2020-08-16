var nodeExternals = require('webpack-node-externals');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
    {
        entry: './src/index.js',
        mode: 'development',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js',            
        }, 
        resolve: {
            modules: [
              "node_modules",
            ],
            extensions: [".js", ".jsx", ".json", ".css"]
        },
        devtool: 'inline-source-map',
        devServer: {
          contentBase: './build',
        },
        target: 'node',
        externals: [nodeExternals()],      
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
                test: /\.css$/i,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                        emitFile: false,
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
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
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
        plugins: [
            new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
            new HtmlWebPackPlugin({
              template: "./public/index.html",
              filename: "./index.html"
            }),
            new FaviconsWebpackPlugin({
            logo: './public/assets/img/Comunidad-Dezzpo.png',
            prefix: 'assets/',
            inject: true,
            background: '#fff',
            title: 'Comunidad dezzpo',
            icons: {
                android: true,
                appleIcon: true,
                favicons: true,
                opengraph: false,
                twitter: false,
            }
            }),
            //If you want to minify your files uncomment this
            // ,
            // plugins: [
            //     new webpack.optimize.UglifyJsPlugin({
            //         compress: {
            //             warnings: false,
            //         },
            //         output: {
            //             comments: false,
            //         },
            //     }),
            // ]
        ],
    },
]