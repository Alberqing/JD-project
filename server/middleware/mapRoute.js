const path = require('path');

module.exports = function () {
    const appPath = 'server/controller';
    require(path.resolve(path.join(appPath, '/app/test'))).get();
}
