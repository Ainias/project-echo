import {FsjChurchBaseListFragment} from "./FsjChurchBaseListFragment";
import {ShowFsjSite} from "../Sites/ShowFsjSite";

export class FsjListFragment extends FsjChurchBaseListFragment {

    infoElemClicked(id) {
        this.getSite().startSite(ShowFsjSite, {"id": id});
    }
}