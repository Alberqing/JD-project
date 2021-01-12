const path = require('path');
const globby = require('globby');
const fs = require('fs');


module.exports = function() {
    const routePagePath = path.resolve(__dirname, './src/views');
    const pages = path.join(routePagePath, './*.vue')

    console.log(pages);
    // 将路由页面所在目录添加到依赖当中，当有文件变化，会触发这个loader
    this.addContextDependency(pages);

    const fileNames = globby.sync(pages, {ignore: [], absolute: true});

    const PAGE_ROUTE = /export const PAGE_ROUTE = [ ]*['"]([^'"]+)['"][;]*/gm;
    const LAZY_LOAD =  /export const LAZY_LOAD = [true || false]*/gm;
    const routes = [];

    fileNames.forEach(fileName => {
        const content = fs.readFileSync(fileName, 'UTF-8');
        let result = {};
        const reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g;
        let noCommentContent = content.replace(reg, function (word) {
            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? '' : word;
        });
        let block = null;
        let chunkName = null;

        while ((block = PAGE_ROUTE.exec(noCommentContent)) !== null) {
            const match = block[0] && block[1];

            // 匹配到 routePath 直接返回
            if (match) {
                if (!result) result = {};
                result.path = block[1];
                result.name = block[1].split('/')[1];
                chunkName = block[1].split('/')[1];
            }
        }

        if(content.match(LAZY_LOAD) !== null) {
            if(content.match(LAZY_LOAD)[0].split('=')[1].trim() !== 'false') {
                result.component = `() => import(/* webpackChunkName: '${chunkName}' */ '${fileName}')`
            } else {
                result.component = `() => import('${fileName}')`
            }
        } else {
            result.component = `() => import(/* webpackChunkName: '${chunkName}' */ '${fileName}')`
        }
        routes.push(`    {
        path: '${result.path}',
        component: ${result.component},
    }`);
    });

    const res = `// 此文件是通过脚本生成的，直接编辑无效！！！
export const routers = [
${routes.join(',\r\n')},
];
`
    fs.writeFile(path.resolve(__dirname, '../src/views/routers.ts'), res, {encoding: "utf8"}, (err) => {
        console.log(err);
    })
}
