
const path = require('path');
const types = require('babel-types');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;

class NormalModule{
    constructor({name,context,rawRequest,resource,parser}) {
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
        this.parser = parser;
        this._source;
        this._ast;
        this.dependencies = [];
    }
    build(compilation,callback) {
        this.doBuild(compilation,err => {
            this._ast = this.parser.parse(this._source);
            traverse(this._ast,{
                CallExpression:(nodePath) => {
                    let node = nodePath.node;
                    if(node.callee.name === 'require') {
                        node.callee.name = '__webpack_require__';
                        let moduleName = node.arguments[0].value;
                        let extName = moduleName.split(path.posix.sep).pop().indexOf('.') === -1 ? '.js':'';
                        let depResource = path.posix.join(path.posix.dirname(this.resource),this.moduleName + extName);
                        let depModuleId = './' + path.posix.relative(this.context,depResource);
                        node.arguments = [types.stringLiteral(depModuleId)];
                        this.dependencies.push({
                            name:this.name,
                            context:this.context,
                            rawRequest:moduleName,
                            moduleId:depModuleId,
                            resource:depResource
                        });
                            

                    }
                }
            })
            // callback();
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
