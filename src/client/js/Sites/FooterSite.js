import {TemplateSite} from "cordova-sites";
import footerTemplate from "../../html/Sites/footerSite.html";
import {FooterFragment} from "../Fragments/FooterFragment";

export class FooterSite extends TemplateSite{
    constructor(siteManager, view) {
        super(siteManager, view, footerTemplate, "#site-content");
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