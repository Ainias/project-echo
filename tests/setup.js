const mysql = require("mysql");
const childProcess = require("child_process");
const fs = require("fs");

const mUser = "root";
const mPasswd = "123456";
const mDatabase = "silas_test_echo";

let mysqlConn = mysql.createConnection({
    host: "localhost",
    "user": mUser,
    "password": mPasswd,
    "database": mDatabase,
    "multipleStatements": true
});

let process = null;

async function setup() {
    await generateDb();
    await startTestServer();
}

async function tearDown() {
    if (process) {
        process.kill(0);
    }
}

async function startTestServer() {
    process = childProcess.fork("./server/index.mjs", ["silas_test_echo"], {
        execArgv: ["--experimental-modules"],
        env: {
            MYSQL_DATABASE: mDatabase,
            MYSQL_USER: mUser,
            MYSQL_PASSWORD: mPasswd
        }
    });
}

async function generateDb() {

    let sqlStrings = fs.readFileSync(__dirname + '/setup.sql', 'utf-8');

    // console.log(sqlStrings);
    // sqlStrings = sqlStrings.split(";");

    let mysqlPromise = Promise.resolve();
    // sqlStrings.forEach((sql) => {
    //     if (sql.trim() !== "") {
    mysqlPromise = mysqlPromise.then(() => new Promise(r => {
        mysqlConn.query(sqlStrings + ";", function (err, result) {
            if (!err) {
                r(result);
            } else {
                console.error(err);
                throw err;
            }
        });
    }));
    // }
    // });
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


module.exports = {setup: setup, tearDown: tearDown, service: InitService};


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