import "dotenv/config";
import {EasySyncServerDb} from "cordova-sites-easy-sync/server";

import path from "path";

import express from 'express';
import {routes} from './routes';

//Import Models
import "../model/Region";
import "../model/Church";
import "../model/Event";
import {BaseModel} from "cordova-sites-database";

const port = process.env.PORT || 3000;

BaseModel._databaseClass = EasySyncServerDb;
EasySyncServerDb.CONNECTION_PARAMETERS = {
    "type": "mysql",
    "host": process.env.MYSQL_HOST || "localhost",
    "username": process.env.MYSQL_USER || "root",
    "password": process.env.MYSQL_PASSWORD || "",
    "database": process.env.MYSQL_DATABASE || "echo",
    "synchronize": process.env.SYNC_DATABASE || false,
    "logging": ["error", "warn"]
};

const app = express();

//Todo guten wert finden?
app.use(express.json({limit: "50mb"}));

//Allow Origin setzen bevor rest passiert
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/api', routes);

app.use(express.static(path.resolve(path.dirname(process.argv[1]), "public")));

//Handle errors
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500);
    if (err instanceof Error) {
        res.json({error: err.message});
    } else {
        res.json({error: err});
    }
});

EasySyncServerDb.getInstance()._connectionPromise.then(async () => {
    app.listen(port, () => {
        console.log('Server started on Port: ' + port);
    });
});
