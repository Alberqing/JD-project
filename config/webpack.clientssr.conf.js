'use strict';

const webpack = require('webpack');
const path = require('path');
const paths = require('./path');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProduction = process.env.NODE_ENV === 'production';
const isDevEnv = process.env.NODE_ENV === 'development';

const mode = isProduction ? 'production' : 'development';

const publicPath = 'static/ssr/'

function getHashedFileName(type) {
    switch(type) {
        case 'css':
            return isDevEnv ? '[name].css' : '[name]-[contenthash:8].css';
        case 'img':
            return isDevEnv ? '[name].[ext]' : '[name]-[hash:8].[ext]';
        case 'js':
            return isDevEnv ? '[name].js' : '[name]-[chunkhash:8].js';
    }

    return '';
}

module.exports = {
    entry: {
        main: path.resolve(paths.vueSrc, 'entry-client.ts')
    },
    devServer: {
        port: 8080,
    },
    mode: 'production',
    watch: isDevEnv,
    output: {
        path: path.resolve(paths.appBuild, 'static/ssr'),
        publicPath,
        filename: function() {
            return path.join('js/', getHashedFileName('js'))
        },
        chunkFilename: path.join('js/', getHashedFileName('js')),
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader:'vue-loader',
                include: paths.vueSrc
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['> 1%', 'last 2 versions'],
                                }
                            }]
                        ],
                        plugins: [
                            'dynamic-import-webpack'
                        ]
                    },
                },
                exclude: paths.appNodeModules
            },
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'postcss-loader',
                ],
                include: paths.vueSrc
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        name: '[name].[hash:7].[ext]',
                        outputPath: '/img/',
                        publicPath: function (file) {
                            const pathName = publicPath + 'img/' + file;
                            return pathName;
                        },
                    },
                },
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            '@': paths.vueSrc,
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new VueSSRClientPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(paths.vueSrc, './template.html'),
            filename: 'template.html',
            publicPath: '/',
            minify: {
                removeComments: false,
                collapseWhitespace: !isDevEnv,
                minifyJS: !isDevEnv
            }
        }),
        new MiniCssExtractPlugin({
            filename: function() {
                return path.join('css/', getHashedFileName('css'));
            },
            chunkFilename: path.join('css/', getHashedFileName('css'))
        }),
        new webpack.DefinePlugin({
            'process.env': {
                VUE_ENV: JSON.stringify('browser'),
            }
        })
    ],
    optimization: {
        minimize: !isDevEnv,
        splitChunks: {
            automaticNameDelimiter: "-"
        }
    }
}
