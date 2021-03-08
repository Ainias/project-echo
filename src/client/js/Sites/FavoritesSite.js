import view from "../../html/Sites/favoritesSite.html";
import {FooterSite} from "./FooterSite";
import {App} from "cordova-sites";
import {Favorite} from "../Model/Favorite";
import {EventOverviewFragment} from "../Fragments/EventOverviewFragment";

export class FavoritesSite extends FooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._eventListFragment = new EventOverviewFragment(this);
        this.addFragment("#favorite-list", this._eventListFragment);
        this._footerFragment.setSelected(".icon.favorites");
    }

    async onStart(pauseArguments) {
        let res = super.onStart(pauseArguments);

        let favorites = await Favorite.find({isFavorite: true}, undefined, undefined, undefined);
        let events = await Favorite.getEvents(favorites);

        console.log("favorites", favorites, events);

        this._eventListFragment.setEvents(events);

        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("favorites", FavoritesSite);
});