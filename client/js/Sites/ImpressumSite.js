import {MenuFooterSite} from "./MenuFooterSite";

import view from "../../html/Sites/impressumSite.html"

export class ImpressumSite extends MenuFooterSite{
    constructor(siteManager) {
        super(siteManager, view);
    }
}