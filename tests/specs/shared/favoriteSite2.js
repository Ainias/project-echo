const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const custom$ = find.oneCustom;
const functions = require("../../lib/functions");

describe("favorite site 2", () => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000*90*browser.config.delayFactor;

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

        await functions.acceptCookies();

        await $(".footer .icon.favorites").click();
        let favs = $$(".favorite.is-favorite");
        let length = await favs.getLength();
        for(let i = 0; i < length; i++){
            await favs.get(i).click();
        }
        functions.pause(1000);
        await $(".footer .icon.home").click();

    });

    it("repeated Event favorites", async function () {
        await $(".footer .icon.calendar").click();
        await functions.pause(500);
        await $("#button-right").click();
        await functions.pause(2000);

        await $(".day-number=18").click();
        await functions.pause(1000);
        await $(".favorite").click();
        await functions.acceptAlert();
        await functions.acceptAlert();
        await functions.pause(1000);

        expect(await $(".favorite.is-favorite").isExisting()).toBeTruthy();
        await $(".footer .icon.favorites").click();
        await functions.pause(1000);
        let eventOverviewContainer = $$("#event-container-future .event-overview-container").filterOne((async elem => {
            return (await elem.$(".day").getText()) === "Di 18.06.";
        }));

        await functions.pause(2000);
        expect(await eventOverviewContainer.isExisting()).toBeTruthy();
        await eventOverviewContainer.$(".event-overview").click();
        await functions.pause(1000);
        await $(".favorite.is-favorite").click();

        await functions.pause(2000);
        expect(await $(".favorite.is-favorite").isExisting()).toBeFalsy();

        await $(".footer .icon.favorites").click();
        expect(await eventOverviewContainer.isExisting()).toBeFalsy();

        await $(".footer .icon.calendar").click();
        await functions.pause(1000);
        await $("#button-right").click();
        await functions.pause(2000);

        await $(".day-number=27").click();
        await functions.pause(500);
        await $(".favorite").click();
        await functions.pause(1000);

        expect(await $(".favorite.is-favorite").isExisting()).toBeTruthy();
        await $(".footer .icon.favorites").click();
        await functions.pause(3000);

        eventOverviewContainer = $$("#event-container-future .event-overview-container").filterOne((async elem => {
            return (await elem.$(".day").getText()) === "Do 27.06."
        }));

        expect(await eventOverviewContainer.$(".event-overview").isExisting()).toBeTruthy();
        await eventOverviewContainer.click();
        await $(".favorite.is-favorite").click();

        // await browser.debug();
        await functions.pause(3000);
        expect(await $(".favorite.is-favorite").isExisting()).toBeFalsy();

        await $(".footer .icon.favorites").click();
        await functions.pause(1000);
        expect(await eventOverviewContainer.isExisting()).toBeFalsy();
    });
});
