
const { Tapable,AsyncSeriesHook } = require('tapable')

class Compiler extends Tapable {
    constructor(context) {
        super();
        this.context = context;
        this.hooks = {
            done:new AsyncSeriesHook(['stats'])
        }
    }
    // 开始编译的入口
    run(callback) {
        console.log('Compiler in run ')
    }
}

module.exports = Compiler;