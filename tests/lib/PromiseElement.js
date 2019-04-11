class PromiseElement {

    constructor(promiseResolvingToElement) {
        this._internalPromise = promiseResolvingToElement;
    }

    async getPromise(){
        return await this._internalPromise;
    }

    async isDisplayed(){
        let elem = await this.getPromise();
        return elem.isDisplayed();
    }

    async click(){
        return (await this.getPromise()).click();
    }
}
module.exports = PromiseElement;