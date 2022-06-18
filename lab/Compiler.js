
const Tapable = require('tapable');


class Compiler extends Tapable {
    constructor(context) {
        super();
        this.context = context;
    }
    run(callback) {

    }
}


module.exports.Compiler = Compiler;
