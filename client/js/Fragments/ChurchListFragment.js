import view from "../../html/Fragments/churchListFragment.html";
import {ShowChurchSite} from "../Sites/ShowChurchSite";
import {PlaceHelper} from "../Helper/PlaceHelper";
import {FsjChurchBaseListFragment} from "./FsjChurchBaseListFragment";

export class ChurchListFragment extends FsjChurchBaseListFragment {

    constructor(site) {
        super(site, view);
    }

    /**4
     *
     * @param {Church} church
     */
    renderElement(church) {
        let churchElem = super.renderElement(church);

        let places = church.places;
        if (!Array.isArray(places)) {
            places = Object.keys(places);
        }

        if (places.length > 0) {
            ((places.length === 1) ?
                PlaceHelper.createPlace(places[0]) : PlaceHelper.createMultipleLocationsView()).then(view => churchElem.querySelector(".place-container").appendChild(view));
        }
        return churchElem;
    }


    infoElemClicked(id) {
        this.getSite().finishAndStartSite(ShowChurchSite, {"id": id});
    }
}