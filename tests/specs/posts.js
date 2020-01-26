const find = require("../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;

describe("post suite", () => {
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
    });

    it("check posts", async function () {
        let posts = $$(".post");
        expect(await posts.get(0).$(".date").getText()).toEqual("05.04.19");
        expect(await posts.get(1).$(".date").getText()).toEqual("04.04.20");
        expect(await posts.get(2).$(".date").getText()).toEqual("05.04.20");
        expect(await posts.get(3).$(".date").getText()).toEqual("06.04.20");
        expect(await posts.get(4).$(".date").getText()).toEqual("04.05.20");

        expect(await posts.get(0).$(".text").getText()).toEqual("5 post");
        expect(await posts.get(1).$(".text").getText()).toEqual("third post");
        expect(await posts.get(2).$(".text").getText()).toEqual("first post");
        expect(await posts.get(3).$(".text").getText()).toEqual("second post");
        expect(await posts.get(4).$(".text").getText()).toEqual("4 post");

    });
});