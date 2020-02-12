const find = require("../../lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const functions = require("../../lib/functions");

describe("settingsSite", () => {
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

        await $("button.menu-icon").click();
        await find.one("#responsive-menu [data-translation='settings']").click();
    });

    it("calendar selection", async function () {
        expect(await $("#system-calendar").getText()).toEqual("silas@silas.link");
        await $("#system-calendar").click();

        await $$("[data-value]").get(4).click();
        await browser.pause(1000);
        expect(await $("#system-calendar").getText()).toEqual("echo");

        let key = await browser.execute(() => {
            return new Promise((r, rej) => NativeStorage.getItem("system-calendar-id", r, r));
        });
        expect(key).toEqual("8");
    });

    it("deactivate notifications", async function () {
        await browser.execute(async () => {
            window["notifications"] = {};
            cordova.plugins.notification.local.schedule = (options, callback) => {
                window["notifications"][options.id] = options;
                callback();
            };
            cordova.plugins.notification.local.clearAll = (callback) => {
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
                    }, resolve);
                }));
            });

            await Promise.all(promises);
        });

        expect(await $("#send-notifications").getValue()).toEqual("1");
        expect(await $("#time-before-setting-row").isDisplayed()).toBeTruthy();

        await $("#send-notifications+span.slider").click();
        await functions.pause(1500);

        expect(await $("#time-before-setting-row").isDisplayed()).toBeFalsy();

        let val = await browser.execute(() => {
            return new Promise((r, rej) => NativeStorage.getItem("send-notifications", r, r));
        });
        expect(val).toEqual("0");

        val = await browser.execute(() => {
            return new Promise((r, rej) => cordova.plugins.notification.local.getScheduledIds(r, r));
        });
        expect(val).toEqual([]);

        await $("#send-notifications+span.slider").click();
        await functions.pause(1500);

        expect(await $("#time-before-setting-row").isDisplayed()).toBeTruthy();

        val = await browser.execute(() => {
            return new Promise((r, rej) => NativeStorage.getItem("send-notifications", r, r));
        });
        expect(val).toEqual("1");

        await browser.pause(1000);
        val = await browser.execute(() => {
            return window["notifications"];
        });
        expect(Object.keys(val).length).toEqual(2);
        expect(val[1].id).toEqual(1);
        expect(val[2].id).toEqual(2);
    });
});