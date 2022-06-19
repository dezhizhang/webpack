const babylon = require('babylon');
const { Tapable } = require('tapable');

class Parser extends Tapable{
    parser(source) {
        return babylon.parse(source,{
            sourceType:'module', //源代码模板
            plugins:['dynamicImport']
        })
    }
}

module.exports = Parser;
