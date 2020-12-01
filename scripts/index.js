const webpack = require('webpack')
const get = require('lodash.get')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const merge = require('lodash.merge')
const shell = require('shelljs')
const chalk = require('chalk')

const DEFAULT_PORT = 3000

const onCompilationComplete = (err, stats) => {
    if (err) {
        console.error(err.stack || err)
        if (err.details) console.error(err.details)
        return
    }

    if (stats.hasErrors()) {
        stats.toJson().errors.forEach(err => console.error(err))
        process.exitCode = 1
    }

    if (stats.hasWarnings()) {
        stats.toJson().warnings.forEach(warn => console.warn(warn))
    }
}

module.exports = (api, projectOptions) => {
    const clientPort = get(projectOptions, 'devServer.port', 8080)

    api.chainWebpack(config => {
        const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
        const DEV_MODE = process.env.NODE_ENV === 'development'

        if (DEV_MODE) {
            config.devServer.headers({ 'Access-Control-Allow-Origin': '*' }).port(clientPort)
        }

        config
            .entry('app')
            .clear()
            .add('./src/entry-client.js')
            .end()
            // 为了让服务器端和客户端能够共享同一份入口模板文件
            // 需要让入口模板文件支持动态模板语法（这里选择了 TJ 的 ejs）
            .plugin('html')
            .tap(args => {
                return [{
                    template: './public/index.ejs',
                    minify: {
                        collapseWhitespace: true
                    },
                    templateParameters: {
                        title: 'spa',
                        mode: 'client'
                    }
                }]
            })
            .end()
            // Exclude unprocessed HTML templates from being copied to 'dist' folder.
            .when(config.plugins.has('copy'), config => {
                config.plugin('copy').tap(([[config]]) => [
                    [
                        {
                            ...config,
                            ignore: [...config.ignore, 'index.ejs']
                        }
                    ]
                ])
            })
            .end()

        // 默认值: 当 webpack 配置中包含 target: 'node' 且 vue-template-compiler 版本号大于等于 2.4.0 时为 true。
        // 开启 Vue 2.4 服务端渲染的编译优化之后，渲染函数将会把返回的 vdom 树的一部分编译为字符串，以提升服务端渲染的性能。
        // 在一些情况下，你可能想要明确的将其关掉，因为该渲染函数只能用于服务端渲染，而不能用于客户端渲染或测试环境。
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                merge(options, {
                    optimizeSSR: false
                })
            })

        config.plugins
            // Delete plugins that are unnecessary/broken in SSR & add Vue SSR plugin
            .delete('pwa')
            .end()
            .plugin('vue-ssr')
            .use(TARGET_NODE ? VueSSRServerPlugin : VueSSRClientPlugin)
            .end()

        if (!TARGET_NODE) return

        config
            .entry('app')
            .clear()
            .add('./src/entry-server.js')
            .end()
            .target('node')
            .devtool('source-map')
            .externals(nodeExternals({ whitelist: /\.css$/ }))
            .output.filename('server-bundle.js')
            .libraryTarget('commonjs2')
            .end()
            .optimization.splitChunks({})
            .end()
            .plugins.delete('named-chunks')
            .delete('hmr')
            .delete('workbox')
    })

    api.registerCommand('ssr:build', args => {
        process.env.WEBPACK_TARGET = 'node'

        const webpackConfig = api.resolveWebpackConfig()
        const compiler = webpack(webpackConfig)

        compiler.run(onCompilationComplete)

        shell.exec('node ./node_modules/vue-cli-plugin-my_ssr_plugin_demo/bin/initRouter.js')
    })

    api.registerCommand('ssr:serve', {
        description: 'start development server',
        usage: 'vue-cli-service ssr:serve [options]',
        options: {
            '--port': `specify port (default: ${DEFAULT_PORT})`
        }
    }, args => {
        process.env.WEBPACK_TARGET = 'node'

        const port = args.port || DEFAULT_PORT

        console.log(
            '[SSR service] will run at:' +
            chalk.blue(`
        http://localhost:${port}/
      `)
        )

        shell.exec(`
      PORT=${port} \
      CLIENT_PORT=${clientPort} \
      CLIENT_PUBLIC_PATH=${projectOptions.publicPath} \
      node ./node_modules/vue-cli-plugin-my_ssr_plugin_demo/app/server.js \
    `)
    })
}

module.exports.defaultModes = {
    'ssr:build': 'production',
    'ssr:serve': 'development'
}
