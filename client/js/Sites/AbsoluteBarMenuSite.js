import {MenuSite} from "cordova-sites";

import menuTemplate from '../../html/Sites/absoluteBarMenuSiteTemplate.html';
import {FooterFragment} from "../Fragments/FooterFragment";

export class AbsoluteBarMenuSite extends MenuSite {

    constructor(siteManager, view) {
        super(siteManager, view, menuTemplate);
        this._footerFragment = new FooterFragment(this);
        this.addFragment("#footer-fragment", this._footerFragment);
    }
}