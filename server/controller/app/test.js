const serverRender = require('../../middleware/serverRender');

async function ssrRender(ctx, tplData) {
    const context = Object.assign({
        router: ctx.url,
    });
    await serverRender(context)
}

exports.get = async function(ctx) {
    console.log(111+"kkk");
    await ssrRender({url: ctx.url});
}
