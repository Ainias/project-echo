let PromiseElementList = null;

class PromiseElement {

    constructor(promiseResolvingToElement) {
        this._internalPromise = promiseResolvingToElement;
    }


    $(selector){
        return new PromiseElement(this.getPromise().then(elem => elem.$(selector)));
    }

    $$(selector){
        return new PromiseElementList(this.getPromise().then(elem => elem.$$(selector)));
    }

    async getPromise(){
        return await this._internalPromise;
    }

    async isDisplayed(){
        let elem = await this.getPromise();
        return elem.isDisplayed();
    }

    async isDisplayedInViewport(){
        return (await this.getPromise()).isDisplayedInViewport();
    }

    async click(){
        return (await this.getPromise()).click();
    }

    async getText(){
        return (await this.getPromise()).getText();
    }

    async getAttribute(attr){
        return (await this.getPromise()).getAttribute(attr);
    }

    async setValue(value){
        return (await this.getPromise()).setValue(value);
    }

    pause(miliseconds){
        return new PromiseElement(this.getPromise().then(async res => {
            await browser.pause(miliseconds);
            return res;
        }));
    }
}
module.exports = PromiseElement;
PromiseElementList = require("./PromiseElementList");