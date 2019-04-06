import {AlphabeticListFragment, Translator} from "cordova-sites";

import view from "../../html/Fragments/churchListFragment.html";
import {ShowChurchSite} from "../Sites/ShowChurchSite";

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
        if (church.places.length > 0) {
            churchElem.querySelector(".place").appendChild((church.places.length === 1) ?
                document.createTextNode(church.places[0]) : Translator.makePersistentTranslation("Multiple locations"));
        }
        churchElem.addEventListener("click", () => {
            this.getSite().startSite(ShowChurchSite, {"id": church.id});
        });
        return churchElem;
    }
}