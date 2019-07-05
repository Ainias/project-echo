import {AlphabeticListFragment, Translator} from "cordova-sites";

import view from "../../html/Fragments/churchListFragment.html";
import {ShowChurchSite} from "../Sites/ShowChurchSite";
import {PlaceHelper} from "../Helper/PlaceHelper";

export class ChurchListFragment extends AlphabeticListFragment {

    constructor(site) {
        super(site, view);
    }

    async onViewLoaded() {
        this._template = this.findBy(".church-info-template");
        this._template.remove();
        this._template.classList.remove("church-info-template");

        return super.onViewLoaded();
    }

    /**
     *
     * @param {Church} church
     */
    renderElement(church) {
        Translator.getInstance().addDynamicTranslations(church.getDynamicTranslations());
        let churchElem = this._template.cloneNode(true);
        churchElem.querySelector(".name").appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));

        let places = church.places;
        if (!Array.isArray(places)) {
            places = Object.keys(places);
        }

        if (places.length > 0) {
            ((places.length === 1) ?
                PlaceHelper.createPlace(places[0]) : PlaceHelper.createMultipleLocationsView()).then(view => churchElem.querySelector(".place-container").appendChild(view));
        }

        churchElem.addEventListener("click", () => {
            this.getSite().finishAndStartSite(ShowChurchSite, {"id": church.id});
        });
        return churchElem;
    }
}