// const Koa = require('koa');
// const serverRender = require('./middleware/serverRender');
// const koaStatic = require('koa-static')
// const Router = require('koa-router');
// const routes = require('./routes');
//
// const router = new Router();
// const app = new Koa();
//
// app.use(koaStatic(resolve('./dist')))
//
// app.use(serverRender)
//
// app.use(routes);
//
// // router.use('/app/home', require('./routes'))
//
// app.use(router.routes());
// app.use(router.allowedMethods());
// app.use(router.allowedMethods());
//
// app.on('error', (err, ctx) => {
//     console.error('server error', err, ctx);
// });
//
// app.listen(3000, () => {
//     console.log('服务器启动在http://127.0.0.1:3000');
// })
//


const fs = require("fs");
const Koa = require("koa");
const path = require("path");
const koaStatic = require('koa-static')
const app = new Koa();

const resolve = file => path.resolve(__dirname, file);
// 开放dist目录
app.use(koaStatic(resolve('./dist')))

// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require("vue-server-renderer");
const template = fs.readFileSync(path.resolve(__dirname, '../dist/client/template.html'), 'UTF-8');

const serverBundle = require(path.resolve(__dirname, '../dist/server/vue-ssr-server-bundle.json'));
const clientMainfest = require(path.resolve(__dirname, '../dist/client/vue-ssr-client-manifest.json'));

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientMainfest,
});

function renderToString(context) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            err ? reject(err) : resolve(html);
        });
    });
}
// 第 3 步：添加一个中间件来处理所有请求
app.use(async (ctx, next) => {
    const context = {
        title: "ssr test",
        url: ctx.url
    };
    // 将 context 数据渲染为 HTML
    const html = await renderToString(context);
    ctx.body = html;
});

const port = 3000;
app.listen(port, function() {
    console.log(`server started at localhost:${port}`);
});
