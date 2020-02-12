import view from "../../html/Sites/listChurchesSite.html"
import {App, Helper, Translator} from "cordova-sites";
import {Region} from "../../../shared/model/Region";
import {MenuFooterSite} from "./MenuFooterSite";
import {ChurchListFragment} from "../Fragments/ChurchListFragment";
import {WelcomeSite} from "./WelcomeSite";

export class ListChurchesSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._alphabeticListFragment = new ChurchListFragment(this);
        this.addFragment("#church-list", this._alphabeticListFragment);
        this._footerFragment.setSelected(".icon.home");
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        let regionIds = [];
        if (constructParameters) {
            Helper.nonNull(constructParameters["regionIds"], []);
        }
        let regions = [];
        if (regionIds.length >= 1) {
            regions = await Region.findByIds(regionIds, Region.getRelations());
        } else {
            regions = await Region.find(undefined, undefined, undefined, undefined, Region.getRelations());
        }

        let churches = {};
        regions.forEach(region => {
            if (region.churches) {
                region.churches.forEach(church => {
                    churches[church.id] = church;
                })
            }
        });

        let currentLang = Translator.getInstance().getCurrentLanguage();
        let fallbackLanguage = Translator.getInstance().getFallbackLanguage();

        let namedChurches = {};
        Object.values(churches).forEach(church => {
            let name = Helper.nonNull(church.names[currentLang], church.names[fallbackLanguage], church.names[Object.keys(church.names)[0]], "");
            namedChurches[name + "-"+church.id] = church;
        });

        this._alphabeticListFragment.setElements(namedChurches);

        return res;
    }

    goBack() {
        this.finishAndStartSite(WelcomeSite);
    }
}

App.addInitialization((app) => {
    app.addDeepLink("churches", ListChurchesSite);
});