
const path = require('path');

module.exports = {
    context:process.cwd(),
    mode:'deveplopment',
    devtool:false,
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'main.js'
    }
}