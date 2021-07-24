const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions.js");

describe("podcast suite", () => {
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

        //Wait two times, since podcast-tab is only shown when data is there
        //which is after a sync
        await browser.url(baseUrl);
        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed()
        });

        await functions.acceptCookies();

        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await find.one("#responsive-menu [data-translation='podcasts']").click();
        } else {
            await find.one("[data-translation='podcasts']").click();
        }
    });

    fit("podcast test", async function () {
        await $(".alphabet-section.A .name").click();

        expect(await $("#name").getText()).toEqual("ANSEHEN DES PODCASTS");
        expect(await $("#description").getText()).toEqual("Deutsche Beschreibung mit Fett!");

        if (browser.config.isMobile) {
            expect(await $$(".release-circle").get(1).getText()).toEqual("Sonntags");
            expect(await $$(".duration").get(1).getText()).toEqual("~ 25 Minuten");
        } else {
            expect(await $$(".release-circle").get(0).getText()).toEqual("Sonntags");
            expect(await $$(".duration").get(0).getText()).toEqual("~ 25 Minuten");
        }

        expect(await $("#spotify-link").getAttribute("href")).toEqual("https://my-website.de");
        expect(await $("#youtube-link").getAttribute("href")).toEqual(null);
    });
});
