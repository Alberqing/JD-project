const serverRender = require('../../middleware/serverRender');

console.log(serverRender());

async function ssrRender(ctx, tplData) {
    const context = Object.assign({
        router: ctx.url,
    });
    serverRender(context).then(res => {
        res();
    });
}

exports.get = async function() {
    await ssrRender({url: '/app/test'});
}
