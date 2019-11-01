const Service = require("./setup");

exports.config = {

    // Where the files we are testing can be found.
    specs: ['./tests/specs/**/*.js'],
    // specs: ['./tests/specs/**/calendarSite.js'],

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
    // 'silent', 'verbose', 'command', 'data', 'result', 'error'
    logLevel: 'error',

    deprecationWarnings: true,

    bail: 0,

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
        'selenium-standalone',
        // [Service.service,{}]
    ],

    capabilities: [{
        browserName: "chrome",
        baseUrl: "http://127.0.0.1:8000",
        maxInstances: 1,
    }],
    onPrepare: async function(){
        await Service.setup();
    },
    onComplete: async function(){
        await Service.tearDown();
    }

};