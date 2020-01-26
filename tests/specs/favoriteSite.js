const find = require("../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const custom$ = find.oneCustom;
const functions = require("../lib/functions");

describe("favorite site", () => {
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

        await $(".footer .icon.favorites").click();
        let favs = $$(".favorite.is-favorite");
        let length = await favs.getLength();
        for(let i = 0; i < length; i++){
            await favs.get(i).click();
        }
        browser.pause(1000);
        await $(".footer .icon.home").click();

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
        await browser.pause(500);
        await $(".favorite.is-favorite").click();
        await browser.pause(3000);
        expect(await $(".favorite.is-favorite").isExisting()).toBeFalsy();

        await $(".footer .icon.favorites").click();
        expect(await $(".no-events").isDisplayed()).toBeTruthy();

        await $(".footer .icon.search").click();
        await $("#search-button").click();

        let favorites = $$(".favorite:not(.is-favorite)");

        await favorites.get(0).click();
        await favorites.get(1).click();
        await favorites.get(2).click();
        await favorites.get(3).click();
        await favorites.get(4).click();
        await favorites.get(6).click();
        await favorites.get(7).click();

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

    it("repeated Event favorites", async function () {
        await $(".footer .icon.calendar").click();
        await $("#button-right").click();

        await $(".day-number=18").click();
        await $(".favorite").click();

        expect(await $(".favorite.is-favorite").isExisting()).toBeTruthy();
        await $(".footer .icon.favorites").click();
        let eventOverviewContainer = $$("#event-container-future .event-overview-container").filterOne((async elem => {
            return (await elem.$(".day").getText()) === "Di 18.06."
        }));

        expect(await eventOverviewContainer.isExisting()).toBeTruthy();
        await eventOverviewContainer.$(".event-overview").click();
        await $(".favorite.is-favorite").click();

        await browser.pause(1000);
        expect(await $(".favorite.is-favorite").isExisting()).toBeFalsy();

        await $(".footer .icon.favorites").click();
        expect(await eventOverviewContainer.isExisting()).toBeFalsy();

        await $(".footer .icon.calendar").click();
        await $("#button-right").click();

        await $(".day-number=27").click();
        await $(".favorite").click();

        expect(await $(".favorite.is-favorite").isExisting()).toBeTruthy();

        await $(".footer .icon.favorites").click();
        eventOverviewContainer = $$("#event-container-future .event-overview-container").filterOne((async elem => {
            return (await elem.$(".day").getText()) === "Do 27.06."
        }));
        expect(await eventOverviewContainer.$(".event-overview").isExisting()).toBeTruthy();
        await eventOverviewContainer.click();
        await $(".favorite.is-favorite").click();

        await browser.pause(500);
        expect(await $(".favorite.is-favorite").isExisting()).toBeFalsy();

        await $(".footer .icon.favorites").click();
        await browser.pause(1000);
        expect(await eventOverviewContainer.isExisting()).toBeFalsy();
    });
});