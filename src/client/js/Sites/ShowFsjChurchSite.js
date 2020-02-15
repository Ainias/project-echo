import view from "../../html/Sites/showFsjChurchSite.html"
import {Helper, Toast, Translator} from "cordova-sites";
import {Church} from "../../../shared/model/Church";
import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";
import {UserManager} from "cordova-sites-user-management/dist/client/js/UserManager";

export class ShowFsjChurchSite extends AbsoluteBarMenuSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._footerFragment.setSelected(".icon.home");
    }

    /**
     * @param {FsjChurchBaseObject} elem
     */
    setElement(elem){
        this._element = elem;

        if (Helper.isNull(this._element)) {
            new Toast("no element found").show();
            this.finish();
            return;
        }

        //Image
        let images = this._element.images;
        if (images.length > 0) {
            this._navbarFragment.setBackgroundImage(images[0]);
        }
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        if (Helper.isNull(constructParameters) || Helper.isNull(constructParameters["id"])) {
            new Toast("no id given").show();
            this.finish();
            return;
        }

        let elem = await this._loadElem(parseInt(constructParameters["id"]));
        this.setElement(elem);

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(this._element.getDynamicTranslations());

        //name
        this.findBy("#name").appendChild(translator.makePersistentTranslation(this._element.getNameTranslation(), true));

        //description
        this.findBy("#description").appendChild(translator.makePersistentTranslation(this._element.getDescriptionTranslation()));

        //link
        let link = this.findBy("#website");

        let href = this._element.website;
        if (!href.startsWith("http") && !href.startsWith("//")) {
            href = "https://" + href;
        }
        link.href = href;
        link.appendChild(document.createTextNode(this._element.website));

        // //places
        // let placesContainer = this.findBy("#places-container");
        //
        // let places = this._element.places;
        // let placesAreObject = false;
        //
        // if (!Array.isArray(places)){
        //     places = Object.keys(places);
        //     placesAreObject = true;
        // }

        // await Helper.asyncForEach(places, async place => {
        //     placesContainer.appendChild(await PlaceHelper.createPlace(place, (placesAreObject)?this._element.places[place]: place));
        // });


        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Church.ACCESS_MODIFY)) {
                this.findBy(".admin-panel").classList.remove("hidden");
            } else {
                this.findBy(".admin-panel").classList.add("hidden");
            }
        }, true);

        this.findBy("#delete-elem").addEventListener("click", async () => {
                this._deleteElem();
            // if (UserManager.getInstance().hasAccess(Church.ACCESS_MODIFY)) {
                // if (await new ConfirmDialog("möchtest du die Kirche wirklich löschen? Sie wird unwiederbringlich verloren gehen!", "Kirche löschen?").show()) {
                //     await this._element.delete();
                //     new Toast("Kirche wurde erfolgreich gelöscht").show();
                //     this.finish();
                // }
            // }
        });
        this.findBy("#modify-elem").addEventListener("click", async () => {
            this._modifyElem();
            // if (UserManager.getInstance().hasAccess(Church.ACCESS_MODIFY)) {
            //     this.finishAndStartSite(ModifyChurchSite, {id: this._element.id});
            // }
        });

        return res;
    }

    async _loadElem(number) {
        throw new Error("needs to be overriden! - loadElem")
    }

    _deleteElem() {
        throw new Error("needs to be overriden! - deleteElem")
    }

    _modifyElem() {
        throw new Error("needs to be overriden! - modifyElem")
    }
}