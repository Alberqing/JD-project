const Router = require('koa-router');

const router = new Router();


router.get('/', (ctx, next) => {
    const context = {
        title: "ssr test",
        url: ctx.url
    };
    console.log(context, "/app/home");
    ctx.serverRender(context);
})

module.exports = router.routes();
