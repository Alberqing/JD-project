const { createBundleRenderer } = require('vue-server-renderer');

const path = require('path');
const fs = require('fs');
const template = fs.readFileSync(path.resolve(__dirname, '../../dist/static/ssr/template.html'), 'UTF-8');

const serverBundle = require(path.resolve(__dirname, '../../dist/static/ssr/vue-ssr-server-bundle.json'));
const clientMainfest = require(path.resolve(__dirname, '../../dist/static/ssr/vue-ssr-client-manifest.json'));

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientMainfest,
});

module.exports = async (ctx, next) => {
    ctx.serverRender = async context => {
        try {
            const temp = await new Promise((resolve, reject) => {
                renderer.renderToString(context, (err, html) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(html);
                });
            });

            ctx.body = temp;
            ctx.type = 'text/html';
        } catch (err) {
            console.log(err);
        }
    };

    await next();
};
