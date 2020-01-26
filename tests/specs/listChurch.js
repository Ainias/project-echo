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
        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await find.one("#responsive-menu [data-translation='churches']").click();
        } else {
            await find.one("[data-translation='churches']").click();
        }
    });

    it("check list", async function () {
        let elem = $(".alphabet-section.K .church-info");
        expect(await elem.isDisplayed()).toBeTruthy();
        expect(await elem.$(".name .translation").getText()).toEqual("Köln City Church");
        expect(await elem.$(".place .translation").getText()).toEqual("mehrere Standorte");
        expect(await elem.$(".link").getText()).toEqual("Mehr erfahren");

        let aElem = $(".alphabet-section.A");
        let vElem = $(".alphabet-section.V");
        expect(await aElem.isDisplayedInViewport()).toBeTruthy();
        expect(await vElem.isDisplayedInViewport()).toBeFalsy();
        await $(".alphabet-scroll-to[data-letter=V]").click();
        await browser.pause(700);

        expect(await aElem.isDisplayedInViewport()).toBeFalsy();
        expect(await vElem.isDisplayedInViewport()).toBeTruthy();
        await $(".alphabet-scroll-to[data-letter=A]").click();
        await browser.pause(700);

        expect(await aElem.isDisplayedInViewport()).toBeTruthy();
        expect(await vElem.isDisplayedInViewport()).toBeFalsy();

        expect(await aElem.$(".church-info .place").getText()).toEqual("Cinedom Köln");
        expect(await vElem.$$(".church-info").getLength()).toEqual(2);
    });
});