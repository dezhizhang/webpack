

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
    

}

module.exports = NormalModule;
