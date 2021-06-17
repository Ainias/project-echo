const find = require("../lib/PromiseSelector");
const $ = find.one;
const fs = require("fs");

async function login(email, password) {
    await browser.url(await getBaseUrl() + "?s=login");

    await browser.waitUntil(async () => {
        let element = $("#main-content");
        return await element.isDisplayed()
    });
    await acceptCookies();

    await browser.pause(1000);
    await $("input[name=email]").setValue(email);
    await $("input[name=password]").setValue(password);
    await $("button=Login").click();
    await browser.pause(3000);
}

async function logout() {
    await $(".footer .icon.home").click();
    await $("span=Logout").click();
}

async function pause(delay) {
    await browser.pause(delay * browser.config.delayFactor);
}

async function queryDatabase(query) {

    let mysql = browser.config.mysqlConnection;
    return new Promise(resolve => {
        mysql.query(query, function (err, result) {
            if (!err) {
                resolve(result);
            } else {
                console.error(err);
                resolve(err);
            }
        });
    });
}

async function setCurrentDate(date) {

    if (!(date instanceof Date)) {
        date = new Date(2019, 5, 26, 14, 30, 42);
    }

    const time = date.getTime();
    await browser.execute((time) => {
        const OldDate = window["Date"];

        class Date extends OldDate {
            constructor(...args) {
                if (arguments.length === 0) {
                    super(time);
                } else {
                    super(...arguments)
                }
            }
        }

        window["Date"] = Date;
    }, time);
}

async function setFormValues(values, useSelector) {
    if (useSelector === undefined) {
        useSelector = false;
    }

    let promise = Promise.resolve();
    Object.keys(values).forEach(selector => {
        promise = promise.then(async () => {
            let elem;
            if (useSelector) {
                elem = $(selector)
            } else {
                elem = $("[name=" + selector + "]");
            }

            if (await elem.isTag("select") || await elem.isTag("SELECT")) {
                // await browser.debug();
                await elem.selectByAttribute("value", values[selector]);
            } else if (await elem.getAttribute("type") === "checkbox" || await elem.getAttribute("type") === "radio") {
                if (!await elem.isSelected()) {
                    return elem.click();
                }
            } else {
                return elem.setValue(values[selector]);
            }
        });
    });
    return promise;
}

async function acceptCookies() {
    if (!browser.config.isMobile) {
        try {
            await $("#accept-all").click();
        } catch (e) {
            console.error(e);
        }
    }
}

async function verifyFormValues(values, useSelector) {
    if (useSelector === undefined) {
        useSelector = false;
    }

    let promise = Promise.resolve();
    Object.keys(values).forEach(selector => {
        promise = promise.then(async () => {
            if (useSelector) {
                expect(await $(selector).getValue()).toEqual(values[selector]);
            } else {
                expect(await $("[name=" + selector + "]").getValue()).toEqual(values[selector]);
            }
        });
    });
    return promise;
}

async function addCustomChildSelector() {
    await browser.addLocatorStategy("selectParent", (parentSelector, childSelector) => {
        let children = document.querySelectorAll(childSelector);
        let parents = [];
        children.forEach(child => {
            let parent = child.closest(parentSelector);
            if (parent) {
                parents.push(parent);
            }
        });
        return parents;
    });
}

async function getBaseUrl() {
    if (browser.config.baseUrl.trim() !== "") {
        return browser.config.baseUrl;
    } else {
        return browser.getUrl();
    }
}

async function acceptAlert() {
    if (browser.config.hasAlertDialogs !== false) {
        try {
            await pause(1500);
            await browser.acceptAlert();
            await pause(500);
            // await browser.acceptAlert();
            // await pause(500);
        } catch (e) {
            console.log("-------------ERROR----------------", e.message);
            if (e.message !== "An attempt was made to operate on a modal dialog when one was not open" && !e.message.startsWith("no such alert")) {
                expect(e.message).toEqual("error message");
                // throw e;
            }
        }
    }
}

async function acceptInsertFavorites() {
    if (browser.config.hasAlertDialogs !== false) {
        try {
            await $(".modal-button-container .button.right [data-translation=yes]").click();
        } catch (e) {

        }
    }
}

async function compareFiles(originalPath, expectedPath) {
    let filePromises = [
        new Promise((res, rej) => fs.readFile(originalPath, (err, data) => err ? rej(err) : res(data))),
        new Promise((res, rej) => fs.readFile(expectedPath, (err, data) => err ? rej(err) : res(data)))
    ];

    let fileData = await Promise.all(filePromises);
    expect(fileData[0]).toEqual(fileData[1]);
}

async function deactivateTranslationLogging() {
    await browser.execute(() => {
        window["shouldConsoleMissingTranslation"] = false;
    });
}

async function logErrors() {
    await browser.execute(() => {
        window["loggedErrors"] = [];
        window.addEventListener("error", event => {
            window["loggedErrors"].push(event.message);
        }, true);
        window.onunhandledrejection = (e) => {
            window["loggedErrors"].push(e.reason);
        }
    });
}

async function getLoggedErrors() {
    return await browser.execute(() => {
        return window["loggedErrors"];
    });
}

async function asyncExecute(func, ...args) {
    // console.log(func+"");

    let index = await browser.execute((funcString, args) => {
        let func = eval(funcString);
        let res = func(...args);
        if (!window["testValIndex"]) {
            window["testValIndex"] = 0;
        }
        window["testValIndex"]++;
        let index = window["testValIndex"];
        Promise.resolve(res).then(r => window["test-res-" + index] = r);
        return index;
        // return args;
    }, func + "", args);

    // console.log(index);

    //
    await pause(1000);
    return await browser.execute((i) => window["test-res-" + i], index);
    // return index;
}

async function mockMatomo() {
    if (!browser.config.isMobile) {
        //Mock funktioniert nur im Browser
        const mock = await browser.mock("https://matomo.echoapp.de/m.js");
        mock.respond('./tests/misc/matomoMock.js');
    }
}

function monthName(monthIndex) {
    const monthNames = [
        "Jan",
        "Feb",
        "Mär",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dez",
    ];

    return monthNames[monthIndex];
}

function monthFullName(monthIndex) {
    const monthNames = [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ];

    return monthNames[monthIndex].toUpperCase();
}

function dayName(dayIndex) {
    const dayNames = [
        "So",
        "Mo",
        "Di",
        "Mi",
        "Do",
        "Fr",
        "Sa",
    ];

    return dayNames[dayIndex];
}


module.exports = {
    login: login,
    logout: logout,
    queryDatabase: queryDatabase,
    setCurrentDate: setCurrentDate,
    setFormValues: setFormValues,
    verifyFormValues: verifyFormValues,
    addCustomChildSelector: addCustomChildSelector,
    getBaseUrl: getBaseUrl,
    pause: pause,
    acceptAlert: acceptAlert,
    acceptInsertFavorites: acceptInsertFavorites,
    acceptCookies: acceptCookies,
    compareFiles: compareFiles,
    deactivateTranslationLogging: deactivateTranslationLogging,
    logErrors: logErrors,
    getLoggedErrors: getLoggedErrors,
    asyncExecute: asyncExecute,
    mockMatomo: mockMatomo,
    monthName: monthName,
    monthFullName: monthFullName,
    dayName: dayName,
};
