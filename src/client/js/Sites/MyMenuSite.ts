import {MatomoDelegateSite, MenuSite} from "cordova-sites";

export class MyMenuSite extends MenuSite{

    constructor(siteManager: any, view: any, menuTemplate?: any) {
        super(siteManager, view, menuTemplate);
        this.addDelegate(new MatomoDelegateSite(this));
    }
}
