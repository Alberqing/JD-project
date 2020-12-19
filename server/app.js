const Koa = require('koa');
const serverRender = require('./middleware/serverRender');
const Router = require('koa-router');
const routes = require("./routes");

const app = new Koa();
const router = new Router();

app.use(serverRender);

// 第 3 步：添加一个中间件来处理所有请求
app.use(routes);
app.use(router.routes());
app.use(router.allowedMethods());

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app.listen(3000, () => {
    console.log('服务器启动在http://127.0.0.1:3000');
})
