const PromiseElement = require("./PromiseElement");
const PromiseElementList = require("./PromiseElementList");

function find(selector) {
    return new PromiseElement($(selector));
}

function findCustom(strategy, selector) {
    return new PromiseElement(custom$(strategy, selector));
}

function findMultiple(selector) {
    return new PromiseElementList($$(selector));
}

function findMultipleCustom(strategy, selector) {
    return new PromiseElementList(custom$$(strategy, selector));
}

module.exports = {one: find, multiple: findMultiple, oneCustom: findCustom, multipleCustom: findMultipleCustom};