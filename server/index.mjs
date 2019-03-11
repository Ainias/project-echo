import {EasySyncServerDb} from "cordova-sites-easy-sync/server";

import express from 'express';
// import bodyParser from 'body-parser';
import {routes} from './routes';

//Import Models
// import "../model/Region";
// import "../model/Event";
// import "../model/Church";
// import "../model/EventRegion";
// import {Region} from "../model/Region";
import {Church} from "../model/Church";
import {BaseDatabase, BaseModel} from "cordova-sites-database";
import {Region} from "../model/Region";
import typeorm from "typeorm";
// import "../model/ChurchRegion";


const port = process.env.PORT || 3000;

BaseModel._databaseClass = EasySyncServerDb;
BaseDatabase.typeorm = typeorm;
EasySyncServerDb.typeorm = typeorm;
EasySyncServerDb.CONNECTION_PARAMETERS = {
    "type": "mysql",
    "host": "localhost",
    "username": "root",
    "password": "123456",
    "database": "silas_echo",
    "synchronize": true,
    "logging": true
};

// let db =EasySyncServerDb.getInstance();
// db._syncPromise.then(async () => {
//     let RegionModel = db._models["region"].sequelizeModelDefinition;
//     let ChurchModel = db._models["church"].sequelizeModelDefinition;
//
//     let region = await RegionModel.findByPk(2);
//     let church = await ChurchModel.create({
//         "descriptions":"des",
//         "names":"name",
//         "images":"images",
//         "deleted":false,
//         "places":"places",
//         "website":"www.citychurch.koeln",
//         "version":1
//     });
//     region.setChurch([church]);
//     await region.save();
//     // this._models[model.constructor.getModelName()].sequelizeModelDefinition.findById(model.getId())
// });


// Region.select({"id": 2}, null, null, null, true).then(async regions => {
//         // console.log(regions[0].getChurchs());
//         let church = new Church();
//         church.setDescriptions({"de":"Testkirche"});
//         church.setNames({"de":"Testkirche"});
//         church.setWebsite("www.citychurch.koeln");
//         await church.save();
//         console.log("done 1");
//         regions[0].getChurchs().push(church);
//         await regions[0].save();
//         console.log("done 2");
//     }
// ).catch(e => console.error(e));

const app = express();

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

    // console.log(await region.save());
    app.listen(port, () => {
        console.log('Server started on Port: ' + port);
    });
});
