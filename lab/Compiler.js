const {Tapable, SyncBailHook, AsyncParallelHook, AsyncSeriesHook, SyncHook} = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory')
const Compilation = require('./Compilation');
const { Stats } = require('webpack');


class Compiler extends Tapable {
    constructor(context) {
        super();
        this.context = context;
        this.hooks = {
            make:new AsyncParallelHook(['compilation']),
            entryOption:new SyncBailHook(['context','entry']),
            run:new AsyncSeriesHook(['compiler']),
            beforeCompile:new AsyncSeriesHook(['params']),
            compile:new SyncHook(['params']),
            thisCompilation:new SyncHook(['compilation','params']),
            compilation:new SyncHook(['compilation','params']),
            afterCompile:new AsyncSeriesHook(['compilation'])
        }
    }
    run(callback) { 
        console.log('compiler run ')
        const finalCallback = (err,stats) => {
            callback(err,stats)
        }

        const onCompiled = (err,compilation) => {
            console.log('onCompiled');
            finalCallback(err,new Stats(compilation))
        }
        this.hooks.beforeRun,callback(this,err => {
            this.hooks.run.callAsync(this,err => {
                this.compile(onCompiled);
            })
        })
    }
    compile(onCompiled) {
        const params = this.newCompilationParams();
        this.hooks.beforeCompile.callAsync(params,err => {
            this.hooks.compile.call(params);
            const compilation = this.newCompilation(params);
            this.hooks.make.callAsync(compilation,err => {
                console.log('make完成')
                onCompiled(err,compilation);
            })
        })
    }

    createCompilation() {
        return new Compilation();
    }

    newCompilation(params) {
        const compilation = this.createCompilation();
        this.hooks.thisCompilation.call(compilation,params);
        this.hooks.compilation.call(compilation,params);
        return compilation;

    }

    newCompilationParams() {
        const params = {
            normalModuleFactory:new NormalModuleFactory(),
        }
        return params;
    }
}


module.exports = Compiler;
