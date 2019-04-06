
import view from "../../html/Sites/welcomeSite.html";
import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";
import componentImg from "../../img/component.png"

export class WelcomeSite extends AbsoluteBarMenuSite{

    constructor(siteManager) {
        super(siteManager, view);
        this._navbarFragment.setCanGoBack(false);
        this._footerFragment.setSelected(".icon.home");
        this._navbarFragment.setBackgroundImage(componentImg);
    }
}