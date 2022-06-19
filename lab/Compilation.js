const { Tapable, SyncHook } = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory');

const normalModuleFactory = new NormalModuleFactory();


class Compilation extends Tapable{
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
            succeedModule:new SyncHook(['module'])
        }
    }

    addEntry(context,entry,name,callback) {
        this._addModuleChain(context,entry,name,(err,module) => {
            callback(err,module);
        })
    }

    _addModuleChain(context,rawRequest,name,callback) {
       let entryModule =  normalModuleFactory.create({
            name,
            context,
            rawRequest,
            resource:path.posix.join(context,entry)
        });
        this.enteries.push(entryModule);
        this.modules.push(entryModule);
    }

}

module.exports = Compilation;
