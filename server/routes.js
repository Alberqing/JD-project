const Router = require('koa-router');

const router = new Router();

router.get('/app/home', async (ctx, next) => {
    const context = {
        pageData: require(`./controller${ctx.url}`),
        url: ctx.url
    };
    await ctx.serverRender(context);
    next();
})

module.exports = router.routes();
