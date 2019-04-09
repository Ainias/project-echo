const PromiseElement = require("./PromiseElement");
const PromiseElementList = require("./PromiseElementList");

function find(selector) {
    return browser.findElement("css", selector).then(e => {
        return new PromiseElement(e);
    });
}

function findMultiple(selector) {
    return browser.findElements("css", selector).then(e => {
        return new PromiseElementList(e);
    });
}

module.exports = {one: find, multiple: findMultiple};