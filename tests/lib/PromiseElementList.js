const PromiseElement = require("./PromiseElement");

class PromiseElementList extends PromiseElement{
    async getLength(){
        return (await this.getPromise()).length;
    }

    get(index){
        return new PromiseElement(this.getPromise().then(res => res[index]));
    }
}
module.exports = PromiseElementList;