

class Stats{
    constructor(compilation) {
        this.enteries = compilation.enteries;
        this.modules = compilation.modules;
        this.chunks= compilation.chunks;
    }

    toJson() {
        return this
    }
}

module.exports = Stats;
