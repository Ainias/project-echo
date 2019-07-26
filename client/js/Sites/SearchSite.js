import {FooterSite} from "./FooterSite";
import view from "../../html/Sites/searchSite.html";
import {EventOverviewFragment} from "../Fragments/EventOverviewFragment";
import {App} from "cordova-sites";
import {EventHelper} from "../Helper/EventHelper";
import {Helper} from "js-helper";

export class SearchSite extends FooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._eventListFragment = new EventOverviewFragment(this);
        this.addFragment("#event-list", this._eventListFragment);
        this._footerFragment.setSelected(".icon.search");
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this._searchString = "";
        if (Helper.isSet(constructParameters, "q")){
            this._searchString = constructParameters["q"];
        }
        return res;
    }

    async onStart(pauseArguments) {
        let res = super.onStart(pauseArguments);

        let events = await EventHelper.search(this._searchString);
        this._eventListFragment.setEvents(events);

        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("search", SearchSite);
});