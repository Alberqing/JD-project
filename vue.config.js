const path = require('path');
const fs = require('fs');


module.exports = {
    // configureWebpack: {
    //     resolveLoader: {
    //         modules: ['node_modules', path.resolve(__dirname, './config/')],
    //     }
    // },
    // configureWebpack: (config) => {
    //     // 设置别名
    //     // config.resolve.alias['img'] = path.resolve(__dirname, '../src/assets/images');
    //     // config.resolve.alias['styles'] = path.resolve(__dirname, '../src/assets/styles');
    //     // 添加 loader
    //     config.module.rules.push({
    //       // 处理jquery
    //       test: /src\/routers\.js/,
    //       enforce: 'pre',
    //       use: path.resolve(__dirname, './config/route-loader.js')
    //     })
    //     // console.log(config);
    // },
    // .use(path.resolve(__dirname, './config/route-loader'))
    // .loader(path.resolve(__dirname, './config/route-loader'))
    chainWebpack: config => {
        config.module
            .rule('route')
            .test(/\.js$/)
            .exclude
                .add(/node_modules/)
                .add(/config/)
                .end()
            .use(path.resolve(__dirname, './config/route-loader'))
            .loader(path.resolve(__dirname, './config/route-loader'))
            .end()
    }
}