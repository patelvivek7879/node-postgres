class Bulb{
    constructor(w)
    {
        this.w = w;
    }
    getWattage(){
        return this.w;
    }
}

module.exports = function(){
    var bb = new Bulb(60);
    return bb;
}