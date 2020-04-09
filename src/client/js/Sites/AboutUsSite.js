import {MenuFooterSite} from "./MenuFooterSite";

import view from "../../html/Sites/aboutUsSite.html"
import {App} from "cordova-sites/dist/client/js/App";

export class AboutUsSite extends MenuFooterSite{
    constructor(siteManager) {
        super(siteManager, view);
    }
}

App.addInitialization((app) => {
    app.addDeepLink("aboutUs", AboutUsSite);
});