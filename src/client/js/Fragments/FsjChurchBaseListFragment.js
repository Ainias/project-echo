import {AlphabeticListFragment, Translator} from "cordova-sites";
import {Helper} from "js-helper/dist/shared"

import defaultView from "../../html/Fragments/fsjChurchBaseListFragment.html";

export class FsjChurchBaseListFragment extends AlphabeticListFragment {

    constructor(site, view) {
        super(site, Helper.nonNull(view, defaultView));
    }

    async onViewLoaded() {
        this._template = this.findBy(".info-template");
        this._template.remove();
        this._template.classList.remove("info-template");

        return super.onViewLoaded();
    }

    /**
     * @param {Church|Fsj} obj
     */
    renderElement(obj) {
        Translator.getInstance().addDynamicTranslations(obj.getDynamicTranslations());
        let infoElement = this._template.cloneNode(true);
        infoElement.querySelector(".name").appendChild(Translator.makePersistentTranslation(obj.getNameTranslation()));

        infoElement.addEventListener("click", () => {
            this.infoElemClicked(obj.id);
        });
        return infoElement;
    }

    infoElemClicked(id){}
}