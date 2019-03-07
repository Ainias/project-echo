
import view from "../../html/Sites/welcomeSite.html";
import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";
import {SyncJob} from "cordova-sites-easy-sync/client";
import {Test} from "../../../model/Test";
import {Event} from "../../../model/Event";
import {DataManager} from "cordova-sites";

export class WelcomeSite extends AbsoluteBarMenuSite{

    constructor(siteManager) {
        super(siteManager, view);
    }

    async onViewLoaded() {

       // console.log("Data ",await DataManager.send("sync", {"model":"test"}));


        return super.onViewLoaded();
    }
}