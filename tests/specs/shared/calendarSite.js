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

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90 * 1000*browser.config.delayFactor;

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
        expect(await $("#month-name").getText()).toEqual("MAI 2019");
        expect(await $(".day.cell.active").getText()).toEqual("26");
        expect(await $("#event-overview-container").getText()).toEqual("Keine Events vorhanden");

        await $(".day-number=29").click();
        expect(await $(".day.cell.active").getText()).toEqual("29");

        expect(await $(".name=Termin 5").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 5.1").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 5.2").isExisting()).toBeTruthy();
        expect(await $(".name=Termin 5.3").isExisting()).toBeTrue();
        expect(await $(".name=Termin 5.4").isExisting()).toBeTrue();
    });

    it("browse calendar", async function () {
        await functions.pause(3000);
        expect(await $("#month-name").getText()).toEqual("MAI 2019");
        expect(await $(".day.cell.active").getText()).toEqual("26");

        await $(".day-number=31").click();
        expect(await $(".day.cell.active").getText()).toEqual("31");

        await $("#button-right").click();
        await functions.pause(500);
        expect(await $("#month-name").getText()).toEqual("JUNI 2019");
        expect(await $(".day.cell.active").getText()).toEqual("30");

        await $("#button-left").click();
        await functions.pause(500);
        expect(await $("#month-name").getText()).toEqual("MAI 2019");
        expect(await $(".day.cell.active").getText()).toEqual("30");

        await $(".day-number=31").click();
        await functions.pause(500);
        expect(await $(".day.cell.active").getText()).toEqual("31");

        await $("#button-left").click();
        await functions.pause(500);
        expect(await $("#month-name").getText()).toEqual("APRIL 2019");
        expect(await $(".day.cell.active").getText()).toEqual("30");
    });

    it("repeated events displayed", async function () {
        await functions.pause(1000);
        expect(await $("#month-name").getText()).toEqual("MAI 2019");

        await $("#button-right").click();
        await functions.pause(2000);
        await $("#button-right").click();
        await functions.pause(2000);
        expect(await $("#month-name").getText()).toEqual("JULI 2019");

        await $(".day-number=2").click();
        expect(await $(".day.cell.active").getText()).toEqual("2");
        expect(await $(".name=Template Termin").isDisplayed()).toBeFalsy();

        await $(".day-number=4").click();
        expect(await $(".day.cell.active").getText()).toEqual("4");
        expect(await $(".name=Template Termin").isDisplayed()).toBeFalsy();

        await $(".day-number=9").click();
        expect(await $(".day.cell.active").getText()).toEqual("9");
        expect(await $(".name=Template Termin").isDisplayed()).toBeTruthy();

        await $(".day-number=11").click();
        expect(await $(".day.cell.active").getText()).toEqual("11");
        expect(await $(".name=Template Termin").isDisplayed()).toBeTruthy();

        await $(".day-number=16").click();
        expect(await $(".day.cell.active").getText()).toEqual("16");
        expect(await $(".name=Template Termin").isDisplayed()).toBeFalsy();

        await $(".day-number=17").click();
        expect(await $(".day.cell.active").getText()).toEqual("17");
        expect(await $(".name=Template Termin").isDisplayed()).toBeTruthy();

        await $(".day-number=18").click();
        expect(await $(".day.cell.active").getText()).toEqual("18");
        expect(await $(".name=Template Termin").isDisplayed()).toBeTruthy();

        await $(".day-number=23").click();
        expect(await $(".day.cell.active").getText()).toEqual("23");
        expect(await $(".name=Template Termin").isDisplayed()).toBeFalsy();

        await $(".day-number=25").click();
        expect(await $(".day.cell.active").getText()).toEqual("25");
        expect(await $(".name=Template Termin").isDisplayed()).toBeTruthy();

        await $(".day-number=30").click();
        expect(await $(".day.cell.active").getText()).toEqual("30");
        expect(await $(".name=Template Termin").isDisplayed()).toBeTruthy();
    });

    it("filter link tests", async function () {
        await browser.url(baseUrl+"?date=2019-06-22&filter=%7B\"types\"%3A%5B\"konzert\"%2C\"gottesdienst\"%5D%2C\"churches\"%3A%5B%5D%7D&s=calendar");
        await functions.deactivateTranslationLogging();
        await functions.logErrors();
        await functions.setCurrentDate();

        await functions.pause(1000);
        expect(await $("#month-name").getText()).toEqual("JUNI 2019");

        await $(".day-number=11").click();
        expect(await $(".day.cell.active").getText()).toEqual("11");
        expect(await $(".name=Template Termin 2").isDisplayed()).toBeTruthy();

        await $(".day-number=29").click();
        expect(await $(".day.cell.active").getText()).toEqual("29");
        expect(await $(".name=Termin Later").isDisplayed()).toBeFalsy();

    });

    it("filter test", async function () {
        await functions.pause(1000);
        expect(await $("#month-name").getText()).toEqual("MAI 2019");

        await $("#button-right").click();
        await functions.pause(2000);
        expect(await $("#month-name").getText()).toEqual("JUNI 2019");

        await $(".day-number=29").click();
        expect(await $(".day.cell.active").getText()).toEqual("29");
        expect(await $(".name=Termin later").isDisplayed()).toBeTruthy();

        await $("#button-filter").click();
        await $(".filter-tag=Konzert").click();
        await $(".filter-tag=Gottesdienst").click();
        await $(".button=Suchen").click();

        await $(".day-number=11").click();
        expect(await $(".day.cell.active").getText()).toEqual("11");
        expect(await $(".name=Template Termin 2").isDisplayed()).toBeTruthy();

        await $(".day-number=29").click();
        expect(await $(".day.cell.active").getText()).toEqual("29");
        expect(await $(".name=Termin Later").isDisplayed()).toBeFalsy();
    });
});
