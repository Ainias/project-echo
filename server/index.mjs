import "dotenv/config";
import {EasySyncServerDb} from "cordova-sites-easy-sync/server";

import path from "path";

import express from 'express';
import {routes} from './routes';
import {UserManager} from "cordova-sites-user-management/server";

//Import Models
import "../model/Region";
import "../model/Church";
import "../model/Event";
import {BaseModel} from "cordova-sites-database";
import {setupDB} from "./setupDB";
import {ServerTranslator} from "cordova-sites/server";
import {Translator} from "cordova-sites/shared";
import translationGerman from "../client/translations/de";
import translationEnglish from "../client/translations/en";

const port = process.env.PORT || 3000;
process.env.JWT_SECRET = process.env.JWT_SECRET || "bjlsdgjw4tuiopmk24fl450wcui3fz,ogf";

BaseModel._databaseClass = EasySyncServerDb;
EasySyncServerDb.CONNECTION_PARAMETERS = {
    "type": "mysql",
    "host": process.env.MYSQL_HOST || "localhost",
    "username": process.env.MYSQL_USER || "root",
    "password": process.env.MYSQL_PASSWORD || "",
    "database": process.env.MYSQL_DATABASE || "echo",
    "synchronize": process.env.SYNC_DATABASE || true,
    "logging": ["error", "warn"]
    // "logging": true
};

UserManager.PEPPER = process.env.PEPPER || "mySecretPepper";

UserManager.REGISTRATION_IS_ACTIVATED = false;
UserManager.LOGIN_NEED_TO_BE_ACTIVATED = false;

UserManager.REGISTRATION_DEFAULT_ROLE_IDS = [4];

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
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(ServerTranslator.setUserLanguage);
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
    await setupDB();
    Translator.init({
        translations: {
            "de": translationGerman,
            "en": translationEnglish
        },
        fallbackLanguage: "de",
        // markTranslations: true,
        markUntranslatedTranslations: true,
    });

    app.listen(port, () => {
        console.log('Server started on Port: ' + port);
    });
});
