import express from 'express';
import {easySyncRoutes} from "cordova-sites-easy-sync/server";

const routerV1 = express.Router();

// routerV1.get("/test", async (req, res) => {
    // let t = new Test();
    // // console.log(Test.saveModel);
    // await t.save();
    // res.json(await Test.select());
// });
routerV1.use("/sync", easySyncRoutes);

export {routerV1};