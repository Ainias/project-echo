const find = require("../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;

describe("first test suite", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

    let baseUrl = null;
    beforeAll(async () => {
        console.log(browser);
        if (browser.config.baseUrl.trim() !== "") {
            baseUrl = browser.config.baseUrl;
        } else {
            baseUrl = await browser.getUrl();
        }

        browser.setTimeout({
            implicit: 5000
        });
    });

    beforeEach(async function () {
        console.log("baseUrl", baseUrl);

        await browser.url(baseUrl);

        await browser.waitUntil(async () => {
            let element = find.one("#main-content");
            return await element.isDisplayed()
        })
    });

    afterEach(async function () {
    });

    it("first test", async function () {
        let element = find("#main-content");
        expect(await element.isDisplayed()).toEqual(true);
    });
});