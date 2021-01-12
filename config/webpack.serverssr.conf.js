const path = require('path');
const paths = require('./path');
const { VueLoaderPlugin } = require('vue-loader');

const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';
const isDevEnv = process.env.NODE_ENV === 'development';

const mode = isProduction
    ? 'production'
    : 'development';


const publicPath = 'static/ssr/';

module.exports = {
    entry: {
        main: path.resolve(paths.vueSrc, 'entry-server.ts'),
    },
    mode: "production",
    watch: isDevEnv,
    output: {
        path: path.resolve(paths.appBuild, 'static/ssr'),
        libraryTarget: 'commonjs2',
    },
    target: 'node',
    devtool: 'source-map',
    externals: nodeExternals({
        allowlist: [/\.css$/, /\.less$/],
    }),
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: {
                                    browsers: ['> 1%', 'last 2 versions'],
                                },
                            }],
                        ],
                        plugins: [
                            'dynamic-import-webpack',
                        ],
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
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // enable CSS extraction
                    extractCSS: true,
                },
                include: paths.vueSrc,
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
                            // 为了便于不编译的情况下动态切换Cdn, css里的img文件前缀直接使用相对路径 /static
                            // html模板里的img文件使用带cdn域名的完整路径，所以如果在vue模板里写了img标签的话，就得重新编译上线才能切换cdn
                            const pathName = publicPath + 'img/' + file;
                            // console.log(file);
                            // if (isProdEnv) {
                            //     return config.cdnPrefix + pathName;
                            // }

                            return pathName;
                        },
                    },
                },
            },
        //
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            '@': paths.appPath,
            '@@': paths.vueSrc,
        },
    },
    plugins: [
        new VueLoaderPlugin(),
        new VueSSRServerPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                VUE_ENV: JSON.stringify('node'),
            },
        }),
    ],
};
