const Koa = require('koa');
const serverRender = require('./middleware/serverRender');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const routes = require("./routes");
const path = require("path");

const app = new Koa();
const router = new Router();

const resolve = file => path.resolve(__dirname, file);

app.use(koaStatic(resolve('../dist/static/ssr')))

app.use(serverRender);
app.use(routes);
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app.listen(8082, () => {
    console.log('服务器启动在http://127.0.0.1:8082');
})
