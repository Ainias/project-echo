import express from 'express';
import {easySyncRoutes} from "cordova-sites-easy-sync/server";
import {SyncController} from "./SyncController";

const routerV1 = express.Router();

const errorHandler = (fn) => {
    return (req, res, next) => {
        const resPromise = fn(req,res,next);
        if (resPromise.catch){
            resPromise.catch(err => next(err));
        }
    }
};

routerV1.get("/church", errorHandler(SyncController.syncChurchWithRegion));
routerV1.use("/sync", easySyncRoutes);

export {routerV1};