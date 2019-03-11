
import view from "../../html/Sites/welcomeSite.html";
import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";

export class WelcomeSite extends AbsoluteBarMenuSite{

    constructor(siteManager) {
        super(siteManager, view);
    }

    async onViewLoaded() {

       // console.log("Data ",await DataManager.send("sync", {"model":"test"}));


        return super.onViewLoaded();
    }
}