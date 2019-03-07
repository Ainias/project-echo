import {AbstractFragment, Helper} from "cordova-sites";

import viewFooter from '../../html/Fragments/footerFragment.html';


export class FooterFragment extends AbstractFragment {
    constructor(site) {
        super(site, viewFooter);
    }


    async onViewLoaded() {
        let res = super.onViewLoaded();
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
        selectorOrElement.classList.add("selected");
    }
}