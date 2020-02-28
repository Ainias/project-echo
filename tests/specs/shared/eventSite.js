const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions.js");

describe("event site", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90 * 1000 * browser.config.delayFactor;

    let baseUrl = null;
    beforeAll(async () => {
        baseUrl = await functions.getBaseUrl();

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
                        super(...arguments);
                    }
                }
            }

            window["Date"] = Date;
        }, 2019, 5, 26, 14, 30, 42);

        await functions.acceptCookies();

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed();
        });
    });

    it("event site - normal infos", async function () {
        await browser.url(baseUrl + "?id=5&s=event");

        await browser.pause(7000);
        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed();
        });

        expect(await $("#event-name").getText()).toEqual("TERMIN 4");
        expect(await $("#event-time").getText()).toEqual("29. Apr ´19, 15:00 -\n" +
            "02. May ´19, 10:00");

        expect(await $("#places-container").getText()).toEqual("place 1");
        expect(await $("#places-container").getText()).toEqual("place 1");

        expect(await $("#event-description").getText()).toEqual("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.")

    });

    it("event site - favorites", async function () {

        await browser.url(baseUrl + "?id=4&s=event");

        await browser.waitUntil(async () => {
            let element = $("#main-content");
            return await element.isDisplayed()
        });

        let favElem = $("#favorite .favorite");
        expect(await favElem.getAttribute("class")).toEqual("favorite");

        await favElem.click();
        await functions.pause(1000);
        await functions.acceptAlert();
        await functions.acceptAlert();
        await functions.pause(1000);

        await functions.pause(1000);
        expect(await favElem.getAttribute("class")).toEqual("favorite is-favorite");

        await favElem.click();
        await functions.pause(1000);
        expect(await favElem.getAttribute("class")).toEqual("favorite");
    });
});