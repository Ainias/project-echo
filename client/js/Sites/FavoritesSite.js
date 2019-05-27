import view from "../../html/Sites/favoritesSite.html";
import {FooterSite} from "./FooterSite";

export class FavoritesSite extends FooterSite{
    constructor(siteManager) {
        super(siteManager, view);
        this._footerFragment.setSelected(".icon.favorites");
    }
}