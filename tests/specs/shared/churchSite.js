const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions.js");

describe("church site", () => {
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

        if (browser.config.isMobile) {
            await $("button.menu-icon").click();
            await functions.pause(1500);
            await find.one("#responsive-menu [data-translation='churches']").click();
        } else {
            await find.one("[data-translation='churches']").click();
        }
        await $(".alphabet-section.K .name").click();
    });

    it("church site", async function () {
        expect(await $("#name").getText()).toEqual("KÖLN CITY CHURCH");
        expect(await $("#description").getText()).toEqual("Lorem ipsum sit doloret. Hier werden dann ganz viele interessante Informationen über die Köln City Church stehen. Außerdem wird der Gottesdienst- Rhythmus in den wechselnden Locations erklärt.")

        let linkElem = $("#website");
        expect(await linkElem.getText()).toEqual("www.citychurch.koeln");
        expect((await linkElem.getAttribute("href")).startsWith("https://www.citychurch.koeln")).toBeTruthy();

        let places = $$("#places-container .place");
        expect(await places.getLength()).toEqual(3);
        expect(await places.get(0).getText()).toEqual("Köln City Church Headquarter\n" +
            "Waltherstraße 51\n" +
            "LESKAN Park, Halle 10\n" +
            "51069 Köln, Dellbrück");
        expect(await places.get(1).getText()).toEqual("Köln City Church\n" +
            "Campus Innenstadt (Cinedom)\n" +
            "Im Mediapark 1\n" +
            "50670 Köln");
        expect(await places.get(2).getText()).toEqual("Köln City Church\n" +
            "Senats Hotel\n" +
            "Unter Goldschmied 9-17\n" +
            "50667 Köln\n" +
            "Eingang über Laurenzplatz");
    });
});
