const Koa = require('koa');
// const serverRender = require('./middleware/serverRender');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
router.use('/app/home', require('./routes'))
// app.use(serverRender)

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('服务器启动在http://127.0.0.1:3000');
})