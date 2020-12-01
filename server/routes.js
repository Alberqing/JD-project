const router = require('koa-router')();

router.get('/app/home', (ctx, next) => {
    ctx.body = 'home';
})

module.exports = router;
