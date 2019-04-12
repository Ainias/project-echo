const find = require("../lib/PromiseSelector");
const $ = find.one;
// const $$ = find.multiple;

// const EnvController = require("../setup");

describe("first test suite", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

    let baseUrl = null;
    beforeAll(async () => {
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
        await browser.url(baseUrl);

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed()
        });
        await find.one("[data-translation='churches']").click();
    });

    it("first test", async function () {
        // let element = $("#main-content");
        // expect(await element.isDisplayed()).toEqual(true);
        // expect(await $(".alphabet-class"))
        await browser.pause(1000*60*10)
    });
});