const Service = require("./setup");

const now = new Date();

exports.config = {

    startDate: now,
    year: now.getFullYear().toString().substr(2),
    fullYear: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),

    // Where the files we are testing can be found.
     specs: [
         // './tests/specs/mobile/*.js',
         // './tests/specs/shared/*.js',

         './tests/specs/**/settingsSite.js',
         // './tests/specs/**/searchSite.js',
         // './tests/specs/**/listChurch.js',
        // './tests/specs/**/favoriteSite2.js',
        // './tests/specs/**/eventSite.js',

         // './tests/specs/**/posts.js',
         // './tests/specs/**/favoriteSite.js',
         // './tests/specs/**/churchSite.js',
         // './tests/specs/**/calendarSite.js',

     ],

    delayFactor: 6,

    isMobile: true,

    calendarName: "echo",

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

    mysqlConnection: Service.mysqlConnection,

    deprecationWarnings: true,

    bail: 0,

    baseUrl: "",

    waitforTimeout: 10000*4,

    connectionRetryTimeout: 90000,

    connectionRetryCount: 3,

    // The reporter is what formats your test results on the command line. 'spec' lists
    // the names of the tests with a tick or X next to them. See
    // https://www.npmjs.com/search?q=wdio-reporter for a full list of reporters.
    reporters: ['spec'],

    // Use the Appium plugin for Webdriver. Without this, we would need to run appium
    // separately on the command line.
    services: [
        'appium'
    ],

    appium: {
        // args: {
        //     chromedriverExecutable: "/home/silas/Projekte/Web/project-echo/tests/chromedriver",
        // }
    },

    // 4723 is the default port for Appium
    port: 4723,

    // This defines which kind of device we want to test on, as well as how it should be
    // configured.
    capabilities: [{

        app: 'platforms/ios/build/emulator/Echo.app',

        automationName: "XCUITest",

        // For Android, Appium uses the first device it finds using "adb devices". So, this
        // string simply needs to be non-empty.
        // For iOS, this must exactly match the device name as seen in Xcode.
         deviceName: 'iPhone 11',
        //deviceName: 'any',

        // 'Android' or 'iOS'
        platformName: 'iOS',

        // The version of the Android or iOS system
        // platformVersion: '13.3',
        platformVersion: '14.2',
        //platformVersion: '12.4',

        orientation: "PORTRAIT",

        maxInstances: 1,

        // By default, Appium runs tests in the native context. By setting autoWebview to
        // true, it runs our tests in the Cordova context.
        autoWebview: true,

        // When set to true, it will not show permission dialogs, but instead grant all
        // permissions automatically.
        // autoGrantPermissions: true,
        // autoAcceptAlerts: true
    }],
    // autoAcceptAlerts: true,
    onPrepare: async function(){
        await Service.setup();
    },
    onComplete: async function(){
        await Service.tearDown();
    }
};
