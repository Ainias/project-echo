import {ShowFsjChurchSite} from "./ShowFsjChurchSite";
import {Fsj} from "../../../shared/model/Fsj";
import {App} from "cordova-sites/dist/client/js/App";
import {UserManager} from "cordova-sites-user-management/dist/client/js/UserManager";
import {ConfirmDialog} from "cordova-sites/dist/client/js/Dialog/ConfirmDialog";
import {Toast} from "cordova-sites/dist/client/js/Toast/Toast";
import {ModifyFsjSite} from "./ModifyFsjSite";

export class ShowFsjSite extends ShowFsjChurchSite{

    async _loadElem(id) {
        return await Fsj.findById(id, Fsj.getRelations());
    }

    async _deleteElem() {
        if (UserManager.getInstance().hasAccess(Fsj.ACCESS_MODIFY)) {
            if (await new ConfirmDialog("Möchtest du das FSJ wirklich löschen? Es wird unwiederbringlich verloren gehen!", "FSJ löschen?").show()) {
                await this._element.delete();
                new Toast("FSJ wurde erfolgreich gelöscht").show();
                this.finish();
            }
        }
    }

    _modifyElem() {
        if (UserManager.getInstance().hasAccess(Fsj.ACCESS_MODIFY)) {
            this.finishAndStartSite(ModifyFsjSite, {id: this._element.id});
        }
    }
}

App.addInitialization((app) => {
    app.addDeepLink("fsj", ShowFsjSite);
});