const Koa = require('koa');
const serverRender = require('./middleware/serverRender');
const koaStatic = require('koa-static')
const Router = require('koa-router');
// const routes = require('./routes');
const mapRoute = require('./middleware/mapRoute');
const path = require('path');

const router = new Router();
const app = new Koa();

const resolve = file => path.resolve(__dirname, file);

app.use(koaStatic(resolve('./dist')))
// app.use(serverRender)
// router.use('/app/home', require('./routes'))

// app.use(router.routes());
// app.use(router.allowedMethods());
// app.use(router.allowedMethods());

// 第 3 步：添加一个中间件来处理所有请求
app.use(mapRoute);

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

app.listen(3000, () => {
    console.log('服务器启动在http://127.0.0.1:3000');
})
