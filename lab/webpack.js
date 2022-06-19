
const Compiler = require('./Compiler')
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin');
const WebpackOptionsApply = require('./WebpackOptionApply');
const webpack = (options) => {
    let compiler = new Compiler(options.context);
    compiler.options = options;

    new NodeEnvironmentPlugin().apply(compiler);
    //挂载配置文件
    if(options.plugins && Array.isArray(options.plugins)) {
        for(const plugin of options.plugins) {
            plugin.apply(compiler)
        }
    }
    new WebpackOptionsApply().process(options,compiler)
    return compiler;
}

exports = module.exports = webpack;