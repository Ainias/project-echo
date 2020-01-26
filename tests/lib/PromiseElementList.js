const PromiseElement = require("./PromiseElement");

class PromiseElementList extends PromiseElement {
    async getLength() {
        return (await this.getPromise()).length;
    }

    get(index) {
        return new PromiseElement(this.getPromise().then(res => res[index]));
    }

    filter(filterFunc) {
        return new PromiseElementList(this.getPromise().then(async res => {
            let results = [];
            res.forEach(elem => {
                results.push(new Promise(res => {
                    res(filterFunc(new PromiseElement(elem)));
                }).catch((e) => {console.error(e); return false}));
            });
            results = await Promise.all(results);
            let filteredRes = [];

            results.forEach((result, i) => {
                if (result) {
                    filteredRes.push(res[i]);
                }
            });
            return filteredRes;
        }));
    }

    filterOne(filterFunc) {
        return this.filter(filterFunc).get(0);
    }
}

module.exports = PromiseElementList;