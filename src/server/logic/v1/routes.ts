import * as express from 'express';
import {userRoutes, syncRoutes} from "cordova-sites-user-management/dist/server";
import {UserManager} from "cordova-sites-user-management/dist/server";
import {DeleteRepeatedEventController} from "./controller/DeleteRepeatedEventController";

const routerV1 = express.Router();

const errorHandler = (fn, context) => {
    return (req, res, next) => {
        const resPromise = fn.call(context, req,res,next);
        if (resPromise && resPromise.catch){
            resPromise.catch(err => next(err));
        }
    }
};

syncRoutes.post("/deleteRepeatedEvent", errorHandler(UserManager.setUserFromToken, UserManager), errorHandler(DeleteRepeatedEventController.deleteRepeatedEvent, DeleteRepeatedEventController));

routerV1.use("/sync", syncRoutes);
routerV1.use("/user", userRoutes);

export {routerV1};