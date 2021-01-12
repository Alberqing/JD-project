'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
    throw err;
})

// require('../config/env');

const webpack = require('webpack');
const paths = require('../config/path');
const config = require('@vue/cli-service/webpack.config');

const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const util = require('util');

const nodemon = require('nodemon');

const webpackClientConfig = require('../config/webpack.clientssr.conf');
const webpackServerConfig = require('../config/webpack.serverssr.conf');

let hasStartServer = false;

async function webpackCompile(webpackConfig) {
    const stats = await util.promisify(webpack)(webpackConfig);
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
    }) + '\n\n');

    if(stats.hasErrors()) {
        console.log(chalk.red('Build failed with errors.\n'));
        process.exit(1);
    }
}

async function compileSSRAndStartServer() {
    hasStartServer = true;
    console.time('build');
    const spinner = ora('building bundle for production...\n');
    spinner.start()

    await webpackCompile(webpackClientConfig);
    await webpackCompile(webpackServerConfig);

    console.log(chalk.cyan('build complete.\n'));
    console.log(chalk.yellow([
        '  Tip: built files are meant to be served over an HTTP server.\n',
        '  Opening template.html over file. \n',
    ].join('')));
    console.timeEnd('build');
    spinner.stop();
    const stats = await util.promisify(nodemon)(path.resolve(paths.appServer, 'app.js'))
    console.log(chalk.cyan('server start successfully.\n'));
    if(stats.hasErrors()) {
        console.log(chalk.red('server start with errors.\n'));
        process.exit(1);
    }
}

start().catch(err => {
    if(err && err.message) {
        console.log(err.message);
    }
    process.exit(1);
})

function start() {
    console.log('creating a unoptimized development build....');

    const compiler = webpack(config);
    return new Promise((resolve, reject) => {
        const argv = process.argv.slice(2);
        const watchMode = argv.indexOf('--watch') > -1 || argv.indexOf('-w') > -1;

        const callback = (err, stats) => {
            if(err) {
                return reject(err);
            }
            console.log(
                stats.toString({
                    colors: require('supports-color').stdout,
                })
            );
            if(!hasStartServer) {
                compileSSRAndStartServer();
            }
            if(!watchMode) {
                return resolve({});
            }
        }
        if(watchMode) {
            compiler.watch(
                {
                    aggregateTimeout: 300,
                    ignored: [paths.appBuild + '/**/*', paths.appPath + '/log/**/*']
                },
                callback
            )
        } else {
            compiler.run(callback);
        }
    });
}
