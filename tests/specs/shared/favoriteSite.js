const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const custom$ = find.oneCustom;
const functions = require("../../lib/functions");

describe("favorite site 1", () => {

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
        // await functions.mockMatomo();
    });

    beforeEach(async function () {
        await browser.url(baseUrl);

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

    it("show favorites", async function () {
        await $(".footer .icon.favorites").click();
        expect(await $(".no-events").isDisplayed()).toBeTruthy();

        await $(".footer .icon.calendar").click();
        await functions.pause(1000);
        await $("#button-left").click();
        await $(".day-number=11").click();
        await $(".favorite").click();
        await functions.acceptInsertFavorites();
        await functions.acceptAlert();
        await functions.acceptAlert();

        expect(await $(".favorite.is-favorite").isExisting()).toBeTruthy();

        await $(".footer .icon.favorites").click();
        expect(await $(".name=Favorites 1 Test 1").isExisting()).toBeTruthy();
        await $(".name=Favorites 1 Test 1").click();
        await functions.pause(500);
        await $(".favorite.is-favorite").click();
        await functions.pause(1000);
        expect(await $(".favorite.is-favorite").isExisting()).toBeFalsy();

        await $(".footer .icon.favorites").click();
        expect(await $(".no-events").isDisplayed()).toBeTruthy();
    });

});
