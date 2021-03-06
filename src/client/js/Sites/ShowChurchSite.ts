const view = require("../../html/Sites/showChurchSite.html");

import {App, ConfirmDialog, Helper, Toast, Translator} from "cordova-sites/dist/client";
import {Church} from "../../../shared/model/Church";
import {AbsoluteBarMenuSite} from "./AbsoluteBarMenuSite";
import {PlaceHelper} from "../Helper/PlaceHelper";
import {UserManager} from "cordova-sites-user-management/dist/client/js/UserManager";
import {ModifyChurchSite} from "./ModifyChurchSite";
import {CalendarSite} from "./CalendarSite";

export class ShowChurchSite extends AbsoluteBarMenuSite {
    private _church: Church;

    constructor(siteManager) {
        super(siteManager, view);
        this.footerFragment.setSelected(".icon.home");
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        if (Helper.isNull(constructParameters) || Helper.isNull(constructParameters["id"])) {
            new Toast("no id given").show();
            this.finish();
        }

        /** @var {Church} */
        this._church = await Church.findById(parseInt(constructParameters["id"]), Church.getRelations());

        if (Helper.isNull(this._church)) {
            new Toast("no church found").show();
            this.finish();
        }

        //Image
        let images = this._church.getImages();
        if (images.length > 0) {
            this.getNavbarFragment().setBackgroundImage(images[0]);
        }

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        this._view.classList.add("church-site");

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(this._church.getDynamicTranslations());

        //name
        this.findBy("#name").appendChild(translator.makePersistentTranslation(this._church.getNameTranslation(), true));

        //description
        this.findBy("#description").appendChild(translator.makePersistentTranslation(this._church.getDescriptionTranslation()));

        //link
        let link = this.findBy("#website");

        let href = this._church.getWebsite();
        if (!href.startsWith("http") && !href.startsWith("//")) {
            href = "https://" + href;
        }
        link.href = href;
        link.appendChild(document.createTextNode(this._church.getWebsite()));

        let instagramLink = this._church.getInstagram();
        if (instagramLink) {
            if (!instagramLink.startsWith("http") && !instagramLink.startsWith("//")) {
                instagramLink = "https://" + instagramLink;
            }
            const instagramElement = this.findBy("#instagram-link");
            instagramElement.href = instagramLink;
            instagramElement.classList.remove("hidden");
        }


        //places
        let placesContainer = this.findBy("#places-container");

        let places = this._church.places;
        let placesAreObject = false;

        if (!Array.isArray(places)) {
            places = Object.keys(places);
            placesAreObject = true;
        }

        await Helper.asyncForEach(places, async place => {
            placesContainer.appendChild(await PlaceHelper.createPlace(place, (placesAreObject) ? this._church.places[place] : place));
        });
        placesContainer.dataset["numPlaces"] = "" + places.length;

        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Church.ACCESS_MODIFY)) {
                this.findBy(".admin-panel").classList.remove("hidden");
            } else {
                this.findBy(".admin-panel").classList.add("hidden");
            }
        }, true);

        this.findBy("#delete-church").addEventListener("click", async () => {
            if (UserManager.getInstance().hasAccess(Church.ACCESS_MODIFY)) {
                if (await new ConfirmDialog("möchtest du die Kirche wirklich löschen? Sie wird unwiederbringlich verloren gehen!", "Kirche löschen?").show()) {
                    await this._church.delete();
                    new Toast("Kirche wurde erfolgreich gelöscht").show();
                    this.finish();
                }
            }
        });
        this.findBy("#modify-church").addEventListener("click", async () => {
            if (UserManager.getInstance().hasAccess(Church.ACCESS_MODIFY)) {
                this.finishAndStartSite(ModifyChurchSite, {id: this._church.id});
            }
        });

        this.findBy("#view-calendar").addEventListener("click", () => {
            this.startSite(CalendarSite, {
                "filter": {"churches": [this._church.id]}
            });
        })

        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("church", ShowChurchSite);
});
