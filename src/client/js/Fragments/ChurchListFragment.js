import view from '../../html/Fragments/churchListFragment.html';
import { ShowChurchSite } from '../Sites/ShowChurchSite';
import { PlaceHelper } from '../Helper/PlaceHelper';
import { FsjChurchBaseListFragment } from './FsjChurchBaseListFragment';
import { ListChurchesSite } from '../Sites/ListChurchesSite';

export class ChurchListFragment extends FsjChurchBaseListFragment {
    constructor(site) {
        super(site, view);
    }

    /** 4
     *
     * @param {Church} church
     */
    renderElement(church) {
        const churchElem = super.renderElement(church);

        const { places } = church;
        const placesIsArray = Array.isArray(places);
        let placesIndexes = places;
        if (!placesIndexes) {
            placesIndexes = Object.keys(places);
        }

        if (placesIndexes.length > 0) {
            (placesIndexes.length === 1
                ? PlaceHelper.createPlace(placesIndexes[0], placesIsArray ? places[0] : places[placesIndexes[0]], true)
                : PlaceHelper.createMultipleLocationsView()
            ).then((view) => churchElem.querySelector('.place-container').appendChild(view));
        }
        return churchElem;
    }

    infoElemClicked(id) {
        this.getSite().startSite(ShowChurchSite, { id });
    }
}
