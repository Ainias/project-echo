const PromiseElement = require("./PromiseElement");
const PromiseElementList = require("./PromiseElementList");

function find(selector) {
    return new PromiseElement($(selector));
}

function findMultiple(selector) {
    return new PromiseElementList($$(selector));
}

module.exports = {one: find, multiple: findMultiple};