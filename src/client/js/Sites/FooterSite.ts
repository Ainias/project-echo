import {TemplateSite} from "cordova-sites";
const footerTemplate = require("../../html/Sites/footerSite.html");
import {FooterFragment} from "../Fragments/FooterFragment";

export class FooterSite extends TemplateSite{
    private _footerFragment: FooterFragment;
    constructor(siteManager, view) {
        super(siteManager, view, footerTemplate, "#site-content");
        this._footerFragment = new FooterFragment(this);
        this.addFragment("#footer-fragment", this._footerFragment);
    }

    async onStart(pauseArguments) {
        await super.onStart(pauseArguments);
        // @ts-ignore
        if (window.StatusBar) {
            // @ts-ignore
            StatusBar.overlaysWebView(true);
            // @ts-ignore
            StatusBar.backgroundColorByHexString('#33000000');
        }
    }

    getFooterFragment(){
        return this._footerFragment;
    }
}
