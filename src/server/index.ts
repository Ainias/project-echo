import 'dotenv/config';
import { EasySyncController, EasySyncServerDb, ServerFileMedium } from 'cordova-sites-easy-sync/dist/server';

import * as path from 'path';
import * as sharp from 'sharp';

import * as express from 'express';
import { routes } from './routes';
import { UserManager } from 'cordova-sites-user-management/dist/server';

//Import Models
import '../shared/model/Region';
import '../shared/model/Church';
import '../shared/model/Event';
import '../shared/model/Post';
import '../shared/model/Fsj';
import '../shared/model/RepeatedEvent';
import '../shared/model/Podcast';

import { ServerTranslator } from 'cordova-sites/dist/server';
import { Translator } from 'cordova-sites/dist/shared';
import { SetupSchema1000000000000 } from '../shared/model/migrations/SetupSchema';
import { SetupUserManagement1000000001000 } from 'cordova-sites-user-management/dist/shared';
import { Data1000000005000 } from '../shared/model/migrations/server/Data';
import { FsjSchema1000000006000 } from '../shared/model/migrations/FsjSchema';
import { AddRepeatedEvent1000000007000 } from '../shared/model/migrations/AddRepeatedEvent';
import { ImagesSchema1000000010000 } from '../shared/model/migrations/ImagesSchema';
import { ImagesSchemaDownload1000000011000 } from '../shared/model/migrations/ImagesSchemaDownload';
import { EventWeblink1000000012000 } from '../shared/model/migrations/EventWeblink';
import { ChurchInstalink1000000013000 } from '../shared/model/migrations/ChurchInstalink';
import { AddPodcasts1000000014000 } from '../shared/model/migrations/AddPodcasts';
import { AddViewPodcastsAccess1000000015000 } from '../shared/model/migrations/AddViewPodcastsAccess';

const translationGerman = require('../client/translations/de');
const translationEnglish = require('../client/translations/en');

EasySyncController.MAX_MODELS_PER_RUN = 100;
ServerFileMedium.SAVE_PATH = __dirname + '/uploads/img_';

const port = process.env.PORT || 3000;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'bjlsdgjw4tuiopmk24fl450wcui3fz,ogf';

// BaseModel._databaseClass = EasySyncServerDb;
EasySyncServerDb.CONNECTION_PARAMETERS = {
    type: 'mysql',
    host: process.env.MYSQL_HOST || 'localhost',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'echo',
    synchronize: false,
    migrationsRun: true,
    migrations: [
        SetupSchema1000000000000,
        SetupUserManagement1000000001000,
        Data1000000005000,
        FsjSchema1000000006000,
        AddRepeatedEvent1000000007000,
        ImagesSchema1000000010000,
        ImagesSchemaDownload1000000011000,
        EventWeblink1000000012000,
        ChurchInstalink1000000013000,
        AddPodcasts1000000014000,
        AddViewPodcastsAccess1000000015000,
    ],

    logging: ['error', 'warn'],
    // "logging": true
};

UserManager.PEPPER = process.env.PEPPER || 'mySecretPepper';

UserManager.REGISTRATION_IS_ACTIVATED = false;
UserManager.LOGIN_NEED_TO_BE_ACTIVATED = false;

UserManager.REGISTRATION_DEFAULT_ROLE_IDS = [4];

//Downscaling von Images
ServerFileMedium.createDownscalePipe = () => {
    return sharp().resize({ width: 800, withoutEnlargement: true });
};

const app = express();

//Todo guten wert finden?
app.use(express.json({ limit: '50mb' }));

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
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});
app.use(ServerTranslator.setUserLanguage);
app.use('/api', routes);

app.use(express.static(path.resolve(path.dirname(process.argv[1]), 'public')));
app.use('/uploads', express.static(path.resolve(path.dirname(process.argv[1]), 'uploads')));

//Handle errors, do not delete next or otherwise it is not an error handler
app.use(function (err, req, res, next) {
    console.error('Error:', err);
    res.status(err.status || 500);
    if (err instanceof Error) {
        res.json({ error: err.message });
    } else {
        res.json({ error: err });
    }
});

// new TestCron().start();
// new DeleteOldEventsCron().start();
// new GetICalEventsCron().start();

EasySyncServerDb.getInstance()
    .getConnectionPromise()
    .then(async () => {
        Translator.init({
            translations: {
                de: translationGerman,
                en: translationEnglish,
            },
            fallbackLanguage: 'de',
            // markTranslations: true,
            markUntranslatedTranslations: true,
        });

        app.listen(port, () => {
            console.log('Server started on Port: ' + port);
        });
    });
