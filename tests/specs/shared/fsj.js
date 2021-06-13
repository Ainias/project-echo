const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions.js");

xdescribe("fsj suite", () => {
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
        await functions.mockMatomo();
    });

    beforeEach(async function () {
        await browser.url(baseUrl);

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed()
        });

        await functions.acceptCookies();

        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await find.one("#responsive-menu [data-translation='fsjs']").click();
        } else {
            await find.one("[data-translation='fsjs']").click();
        }
    });

    it("check fsj list", async function () {
        let elem = $(".alphabet-section.M .church-info");
        expect(await elem.isDisplayed()).toBeTruthy();
        expect(await elem.$(".name .translation").getText()).toEqual("Mein FSJ");
        expect(await elem.$(".link").getText()).toEqual("Mehr erfahren");

        let aElem = $(".alphabet-section.A");
        let vElem = $(".alphabet-section.V");
        expect(await aElem.isDisplayedInViewport()).toBeTruthy();
        expect(await vElem.isDisplayedInViewport()).toBeFalsy();
        await $(".alphabet-scroll-to[data-letter=V]").click();
        await functions.pause(700);

        expect(await aElem.isDisplayedInViewport()).toBeFalsy();
        expect(await vElem.isDisplayedInViewport()).toBeTruthy();
        await $(".alphabet-scroll-to[data-letter=A]").click();
        await functions.pause(700);

        expect(await aElem.isDisplayedInViewport()).toBeTruthy();
        expect(await vElem.isDisplayedInViewport()).toBeFalsy();

        expect(await vElem.$$(".church-info").getLength()).toEqual(2);
    });

    it("church site", async function () {
        await $(".alphabet-section.M .name").click();

        expect(await $("#name").getText()).toEqual("MEIN FSJ");
        expect(await $("#description").getText()).toEqual("mein FSJ 1");

        let linkElem = $("#website");
        expect(await linkElem.getText()).toEqual("silas.link");
        expect(await linkElem.getAttribute("href")).toEqual("https://silas.link/");
    });
});
