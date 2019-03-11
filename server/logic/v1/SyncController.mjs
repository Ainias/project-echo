import {EasySyncController} from "cordova-sites-easy-sync/src/server/EasySyncController";
import {EasySyncServerDb} from "cordova-sites-easy-sync/src/server/EasySyncServerDb";

// import {ChurchRegion} from "../../../model/ChurchRegion";

export class SyncController extends EasySyncController {
    static async syncChurchWithRegion(req, res) {

        let db = await EasySyncServerDb.getInstance();

        let requestedModels = {};
        let modelClasses = {};
        if (req.query.models) {
            requestedModels = JSON.parse(req.query.models);
            Object.keys(requestedModels).forEach(model => {
                modelClasses[model] = db.getModel(model);
            });
        } else {
            modelClasses = db.getModel();
            Object.keys(modelClasses).forEach(name => requestedModels[name] = {});
        }

        //create lastSynced before the queries to db
        let result = {
            "nextOffset": -1,
            "models": {},
            "newLastSynced": new Date().getTime()
        };

        // let churchRegion = await ChurchRegion.select({"regionId": {[Op.in]: requestedModels["church"].where["regions"]}});
        // console.log(churchRegion);
        // let churchIds = [];
        // churchRegion.forEach(region => churchIds.push(region.getChurchId()));
        // console.log(churchIds);

        // let where = {"id": {[Op.in]: churchIds}};
        let where = {"id": {[Op.in]: [2,3]}};
        let modelRes = await (EasySyncController._syncModel(
            modelClasses["church"],
            (requestedModels["church"].lastSynced || 0),
            (req.query.offset || 0), where));


            if (modelRes.shouldAskAgain) {
                result.nextOffset = result.nextOffset < 0 ? modelRes.nextOffset : Math.min(modelRes.nextOffset, result.nextOffset);
            }
            result.models[modelClasses["church"].getModelName()] = modelRes;

        res.json(result);
    }
}