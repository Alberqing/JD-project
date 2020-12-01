const Router = require('koa-router');
const router = new Router()
router.get('/', (ctx, next) => {
    console.log('ssss')
    ctx.body = 'home';
})

module.exports = router.routes();
