const mysql = require("mysql");
const childProcess = require("child_process");
const fs = require("fs");

let mysqlConn = mysql.createConnection({
    host: "localhost",
    "user": "root",
    "password": "123456",
    "database": "silas_test_echo"
});

let process = null;

async function setup() {
    await generateDb();
    await startTestServer();
}

async function tearDown() {
    if (process) {
        process.exit(0);
    }
}

async function startTestServer() {
    process = childProcess.fork("../server/index.mjs", ["silas_test_echo"], {
        execArgv: ["--experimental-modules"]
    });
}

async function generateDb() {

    let sqlStrings = fs.readFileSync(__dirname + '/setup.sql', 'utf-8');

    // console.log(sqlStrings);
    sqlStrings = sqlStrings.split(";");

    let mysqlPromise = Promise.resolve();
    sqlStrings.forEach((sql) => {
        if (sql.trim() !== "") {
            mysqlPromise = mysqlPromise.then(() => new Promise(r => {
                mysqlConn.query(sql + ";", undefined, function (err, result) {
                    if (!err) {
                        r(result);
                    } else {
                        console.error(err);
                        throw err;
                    }
                });
            }));
        }
    });
    await mysqlPromise;
    console.log("mysqlPromise resolved!");
    return true;
}


module.exports = {setup: setup, tearDown: tearDown};