import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";
import {Church} from "../../../model/Church";

import view from "../../html/Sites/listChurchesSite.html"
import {App, Helper, MenuSite, Translator} from "cordova-sites";
import {ShowChurchSite} from "./ShowChurchSite";
import {Region} from "../../../model/Region";
import {MenuFooterSite} from "./MenuFooterSite";

export class ListChurchesSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
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

        console.log(regions);

        let currentLang = Translator.getInstance().getCurrentLanguage();
        let fallbackLanguage = Translator.getInstance().getFallbackLanguage();

        /** @type{Church[]}*/
        this._churches = Object.values(churches).sort((a, b) => {
            a = a.names;
            b = b.names;

            let aName = Helper.nonNull(a[currentLang], a[fallbackLanguage], a[Object.keys(a)[0]], "");
            let bName = Helper.nonNull(b[currentLang], b[fallbackLanguage], b[Object.keys(a)[0]], "");

            return aName.localeCompare(bName);
        });

        // console.log(this._churches);
        // console.log(await Church.findById(12));

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        this._churchContainer = this.findBy("#church-info-container");
        this._churchTemplate = this.findBy("#church-info-template");

        this._churchTemplate.removeAttribute("id");
        this._churchTemplate.remove();

        this._updateChurches();
        return res;
    }

    _updateChurches() {
        Helper.removeAllChildren(this._churchContainer);

        let translator = Translator.getInstance();
        this._churches.forEach(church => {
            translator.addDynamicTranslations(church.getDynamicTranslations());
            let churchElem = this._churchTemplate.cloneNode(true);
            churchElem.querySelector(".name").appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
            if (church.places.length > 0) {
                churchElem.querySelector(".place").appendChild((church.places.length === 1) ?
                    document.createTextNode(church.places[0]) : Translator.makePersistentTranslation("Multiple locations"));
            }
            churchElem.addEventListener("click", () => {
                this.startSite(ShowChurchSite, {"id": church.id});
            });
            this._churchContainer.appendChild(churchElem);
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink("churches", ListChurchesSite);
});