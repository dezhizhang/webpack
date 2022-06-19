const path = require('path')
const { Tapable, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');
const Parser = require('./Parser');
const async = require('neo-async');
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
        this._modules = {
            
        }
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
        this.createModule({
            name,
            context,
            rawRequest,
            parser,
            resource:path.posix.join(context,rawRequest)
        },entryModule => this.enteries.push(entryModule),callback)
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
        async.forEach(dependencies,(dependency,done) => {
            let { name,context,rawRequest,resource,moduleId } = dependency;
        },callback)
    }
    //创建并编译模块
    createModule(data,addEntry,callback) {
        let module = normalModuleFactory.create(data);
        module.moduleId = './' + path.posix.relative(this.context,module.resource);
        addEntry && addEntry(module);
        this.modules.push(module);
        this._modules[moduleId] = module;
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
}

module.exports = Compilation;
