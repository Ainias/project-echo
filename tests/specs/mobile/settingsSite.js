const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions");

describe("settingsSite", () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000*browser.config.delayFactor;

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

        await $("button.menu-icon").click();
        await find.one("#responsive-menu [data-translation='settings']").click();
    });

    it("calendar selection", async function () {
        await functions.acceptAlert();
        expect(await $("#system-calendar").getText()).toEqual(browser.config.calendarName || "silas@silas.link");
        await $("#system-calendar").click();

        await browser.execute(() => {
            window.plugins.calendar.listCalendars(options => {
                window["test-calendarOptions"] = options;
            });
        });

        await $("[data-value]=echo").click();
        await browser.pause(1000);
        expect(await $("#system-calendar").getText()).toEqual("echo");

        await browser.execute(async function() {
            // NativeStorage.getItem("functional_system-calendar-id", done, done);
            let res = await new Promise(r => NativeStorage.getItem("functional_system-calendar-id", r, r));
            window["test-selectedCalendar"] = res;
        });
        await functions.pause(200);

        let id = await browser.execute(() => {
            return window["test-selectedCalendar"];
        });
        let options = await browser.execute(() => {
            return window["test-calendarOptions"];
        });

        let selected = options.filter(o => o.id === id);

        expect(selected[0].name).toEqual("echo");
    });

    fit("deactivate notifications", async function () {
        await functions.acceptAlert();
        await functions.pause(5000);
        await browser.execute(async () => {
            window["notifications"] = {};
            cordova.plugins.notification.local.schedule = (options, callback) => {
                window["notifications"][options.id] = options;
                callback();
            };
            cordova.plugins.notification.local.cancelAll = (callback) => {
                window["notifications"] =  {};
                callback();
            };

            await queryDb("INSERT INTO favorite (eventId, isFavorite) VALUES (16, 1), (6,1);");
            let data = await queryDb("SELECT * FROM favorite;")
            let promises = [];

            data.forEach(fav => {
                promises.push(new Promise(resolve => {
                    cordova.plugins.notification.local.schedule({
                        id: fav.id,
                        title: "title",
                        text: "text",
                        trigger: {at: new Date(2020, 5, 26)}
                    }, resolve);                }));
            });

            await Promise.all(promises);
        });

        await functions.pause(5000);

        // await browser.debug();

        expect(await $("#send-notifications").getValue()).toEqual("1");
        expect(await $("#time-before-setting-row").isDisplayed()).toBeTruthy();

        await $("#send-notifications+span.slider").click();
        await functions.pause(1500);

        expect(await $("#time-before-setting-row").isDisplayed()).toBeFalsy();

        let val = await functions.asyncExecute(() => {
            return new Promise((r, rej) => NativeStorage.getItem("functional_send-notifications", r, r));
        });
        expect(val).toEqual("0");

        let val2 = await browser.execute(() => {
            return window["notifications"];
        });
        expect(val2).toEqual({});

        await $("#send-notifications+span.slider").click();
        await functions.pause(1500);

        expect(await $("#time-before-setting-row").isDisplayed()).toBeTruthy();

        let val3 = await functions.asyncExecute(() => {
            return new Promise((r, rej) => NativeStorage.getItem("functional_send-notifications", r, r));
        });
        expect(val3).toEqual("1");

        await functions.pause(1000);
        let val4 = await browser.execute(() => {
            return window["notifications"];
        });
        expect(Object.keys(val4).length).toEqual(2);
        expect(val4[1].id).toEqual(1);
        expect(val4[2].id).toEqual(2);
    });
});