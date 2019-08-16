import express from 'express';
import {userRoutes, syncRoutes} from "cordova-sites-user-management/server";

const routerV1 = express.Router();

routerV1.use("/sync", syncRoutes);
routerV1.use("/user", userRoutes);

export {routerV1};