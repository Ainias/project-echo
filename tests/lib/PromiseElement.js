let PromiseElementList = null;

class PromiseElement {

    constructor(promiseResolvingToElement) {
        this._internalPromise = promiseResolvingToElement;
    }

    $(selector) {
        return new PromiseElement(this.getPromise().then(elem => elem.$(selector)));
    }

    $$(selector) {
        return new PromiseElementList(this.getPromise().then(elem => elem.$$(selector)));
    }

    async getPromise() {
        return await this._internalPromise;
    }

    async isDisplayed() {
        let elem = await this.getPromise();
        return elem.isDisplayed();
    }

    async isExisting() {
        return (await this.getPromise()).isExisting();
    }

    async isDisplayedInViewport() {
        return (await this.getPromise()).isDisplayedInViewport();
    }

    async click() {
        return (await this.getPromise()).click();
    }

    async getText() {
        return (await (await this.getPromise()).getText()).trim();
    }

    async matchText(regex) {
        return (await this.getText()).match(regex) !== null;
    }

    async expectMatchText(regex) {
        if (!await this.matchText(regex))
            throw new Error("expected '" + await this.getText() + "' to match " + regex.toString() + "\nDid you forget to escape?")
    }

    scrollIntoView(scrollIntoViewOptions){
        this._internalPromise = this.getPromise().then(elem => {
            elem.scrollIntoView(scrollIntoViewOptions);
            return elem;
        });
        return this;
    }

    async getLowercaseText() {
        return (await (await this.getPromise()).getText()).trim().toLowerCase();
    }

    async getAttribute(attr) {
        return (await this.getPromise()).getAttribute(attr);
    }

    async setValue(value) {
        return (await this.getPromise()).setValue(value);
    }

    async getTagName() {
        return (await this.getPromise()).getTagName();
    }

    async isTag(tag) {
        return (await this.getTagName() === tag);
    }

    async isSelected() {
        return (await this.getPromise()).isSelected();
    }

    async selectByAttribute(attribute, value) {
        return (await this.getPromise()).selectByAttribute(attribute, value);
    }

    async getValue() {
        return (await this.getPromise()).getValue();
    }

    then(onFullfilled){
        this.getPromise().then(onFullfilled);
    }

    pause(miliseconds) {
        return new PromiseElement(this.getPromise().then(async res => {
            await browser.pause(miliseconds);
            return res;
        }));
    }
}

module.exports = PromiseElement;
PromiseElementList = require("./PromiseElementList");