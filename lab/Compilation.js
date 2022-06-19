const path = require('path')
const { Tapable, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const Parser = require('./Parser');
const parser = new Parser();
const normalModuleFactory = new NormalModuleFactory();


class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.enteries = [];
        this.modules = [];
        this.hooks = {
            succeedModule: new SyncHook(['module'])
        }
    }

    addEntry(context, entry, name, callback) {
        this._addModuleChain(context, entry, name, (err, module) => {
            callback(err, module);
        })
    }

    _addModuleChain(context, rawRequest, name, callback) {
        let entryModule = normalModuleFactory.create({
            name,
            context,
            rawRequest,
            resource: path.posix.join(context, entry),
            parser
        });
        this.enteries.push(entryModule);
        this.modules.push(entryModule);

        const afterBuild = (err, module) => {
            if (module.dependencies.length > 0) {
                this.processModuleDependencies(module, err => {
                    callback(err, module);
                })
            }else {
                callback(module);
            }
        }

        this.buildModule(entryModule, afterBuild);
    }

    buildModule(module, afterBuild) {
        module.build(this, (err) => {
            this.hooks.succeedModule.call(module);
            afterBuild(err);
        })
    }
    processModuleDependencies(module,callback) {
        //获取当前模块的依赖模块
        let dependencies = module.dependencies;

    }
}

module.exports = Compilation;
