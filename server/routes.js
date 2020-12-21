const Router = require('koa-router');
const test = require('./controller/app/test');

const router = new Router();


router.get('/app/test', async (ctx, next) => {
    const context = {
        pageData: test,
        url: ctx.url
    };
    await ctx.serverRender(context);
    next();
})

module.exports = router.routes();
