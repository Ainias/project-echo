const mysql = require("mysql");
const childProcess = require("child_process");
const fs = require("fs");

let db = "silas_test_echo";
let pw = "123456789";
let mysqlConn = mysql.createConnection({
    host: "localhost",
    "user": "root",
    "password": pw,
    "database": db,
    "multipleStatements": true
});

let child = null;

async function setup() {
    await generateDb();
    await startTestServer();
    console.log("setupDone");
}

async function tearDown() {
    if (child) {
        child.kill(0);
    }
}

async function startTestServer() {
    return new Promise((resolve, reject) => {
        child = childProcess.exec("npm run server", {
            env: Object.assign({}, process.env,{
                MYSQL_PASSWORD: pw,
                MYSQL_DATABASE: db
            }),
            stdio: "pipe"
        }, reject);
        child.stdout.on("data", data => {
            console.log("[SERVER]", data);
            if (data.indexOf("Server started on Port: ") !== -1){
                resolve();
            }
        });
    })
}

async function generateDb() {

    let sqlStrings = fs.readFileSync(__dirname + '/setup.sql', 'utf-8');

    let mysqlPromise = Promise.resolve().then(() => new Promise(r => {
        mysqlConn.query(sqlStrings + ";", function (err, result) {
            if (!err) {
                r(result);
            } else {
                console.error(err);
                throw err;
            }
        });
    }));
    await mysqlPromise;
    console.log("mysqlPromise resolved!");
    return true;
}

class InitService {
    async onPrepare(config, capabilities) {
        console.log("onPrepare", config, capabilities, new Date());
        await setup();
        console.log("onPrepare2", new Date());
    }

    async onComplete(exitCode, config, capabilities) {
        console.log("onComplete", exitCode, config, capabilities, new Date());
        await tearDown();
        console.log("onComplete2", new Date());
    }
}


module.exports = {setup: setup, tearDown: tearDown, service: InitService, mysqlConnection: mysqlConn, generateDb: generateDb};


// <script>

// var linksToSlides = [{
//     href: "https://silas.link",
//     name: "Silas.link"
// }];
//
// jQuery(function ($) {
//
//     var header = $('.header-slider');
//     for (var i = 0; i < linksToSlides.length; i++) {
//         if (header.length <= i) {
//             break;
//         }
//         // $('.slide-item:nth-of-type(' + (i + 1) + ')').click(() => {
//         //     window.location.href = linksToSlides[i];
//         // });
//         $('.slide-item:nth-of-type(' + (i + 1) + ') .slide-inner a').attr("href", linksToSlides[i].href);
//         $('.slide-item:nth-of-type(' + (i + 1) + ') .slide-inner a').text(linksToSlides[i].name);
//     }
//     // $('.slide-item:nth-of-type(2) .slide-inner').wrap('<a href="http://mysite.com/page2"></a>');
//     // $('.slide-item:nth-of-type(3) .slide-inner').wrap('<a href="http://mysite.com/page3"></a>');
// });
// </script>