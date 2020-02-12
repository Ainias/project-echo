import {AbstractFragment, Helper} from "cordova-sites";

import viewFooter from '../../html/Fragments/footerFragment.html';
import {WelcomeSite} from "../Sites/WelcomeSite";
import {CalendarSite} from "../Sites/CalendarSite";
import {FavoritesSite} from "../Sites/FavoritesSite";
import {SearchSite} from "../Sites/SearchSite";


export class FooterFragment extends AbstractFragment {
    constructor(site) {
        super(site, viewFooter);
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this.findBy(".icon.home").addEventListener("click", () => {
            this.getSite().startSite(WelcomeSite);
        });

        this.findBy(".icon.calendar").addEventListener("click", () => {
            this.getSite().startSite(CalendarSite);
        });

        this.findBy(".icon.favorites").addEventListener("click", () => {
            this.getSite().startSite(FavoritesSite);
        });

        this.findBy(".icon.search").addEventListener("click", () => {
            this.getSite().startSite(SearchSite);
        });

        this.findBy(".icon", true).forEach(icon => {
            icon.addEventListener("click", (e) => {
                this.setSelected(e.target);
            });
        });
        return res;
    }

    async setSelected(selectorOrElement) {
        await this._viewPromise;
        let oldSelected = this.findBy(".selected");
        if (Helper.isNotNull(oldSelected)) {
            oldSelected.classList.remove("selected");
        }
        if (typeof selectorOrElement === "string") {
            selectorOrElement = this.findBy(selectorOrElement);
        }
        if (selectorOrElement) {
            selectorOrElement.classList.add("selected");
        }
    }
}

// FooterFragment._selected = "home";