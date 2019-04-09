class PromiseElement {

    constructor(promiseResolvingToElement) {
        this._internalPromise = promiseResolvingToElement;
    }

    async getPromise(){
        return this._internalPromise;
    }

    async isDisplayed(){
        return (await this.getPromise()).isDisplayed();
    }
}
module.exports = PromiseElement;