const webpack = require('./lab/webpack');
const webpackOptions = require('./webpck.config');

const compiler = webpack(webpackOptions);

debugger

compiler.run((err,stats) => {
    console.log(err);
    console.log(
        // stats.toJson({
        //     entries:true,
        //     chunks:true,
        //     modules:true,
        //     _modules:true,
        //     assets:true
        // })
    )
});

