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
    "host": "localhost",
    "username": "root",
    "password": "123456",
    "database": (process.argv.length >= 3 ? process.argv[2] : "silas_echo"),
    "synchronize": false,
    "logging": true
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


app.use(express.static(path.resolve("./public")));

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
    // let church = new Church();
    // church.descriptions = {"de": "Testkirche"};
    // church.names = {"de": "Testkirche"};
    // church.website = "www.citychurch.koeln";
    // await church.save();
    //
    // let region = await Region.findById(2);
    // region.churches = [church];
    // regions[0].getChurchs().push(church);
    // await regions[0].save();
    // console.log("done 2");
    //
    // console.log(await region.save());
    app.listen(port, () => {
        console.log('Server started on Port: ' + port);
    });
});
