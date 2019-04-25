const PromiseElement = require("./PromiseElement");

class PromiseElementList extends PromiseElement{
    async getLength(){
        return (await this.getPromise()).length;
    }
}
module.exports = PromiseElementList;