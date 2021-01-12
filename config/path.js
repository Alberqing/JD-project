'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'vue',
    'json',
    'web.jsx',
    'jsx',
    'css',
    'less',
    'sass',
    'scss',
    'styl',
    'stylus'
];

const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
    )
    if(extension) {
        return resolveFn(`${filePath}.${extension}`)
    }

    return resolveFn(`${filePath}.js`);
}

module.exports = {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appBuild: resolveApp('dist'),
    appPackageJson: resolveApp('package.json'),
    vueSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveModule(resolveApp, 'src/setupTests'),
    proxySetup: resolveApp('src/setupProxy.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: '{{staticPrefix}}/',
    appServer: resolveApp('server'),

    get appPublic() {
        throw new Error('appPublic is not valid');
    },
    get appHtml() {
        throw new Error('appHtml is not valid');
    },
    get appIndexJs() {
        throw new Error('appIndexJs is not valid');
    }
}
