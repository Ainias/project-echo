const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions.js");

describe("search site", () => {

    let baseUrl = null;
    beforeAll(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90 * 1000 * browser.config.delayFactor;

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
        await functions.deactivateTranslationLogging();
        await functions.logErrors();

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed();
        });

        await functions.acceptCookies();
    });

    afterEach(async function() {
        let errors = await functions.getLoggedErrors();
        expect(errors.length).toEqual(0);
        if (errors.length > 0){
            console.log(errors);
            errors.forEach(err => console.error(err));
        }
        expect(errors).toEqual([]);
    });

    it("search without parameters", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $("#search-button").click();

        expect(await $(".day=Mi 29.05.")).toBeTruthy();

        expect(await $(".name=Search Test 1").isDisplayed()).toBeTruthy();
        expect(await $(".name=Search Test 2").isDisplayed()).toBeTruthy();
        expect(await $(".name=Search Test 3").isDisplayed()).toBeTruthy();
        expect(await $(".name=Search Test 4").isDisplayed()).toBeTruthy();
        expect(await $(".name=Search Test 5").isDisplayed()).toBeTruthy();

        expect(await $(".day=Sa 29.06.")).toBeTruthy();
        expect(await $(".name=Search Test 6").isDisplayed()).toBeTruthy();
        expect(await $(".name=Search Test 7").isDisplayed()).toBeTruthy();

        await $(".name=Search Test 1").click();
        await functions.pause(500);
        expect(await $("#event-name").isDisplayed()).toBeTruthy();
    });

    it("search with types", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $(".filter-tag=Konzert").click();
        await functions.pause(3000);

        const date = new Date(browser.config.fullYear, browser.config.month+1, 29);
        expect(await $(".day="+functions.dayName(date.getDay())+" 29."+(browser.config.month+1)+".")).toBeTruthy();
        expect(await $(".name=Search Test 6").isDisplayed()).toBeTruthy();
    });

    it("search with churches", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $(".filter-tag=Köln City Church").click();

        await functions.pause(1000);

        const date = new Date(browser.config.fullYear, browser.config.month+1, 29);
        expect(await $(".day="+functions.dayName(date.getDay())+" 29."+(browser.config.month+1)+".")).toBeTruthy();
        expect(await $(".name=Search Test 6").isDisplayed()).toBeTruthy();
        expect(await $(".name=Search Test 7").isExisting()).toBeFalsy();

        await $("#search-input").click();

        await $(".filter-tag=A City Church").click();
        // await $("#search-button").click();
        await functions.pause(500);

        expect(await $(".name=Search Test 6").isDisplayed()).toBeFalsy();
        expect(await $(".name=Search Test 7").isDisplayed()).toBeTruthy();
    });

    // xit("search with types and churches", async function () {
    //     await find.one(".footer .icon.search").click();
    //     await functions.pause(500);
    //     await $(".filter-tag=Hauskreis").click();
    //     await $(".filter-tag=Köln City Church").click();
    //     await $("#search-button").click();
    //
    //     expect(await $(".no-events").isDisplayed()).toBeTruthy();
    //
    //     await $("#search-input").click();
    //
    //     await $(".filter-tag=Konzert").click();
    //     await $("#search-button").click();
    //
    //     await functions.pause(1000);
    //     expect(await $(".name=Termin later").isDisplayed()).toBeTruthy();
    //     expect(await $(".name=Termin later 2").isExisting()).toBeFalsy();
    // });

    it("search with text", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $("#search-input").setValue("3");
        await $("#search-button").click();

        expect(await $(".name=Search Test 3").isDisplayed()).toBeTruthy();
        expect(await $(".name=Search Test 1").isExisting()).toBeFalsy();
    });

    it("search via url", async function () {
        await browser.url(baseUrl+"?q=Sear&types=konzert%2Chauskreis&churches=2&s=search");
        await functions.deactivateTranslationLogging();
        await functions.logErrors();

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed();
        });

        expect(await $(".name=Search Test 6").isExisting()).toBeFalsy();
        expect(await $(".name=Search Test 7").isDisplayed()).toBeTruthy();
    });
});
