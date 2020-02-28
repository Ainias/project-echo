const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions.js");

describe("search site", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90 * 1000 * browser.config.delayFactor;

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

        await browser.execute((year, month, date, hour, minute, second) => {
            const OldDate = window["Date"];

            class Date extends OldDate {
                constructor(...args) {
                    if (arguments.length === 0) {
                        super(year, month - 1, date, hour, minute, second);
                    } else {
                        super(...arguments)
                    }
                }
            }

            window["Date"] = Date;
        }, 2019, 5, 26, 14, 30, 42);

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed();
        });

        await functions.acceptCookies();
    });

    it("search without parameters", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $("#search-button").click();

        expect(await $(".day=Mi 29.05.")).toBeTruthy();

        expect(await $(".name=Termin 5").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin 5.1").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin 5.2").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin 5.3").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin 5.4").isDisplayed()).toBeTruthy();

        expect(await $(".day=Sa 29.06.")).toBeTruthy();
        expect(await $(".name=Termin later").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin later 2").isDisplayed()).toBeTruthy();

        await $(".name=Termin 5").click();
        await functions.pause(500);
        expect(await $("#event-name").isDisplayed()).toBeTruthy();
    });

    it("search with types", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $(".filter-tag=Konzert").click();
        await $(".filter-tag=Hauskreis").click();
        //
        await functions.pause(3000);
        await $("#search-button").click();
        // await browser.debug();
        await functions.pause(3000);

        expect(await $(".day=Sa 29.06.")).toBeTruthy();
        expect(await $(".name=Termin later").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin later 2").isDisplayed()).toBeTruthy();
    });

    it("search with churches", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $(".filter-tag=Köln City Church").click();
        await $("#search-button").click();

        await functions.pause(1000);
        expect(await $(".day=Sa 29.06.")).toBeTruthy();
        expect(await $(".name=Termin later").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin later 2").isExisting()).toBeFalsy();

        await $("#search-input").click();

        await $(".filter-tag=A City Church").click();
        await $("#search-button").click();
        await functions.pause(500);

        expect(await $(".name=Termin later").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin later 2").isDisplayed()).toBeTruthy();
    });

    it("search with types and churches", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $(".filter-tag=Hauskreis").click();
        await $(".filter-tag=Köln City Church").click();
        await $("#search-button").click();

        expect(await $(".no-events").isDisplayed()).toBeTruthy();

        await $("#search-input").click();

        await $(".filter-tag=Konzert").click();
        await $("#search-button").click();

        await functions.pause(1000);
        expect(await $(".name=Termin later").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin later 2").isExisting()).toBeFalsy();
    });

    it("search with text", async function () {
        await find.one(".footer .icon.search").click();
        await functions.pause(500);
        await $("#search-input").setValue("3");
        await $("#search-button").click();

        expect(await $(".name=Termin 5.3").isDisplayed()).toBeTruthy();
        expect(await $(".name=Termin 5").isExisting()).toBeFalsy();
    });

    it("search via url", async function () {
        await browser.url(baseUrl+"?q=Ter&types=konzert%2Chauskreis&churches=2&s=search");

        await browser.execute((year, month, date, hour, minute, second) => {
            const OldDate = window["Date"];

            class Date extends OldDate {
                constructor(...args) {
                    if (arguments.length === 0) {
                        super(year, month - 1, date, hour, minute, second);
                    } else {
                        super(...arguments)
                    }
                }
            }

            window["Date"] = Date;
        }, 2019, 5, 26, 14, 30, 42);

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed()
        });

        expect(await $(".name=Termin later").isExisting()).toBeFalsy();
        expect(await $(".name=Termin later 2").isDisplayed()).toBeTruthy();
    });
});