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

    await browser.pause(2000);
    await $("input[name=email]").setValue(email);
    await $("input[name=password]").setValue(password);
    await $("button=Login").click();
    await browser.pause(3000);
}

async function logout() {
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

    await browser.execute((date) => {
        const OldDate = window["Date"];

        class Date extends OldDate {
            constructor(...args) {
                if (arguments.length === 0) {
                    super(date.getTime());
                } else {
                    super(...arguments)
                }
            }
        }

        window["Date"] = Date;
    }, date);
}

async function setFormValues(values, useSelector) {
    if (useSelector === undefined) {
        useSelector = false;
    }

    let promise = Promise.resolve();
    Object.keys(values).forEach(selector => {
        promise = promise.then(() => {
            if (useSelector) {
                return $(selector).setValue(values[selector])
            } else {
                return $("[name=" + selector + "]").setValue(values[selector])
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
    try {
        await pause(1500);
        await browser.acceptAlert();
        await pause(500);
	    // await browser.acceptAlert();
	    // await pause(500);
    } catch (e) {
        if (e.message !== "An attempt was made to operate on a modal dialog when one was not open." && !e.message.startsWith("no such alert")) {
            expect(e.message).toEqual("error message");
            throw e;
        }
    }
}

async function compareFiles(originalPath, expectedPath){
    let filePromises = [
        new Promise((res, rej) => fs.readFile(originalPath, (err, data) => err?rej(err):res(data))),
        new Promise((res, rej) => fs.readFile(expectedPath, (err, data) => err?rej(err):res(data)))
    ];

    let fileData = await Promise.all(filePromises);
    expect(fileData[0]).toEqual(fileData[1]);
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
    acceptCookies: acceptCookies,
    compareFiles: compareFiles,
};
