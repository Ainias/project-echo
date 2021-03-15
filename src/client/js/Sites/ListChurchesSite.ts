import {App, Helper, Translator} from "cordova-sites";
import {Region} from "../../../shared/model/Region";
import {MenuFooterSite} from "./MenuFooterSite";
import {ChurchListFragment} from "../Fragments/ChurchListFragment";
import {WelcomeSite} from "./WelcomeSite";
import {Church} from "../../../shared/model/Church";

const view = require("../../html/Sites/listChurchesSite.html")

export class ListChurchesSite extends MenuFooterSite {

    private alphabeticListFragment: ChurchListFragment;

    constructor(siteManager) {
        super(siteManager, view);
        this.alphabeticListFragment = new ChurchListFragment(this);
        this.addFragment("#church-list", this.alphabeticListFragment);
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

        let churches: { [id: number]: Church } = {};
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
            const names = church.getNames();
            let name = Helper.nonNull(names[currentLang], names[fallbackLanguage], names[Object.keys(names)[0]], "");
            namedChurches[name + "-" + church.id] = church;
        });

        this.alphabeticListFragment.setElements(namedChurches);

        return res;
    }

    onViewLoaded(): Promise<any[]> {
        const res = super.onViewLoaded();

        const headingElem = this.findBy("#church-list-heading");
        headingElem.remove();
        this.alphabeticListFragment.setHeading(headingElem);

        return res;
    }

    goBack() {
        this.finishAndStartSite(WelcomeSite);
    }
}

App.addInitialization((app) => {
    app.addDeepLink("churches", ListChurchesSite);
});
