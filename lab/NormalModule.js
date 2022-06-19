

class NormalModule{
    constructor({name,context,rawRequest,resource,parser}) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
        this.parser = parser;
        this._source;
        this._ast;
    }
    build(compilation,callback) {
        this.doBuild(compilation,err => {
            this._ast = this.parser.parse(this._source);
            callback();
        })
    }

    doBuild(compilation,callback) {
        this.getSource(compilation,(err,source) => {
            this._source = source;
            callback();
        });
    }

    getSource(compilation,callback) {
        compilation.inputFileSystem.readFile(this.resource,'utf-8',callback)
    }

}

module.exports = NormalModule;
