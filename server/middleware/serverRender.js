const { createBundleRenderer } = require('vue-server-renderer');

const path = require('path');
const fs = require('fs');
const template = fs.readFileSync(path.resolve(__dirname, '../../dist/client/template.html'), 'UTF-8');

const serverBundle = require(path.resolve(__dirname, '../../dist/server/vue-ssr-server-bundle.json'));
const clientMainfest = require(path.resolve(__dirname, '../../dist/client/vue-ssr-client-manifest.json'));

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientMainfest,
});
const renderToString = function (context) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            if (err) {
                reject(err);
            }
            resolve(html);
        });
    });
};
module.exports = async (ctx, next) => {
    return async function serverRender(context) {
        const html = await renderToString(context);
        console.log(html);
        ctx.body = html;
        ctx.type = 'text/html';
    };
    // console.log(ctx);
    // console.log(next, 6789);
    // await next();
};
