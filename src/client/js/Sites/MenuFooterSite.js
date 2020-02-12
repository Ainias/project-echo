import {MenuSite} from "cordova-sites";

import menuTemplate from '../../html/Sites/menuFooterSiteTemplate.html';
import {FooterFragment} from "../Fragments/FooterFragment";

export class MenuFooterSite extends MenuSite {

    constructor(siteManager, view) {
        super(siteManager, view, menuTemplate);
        this._footerFragment = new FooterFragment(this);
        this.addFragment("#footer-fragment", this._footerFragment);
    }

    async onStart(pauseArguments) {
        await super.onStart(pauseArguments);
        if (window.StatusBar) {
            StatusBar.overlaysWebView(true);
            StatusBar.backgroundColorByHexString('#33000000');
        }
    }
}