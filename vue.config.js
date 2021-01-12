module.exports = {
    configureWebpack: config => {
        return { resolve: { mainFields: ['main', 'module'] } }
    }
}
