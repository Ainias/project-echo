const Service = require("./setup");
const functions = require("./lib/functions");
const find = require("./lib/PromiseSelector");
const $ = find.one;
const $$ = find.multiple;
const path = require("path");

exports.config = {

    isMobile: false,

    runner: "local",

    // wdio will run your tests using the framework below. You can choose from several,
    // much like the reporters. The full list is at https://www.npmjs.com/search?q=wdio-framework
    framework: 'jasmine',

    // By default, Jasmine times out within 10 seconds. This is not really enough time
    // for us as it takes a while for Appium to get set up.
    jasmineNodeOpts: {
        defaultTimeoutInterval: 90000
    },

    sync: true,

    // How much detail should be logged. The options are:
    // trace | debug | info | warn | error | silent
    logLevel: 'error',

    mysqlConnection: Service.mysqlConnection,

    deprecationWarnings: true,

    bail: 0,

    // baseUrl: "http://127.0.0.1:3000",
    baseUrl: "http://127.0.0.1:8000",

    waitforTimeout: 10000,

    connectionRetryTimeout: 90000,

    connectionRetryCount: 3,

    // The reporter is what formats your test results on the command line. 'spec' lists
    // the names of the tests with a tick or X next to them. See
    // https://www.npmjs.com/search?q=wdio-reporter for a full list of reporters.
    reporters: ['spec'],

    // Use the Appium plugin for Webdriver. Without this, we would need to run appium
    // separately on the command line.


    services: [
        // 'appium'
        ['selenium-standalone', {
            args: {
                // "chrome": {version: "87.0.4280.88"}
                // chromedriverExecutable: path.join(__dirname, "misc/web/chromedriver"),
                drivers: {chrome: '88.0.4324.96'}
            },
            installArgs: {
                // "chrome": {version: "87.0.4280.88"}
                // chromedriverExecutable: path.join(__dirname, "misc/web/chromedriver"),
                drivers: {chrome: '88.0.4324.96'}
            }
        }]
        // [Service.service,{}]
    ],

    delayFactor: 1,
    hasAlertDialogs: false,

    // Where the files we are testing can be found.
    specs: [
        './tests/specs/shared/*.js',
        './tests/specs/web/*.js',

        // './tests/specs/**/calendarSite.js',
        // './tests/specs/**/eventSite.js',
        // './tests/specs/**/favoriteSite.js',
        // './tests/specs/**/favoriteSite2.js',
        // './tests/specs/**/posts.js',
        // './tests/specs/**/searchSite.js',
        // './tests/specs/**/churchSite.js',
        // './tests/specs/**/listChurch.js',
        // './tests/specs/**/editEvent.js',
        // './tests/specs/**/editChurch.js',
    ],

    capabilities: [{
        browserName: "chrome",
        // browserName: "brave",
        // browserName: "firefox",
        maxInstances: 1,
        // maxInstances: 1,
        // 'goog:chromeOptions': {
        //     to run chrome headless the following flags are required
        //     (see https://developers.google.com/web/updates/2017/04/headless-chrome)
        //     args: ['--headless', '--disable-gpu'],
        // },
        // 'moz:firefoxOptions': {
        //     args: [
        //         "-headless",
        //     ],
        //     prefs: {"intl.accept_languages": "de, de-DE"}
        // }
    },
        // {
        //     browserName: "firefox",
        //     baseUrl: "http://127.0.0.1:8000",
        //     maxInstances: 10,
        //     // maxInstances: 1,
        //     'moz:firefoxOptions': {
        //         // args:["-headless"]
        //     }
        // }
    ],
    onPrepare: async function (conf, cap) {
        await Service.setup();
    },
    onComplete: async function () {
        await Service.tearDown();
    },

    lastCapability: null,

    before: async function (config, cap, spec) {
        // console.log(config);
        // if (config.lastCapability !== cap.browserName){
        //     if (config.lastCapability !== null){
        // await Service.generateDb();
        //     }
        //     config.lastCapability = cap.browserName;
        //     console.log("changed", config.lastCapability);
        // }
        // console.log("changed?", config.lastCapability);
    },

    beforeTest: async function () {
        // await browser.url(await functions.getBaseUrl());
        //
        // await browser.execute((year, month, date, hour, minute, second) => {
        //     const OldDate = window["Date"];
        //
        //     class Date extends OldDate {
        //         constructor(...args) {
        //             if (arguments.length === 0) {
        //                 super(year, month - 1, date, hour, minute, second);
        //             } else {
        //                 super(...arguments)
        //             }
        //         }
        //     }
        //
        //     window["Date"] = Date;
        // }, 2019, 5, 26, 14, 30, 42);
        //
        // await browser.waitUntil(async () => {
        //     let element = $("#main-content");
        //     return await element.isDisplayed()
        // });
    }
};
