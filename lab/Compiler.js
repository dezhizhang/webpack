const { Tapable, SyncBailHook, AsyncParallelHook, AsyncSeriesHook, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory')
const Compilation = require('./Compilation');
const Stats = require('./Stats');
const mkdirp = require('mkdirp');
const path = require('path');

class Compiler extends Tapable {
    constructor(context) {
        super();
        this.context = context;
        this.hooks = {
            make: new AsyncParallelHook(['compilation']),
            entryOption: new SyncBailHook(['context', 'entry']),
            run: new AsyncSeriesHook(['compiler']),
            beforeRun: new AsyncSeriesHook(['compiler']),
            beforeCompile: new AsyncSeriesHook(['params']),
            compile: new SyncHook(['params']),
            thisCompilation: new SyncHook(['compilation', 'params']),
            compilation: new SyncHook(['compilation', 'params']),
            afterCompile: new AsyncSeriesHook(['compilation']),
            emit: new AsyncSeriesHook(['compilation']),
            done: new AsyncSeriesHook(['stats'])
        }
    }
    run(callback) {
        console.log('compiler run ')
        const finalCallback = (err, stats) => {
            console.log('stats', stats)
            callback(err, stats)
        }

        const onCompiled = (err, compilation) => {
            // console.log('onCompiled');

            const emitFile = (err) => {

            }
            this.hooks.emit.callAsync(compilation,() => {
                mkdirp(this.options.output.path,emitFile)
            })

            finalCallback(err, new Stats(compilation))
        }
        this.hooks.beforeRun.callAsync(this, err => {
            this.hooks.run.callAsync(this, err => {
                this.compile(onCompiled);
            })
        });
    }
    compile(onCompiled) {
        const params = this.newCompilationParams();
        console.log('params',params)
        this.hooks.beforeCompile.callAsync(params, err => {
            this.hooks.compile.call(params);
            const compilation = this.newCompilation(params);
            this.hooks.make.callAsync(compilation, err => {
                console.log('make完成')
                compilation.seal(err => {
                    this.hooks.afterCompile.callAsync(compilation, (err) => {
                        onCompiled(err, compilation);
                    })
                })
                onCompiled(err, compilation);
            })
        })
    }

    createCompilation() {
        return new Compilation();
    }

    newCompilation(params) {
        const compilation = this.createCompilation();
        this.hooks.thisCompilation.call(compilation, params);
        this.hooks.compilation.call(compilation, params);
        return compilation;

    }

    newCompilationParams() {
        const params = {
            normalModuleFactory: new NormalModuleFactory(),
        }
        return params;
    }
}


module.exports = Compiler;
