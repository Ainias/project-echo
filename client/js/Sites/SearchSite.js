import {FooterSite} from "./FooterSite";
import view from "../../html/Sites/searchSite.html";
import {EventOverviewFragment} from "../Fragments/EventOverviewFragment";
import {App, Helper as SitesHelper, Translator, ViewInflater} from "cordova-sites";
import {EventHelper} from "../Helper/EventHelper";
import {Helper} from "js-helper/dist/shared";
import {Church} from "../../../model/Church";
import {Event} from "../../../model/Event";
import {ViewHelper} from "js-helper/src/client/ViewHelper";

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
        if (Helper.isSet(constructParameters, "q")) {
            this._searchString = constructParameters["q"];
        }

        this._start = SitesHelper.strftime("%Y-%m-%d");
        if (Helper.isSet(constructParameters, "start")) {
            this._start = constructParameters["start"];
        }

        this._end = "";
        if (Helper.isSet(constructParameters, "end")) {
            this._end = constructParameters["end"];
        }

        this._types = [];
        if (Helper.isSet(constructParameters, "types") && constructParameters["types"].trim() !== "") {
            try {
                this._types = constructParameters["types"].split(",");
            } catch (e) {
            }
        }

        this._churches = [];
        if (Helper.isSet(constructParameters, "churches") && constructParameters["churches"].trim() !== "") {
            try {
                this._churches = constructParameters["churches"].split(",");
            } catch (e) {
            }
        }

        this._possibleChurches = await Church.find();
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this._searchFilter = this.findBy("#search-filter");
        this._searchResults = this.findBy("#search-results");

        this._filterTagTemplate = this.findBy("#filter-tag-template");
        this._filterTagTemplate.removeAttribute("id");
        this._filterTagTemplate.remove();

        this._filterEventContainer = this.findBy("#filter-event-tag-container");
        this._filterOrganiserContainer = this.findBy("#filter-organiser-tag-container");

        this._searchInput = this.findBy("#search-input");

        this.findBy("#search-button").addEventListener("click", () => {
            this._search();
        });

        this._searchInput.addEventListener("keyup", () => {
            this._filterTags(this._searchInput.value);
        });
        this._searchInput.addEventListener("focus", () => {
            this._showFilter();
        });

        if (this._searchString.trim() !== "" || this._types.length >= 1 || this._churches.length >= 1) {
            await this._search();
        } else {
            await this._showFilter();
        }

        return res;
    }

    async _showFilter() {
        this._searchFilter.classList.remove("hidden");
        this._searchResults.classList.add("hidden");
        this._filterTags(this._searchInput.value);
    }

    async _search() {
        this._searchString = this._searchInput.value;
        await this.showLoadingSymbol();

        this.setParameters({
            "q": this._searchString,
            "types": this._types,
            "churches": this._churches
        });

        let events = await EventHelper.search(this._searchString, this._start, this._end, this._types, this._churches);
        await this._eventListFragment.setEvents(events);

        this._searchFilter.classList.add("hidden");
        this._searchResults.classList.remove("hidden");

        await this.removeLoadingSymbol();
    }

    _filterTags(value) {
        ViewHelper.removeAllChildren(this._filterEventContainer);
        ViewHelper.removeAllChildren(this._filterOrganiserContainer);

        Object.values(Event.TYPES).forEach(type => {
            let translation = Translator.translate(type).toLowerCase();

            if (true || translation.indexOf(value.toLowerCase()) !== -1 || this._types.indexOf(type) !== -1) {
                let tag = this._filterTagTemplate.cloneNode(true);
                tag.appendChild(Translator.makePersistentTranslation(type));
                tag.dataset["type"] = type;

                if (this._types.indexOf(type) !== -1) {
                    tag.classList.add("selected");
                }
                tag.addEventListener("click", () => {
                    let index = this._types.indexOf(type);
                    if (index === -1) {
                        this._types.push(type);
                        tag.classList.add("selected");
                    } else {
                        this._types.splice(index, 1);
                        tag.classList.remove("selected");
                    }
                });
                this._filterEventContainer.appendChild(tag);
            }
        });

        this._possibleChurches.forEach(church => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

            let translation = Translator.translate(church.getNameTranslation()).toLowerCase();

            if (true || translation.indexOf(value.toLowerCase()) !== -1 || this._churches.indexOf(church.id) !== -1) {
                let tag = this._filterTagTemplate.cloneNode(true);
                tag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
                tag.dataset["churchId"] = church.id;

                if (this._churches.indexOf(church.id + "") !== -1) {
                    tag.classList.add("selected");
                }

                tag.addEventListener("click", () => {
                    let index = this._churches.indexOf(church.id + "");
                    if (index === -1) {
                        this._churches.push(church.id + "");
                        tag.classList.add("selected");
                    } else {
                        this._churches.splice(index, 1);
                        tag.classList.remove("selected");
                    }
                });

                this._filterOrganiserContainer.appendChild(tag);
            }
        })
    }
}

App.addInitialization((app) => {
    app.addDeepLink("search", SearchSite);
});