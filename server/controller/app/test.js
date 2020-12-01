async function ssrRender(ctx, tplData) {
    console.log(ctx.path);
    const context = Object.assign({
        router: ctx.path,
    });
    await ctx.serverRender(context);
}
