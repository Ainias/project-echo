// import express from 'express';
// import {easySyncRoutes} from "cordova-sites-easy-sync/server";
// import {SyncController} from "./SyncController";
//
// const routerV1 = express.Router();
//
// const errorHandler = (fn) => {
//     return (req, res, next) => {
//         const resPromise = fn(req,res,next);
//         if (resPromise.catch){
//             resPromise.catch(err => next(err));
//         }
//     }
// };
//
// // routerV1.get("/church", errorHandler(SyncController.syncChurchWithRegion));
// routerV1.use("/sync", easySyncRoutes);
//
// export {routerV1};

import express from 'express';
import {userRoutes, syncRoutes} from "cordova-sites-user-management/server";

const routerV1 = express.Router();

// const errorHandler = (fn) => {
//     return (req, res, next) => {
//         const resPromise = fn(req,res,next);
//         if (resPromise && resPromise.catch){
//             resPromise.catch(err => next(err));
//         }
//     }
// };

routerV1.use("/sync", syncRoutes);
routerV1.use("/user", userRoutes);

export {routerV1};