import * as express from 'express';
import {routerV1} from "./logic/v1/routes";

const routes = express.Router();
routes.use("/v1", routerV1);

export {routes};