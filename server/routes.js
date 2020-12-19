const Router = require('koa-router');

const router = new Router();


router.get('/app/test', async (ctx, next) => {
    const context = {
        title: "ssr test",
        url: ctx.url
    };
    await ctx.serverRender(context);
    next();
})

module.exports = router.routes();
