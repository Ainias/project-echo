import {EasySyncServerDb} from "cordova-sites-easy-sync/server";

import express from 'express';
import bodyParser from 'body-parser';
import Sequelize from "sequelize";
import {routes} from './routes';
import {EasySync} from "cordova-sites-easy-sync/model";

//Import Models
import "../model/Test";
import "../model/Event";
import "../model/Church";

// import "../model/Church";

const port = process.env.PORT || 3000;

const app = express();

EasySyncServerDb.setSequelize(new Sequelize('silas_echo', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    // logging: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
}));
EasySyncServerDb.setEasySync(EasySync);
EasySyncServerDb.getInstance();

// app.use(bodyParser.json());
app.use(express.json());

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

app.post("/test", function (req, res) {
    console.log("app-level", req.body);
    return res.json({});
});

app.use('/api', routes);

app.use(express.static("public"));

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

app.listen(port, () => {
    console.log('Server started on Port: ' + port);
});