import "dotenv/config";
import {EasySyncServerDb} from "cordova-sites-easy-sync/server";

import * as path from "path";

import * as express from 'express';
import {routes} from './routes';
import {UserManager} from "cordova-sites-user-management/server";

//Import Models
import "../model/Region";
import "../model/Church";
import "../model/Event";
import "../model/Post";
import "../model/Fsj";
import "../model/RepeatedEvent"

import {ServerTranslator} from "cordova-sites/server";
import {Translator} from "cordova-sites/shared";
import {SetupSchema1000000000000} from "../model/migrations/SetupSchema";
import {SetupUserManagement1000000001000} from "cordova-sites-user-management/src/migrations/SetupUserManagement"
import {Data1000000005000} from "../model/migrations/server/Data";
import {FsjSchema1000000006000} from "../model/migrations/FsjSchema";
import {AddRepeatedEvent1000000007000} from "../model/migrations/AddRepeatedEvent";


const translationGerman = require("../client/translations/de");
const  translationEnglish = require ("../client/translations/en");

const port = process.env.PORT || 3000;
process.env.JWT_SECRET = process.env.JWT_SECRET || "bjlsdgjw4tuiopmk24fl450wcui3fz,ogf";

// BaseModel._databaseClass = EasySyncServerDb;
EasySyncServerDb.CONNECTION_PARAMETERS = {
    "type": "mysql",
    "host": process.env.MYSQL_HOST || "localhost",
    "username": process.env.MYSQL_USER || "root",
    "password": process.env.MYSQL_PASSWORD || "",
    "database": process.env.MYSQL_DATABASE || "echo",
    "synchronize": false,
    "migrationsRun": true,
    "migrations": [
        SetupSchema1000000000000,
        SetupUserManagement1000000001000,
        Data1000000005000,
        FsjSchema1000000006000,
        AddRepeatedEvent1000000007000,
    ],

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
    // await setupDB();
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
