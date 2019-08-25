const find = require("../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;

describe("search site", () => {
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
    });

    it("show favorites", async function () {
        await $(".footer .icon.favorites").click();
        expect(await $(".no-events").isDisplayed()).toBeTruthy();

        await $(".footer .icon.calendar").click();
        await $(".day-number=29").click();
        await $(".favorite").click();
        expect(await $(".favorite.is-favorite").isExisting()).toBeTruthy();

        await $(".footer .icon.favorites").click();
        expect(await $(".name=Termin 5").isExisting()).toBeTruthy();
        await $(".name=Termin 5").click();
        await $(".favorite.is-favorite").click();
        expect(await $(".favorite.is-favorite").isExisting()).toBeFalsy();

        await $(".footer .icon.favorites").click();
        expect(await $(".no-events").isDisplayed()).toBeTruthy();

        await $(".footer .icon.search").click();
        await $("#search-button").click();
        await $(".favorite:not(.is-favorite)").click();
        await browser.pause(500);
        await $(".favorite:not(.is-favorite)").click();
        await browser.pause(500);
        await $(".favorite:not(.is-favorite)").click();
        await browser.pause(500);
        await $(".favorite:not(.is-favorite)").click();
        await browser.pause(500);
        await $(".favorite:not(.is-favorite)").click();
        await browser.pause(500);
        await $(".favorite:not(.is-favorite)").click();
        await browser.pause(500);
        await $(".favorite:not(.is-favorite)").click();

        await $(".footer .icon.calendar").click();
        await $("#button-left").click();
        await $(".day-number=29").click();
        await $(".favorite:not(.is-favorite)").click();

        await $(".footer .icon.favorites").click();
        expect(await $(".name=Termin 5").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 5.1").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 5.2").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 5.3").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 5.4").isExisting()).toBeTruthy();
        expect(await $(".name=Termin later").isExisting()).toBeTruthy();
        expect(await $(".name=Termin later 2").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 4").isExisting()).toBeTruthy();
    });
});