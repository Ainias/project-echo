const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions.js");

describe("calendar site", () => {

    let baseUrl = null;
    beforeAll(async () => {
        if (browser.config.baseUrl.trim() !== "") {
            baseUrl = browser.config.baseUrl;
        } else {
            baseUrl = await browser.getUrl();
        }

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90 * 1000 * browser.config.delayFactor;

        browser.setTimeout({
            implicit: 5000
        });

        await functions.mockMatomo();
    });

    beforeEach(async function () {
        await browser.url(baseUrl);

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed();
        });

        await functions.acceptCookies();
        await find.one(".footer .icon.calendar").click();

        await browser.waitUntil(async () => {
            let element = $("#calendar");
            return await element.isDisplayed();
        });
    });

    it("termin tests", async function () {
        await browser.execute(() => {
            let article = document.getElementById("calendar");
            article.classList.add("testing");
        });

        await functions.pause(3000);
        expect((await $("#month-name").getText()).toUpperCase()).toEqual(functions.monthFullName(browser.config.month) + " " + browser.config.fullYear);
        expect((await $(".day.cell.active").getText()).trim()).toEqual(browser.config.day.toString());

        await $(".day-number=3").click();
        expect((await $(".day.cell.active").getText()).trim()).toEqual("3");
        expect((await $("#event-overview-container #event-container-future").getText()).trim()).toEqual("Keine Events vorhanden");

        await $(".day-number=10").click();
        expect((await $(".day.cell.active").getText()).trim()).toEqual("10");

        expect(await $(".name=Calendar Test 5").isExisting()).toBeTruthy();
        expect(await $(".name=Calendar Test 6").isExisting()).toBeTruthy();
        expect(await $(".name=Calendar Test 7").isExisting()).toBeTruthy();
    });

    // xit("browse calendar", async function () {
    //     await functions.pause(3000);
    //     expect((await $("#month-name").getText()).toUpperCase()).toEqual("MAI 2019");
    //     expect((await $(".day.cell.active").getText()).trim()).toEqual("26");
    //
    //     await $(".day-number=31").click();
    //     expect((await $(".day.cell.active").getText()).trim()).toEqual("31");
    //
    //     await $("#button-right").click();
    //     await functions.pause(2000);
    //     expect((await $("#month-name").getText()).toUpperCase()).toEqual("JUNI 2019");
    //     expect((await $(".day.cell.active").getText()).trim()).toEqual("30");
    //
    //     await $("#button-left").click();
    //     await functions.pause(2000);
    //     expect((await $("#month-name").getText()).toUpperCase()).toEqual("MAI 2019");
    //     expect((await $(".day.cell.active").getText()).trim()).toEqual("30");
    //
    //     await $(".day-number=31").click();
    //     await functions.pause(500);
    //     expect((await $(".day.cell.active").getText()).trim()).toEqual("31");
    //
    //     await $("#button-left").click();
    //     await functions.pause(2000);
    //     expect((await $("#month-name").getText()).toUpperCase()).toEqual("APRIL 2019");
    //     expect((await $(".day.cell.active").getText()).trim()).toEqual("30");
    // });

    it("repeated events displayed", async function () {
        await functions.pause(500);
        await $("#button-right").click();
        await functions.pause(1000);
        await $("#button-right").click();
        await functions.pause(1000);
        expect((await $("#month-name").getText()).toUpperCase()).toEqual(functions.monthFullName(browser.config.month + 2) + " " + browser.config.fullYear);

        const date = new Date(browser.config.fullYear, browser.config.month + 2, 1);
        const blockedDateReference = new Date(browser.config.fullYear, browser.config.month + 2, 18);
        const changedDateReference = new Date(browser.config.fullYear, browser.config.month + 2, 26);
        for (let i = 1; i < 29; i++) {
            date.setDate(i);
            if (date.getDay() === 2 || date.getDay() === 4) {
                await $(".day-number=" + i).click();
                expect(await $(".day.cell.active").getText()).toEqual(i.toString());

                if (i === 20 - blockedDateReference.getDay()
                    || i === 28 - changedDateReference.getDay()
                    || i < 10) {
                    expect(await $(".name=Calendar Test 1").isDisplayed()).toBeFalsy()
                    if (i === 28 - blockedDateReference.getDay()) {
                        await $(".day-number=" + (i - 2)).click();
                        expect(await $(".day.cell.active").getText()).toEqual((i - 2).toString());
                        expect(await $(".name=Calendar Test 1.1").isDisplayed()).toBeTruthy();
                    }
                } else {
                    expect(await $(".name=Calendar Test 1").isDisplayed()).toBeTruthy();
                }
            }
        }
    });

    it("filter link tests", async function () {
        await browser.url(baseUrl + "?date=" + browser.config.fullYear
            + "-" + (browser.config.month + 2) + "-01&filter=%7B\"types\"%3A%5B\"konzert\"%2C\"gottesdienst\"%5D%2C\"churches\"%3A%5B%5D%7D&s=calendar");

        await functions.deactivateTranslationLogging();
        await functions.logErrors();

        await functions.pause(1000);
        expect((await $("#month-name").getText()).toUpperCase()).toEqual(functions.monthFullName(browser.config.month + 1) + " " + browser.config.fullYear);

        const date = new Date(browser.config.fullYear, browser.config.month + 1, 5);
        for (let i = 1; i < 29; i++) {
            date.setDate(i);
            if (date.getDay() === 2) {
                await $(".day-number=" + i).click();
                expect(await $(".day.cell.active").getText()).toEqual(i.toString());
                expect(await $(".name=Calendar Test 2").isDisplayed()).toBeTruthy();
            }
        }
    });

    it("filter test", async function () {
        await functions.pause(500);
        await $("#button-right").click();
        await functions.pause(1000);
        expect((await $("#month-name").getText()).toUpperCase()).toEqual(functions.monthFullName(browser.config.month+1)+" "+browser.config.fullYear);

        await $(".day-number=28").click();
        expect(await $(".day.cell.active").getText()).toEqual("28");
        expect(await $(".name=Calendar Test 3").isDisplayed()).toBeTruthy();

        await $("#button-filter").click();
        await $(".filter-tag=Konzert").click();
        await $(".filter-tag=Gottesdienst").click();
        await $(".button=Suchen").click();

        await functions.pause(1000);
        await $(".day-number=20").click();
        expect(await $(".day.cell.active").getText()).toEqual("20");
        await $("#event-overview-container .makeBig").click();
        expect(await $(".name=Calendar Test 4").isDisplayed()).toBeTruthy();
        await $("#event-overview-container .makeSmall").click();

        await $(".day-number=28").click();
        await functions.pause(1000);
        expect(await $(".day.cell.active").getText()).toEqual("28");
        expect(await $(".name=Calendar Test 3").isDisplayed()).toBeFalsy();
    });

    it("event list open close test", async function () {
        await browser.execute(() => {
            let article = document.getElementById("calendar");
            article.classList.add("testing");
        });

        await functions.pause(3000);
        expect(await $("#event-overview-container.is-open").isExisting()).toBeFalse()

        await $("#event-overview-container .makeBig").click();
        await functions.pause(3000);

        expect(await $("#event-overview-container.is-open").isExisting()).toBeTrue()
        await $("#event-overview-container .makeSmall").click();
        await functions.pause(3000);

        expect(await $("#event-overview-container.is-open").isExisting()).toBeFalse()
    });
});
