import {FooterSite} from "./FooterSite";
import {App, ConfirmDialog, DataManager, Helper, Toast, Translator} from "cordova-sites";
import {Event} from "../../../model/Event";

import view from "../../html/Sites/eventSite.html";
import {Favorite} from "../Model/Favorite";
import {PlaceHelper} from "../Helper/PlaceHelper";
import {UserManager} from "cordova-sites-user-management/client";
import {AddEventSite} from "./AddEventSite";

export class EventSite extends FooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._footerFragment.setSelected(".icon.calendar");
    }

    async onConstruct(constructParameters) {

        let res = super.onConstruct(constructParameters);
        if (!Helper.isSet(constructParameters, "id")) {
            new Toast("no id given").show();
            this.finish();
            return;
        }

        this._event = await Event.findById(constructParameters["id"], Event.getRelations());
        if (!this._event) {
            new Toast("no event found").show();
            this.finish();
            return;
        }
        this._isFavortite = (await Favorite.findOne({eventId: this._event.id}) !== null);

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(this._event.getDynamicTranslations());

        this.findBy("#event-name").appendChild(translator.makePersistentTranslation(this._event.getNameTranslation()));
        this.findBy("#event-description").appendChild(translator.makePersistentTranslation(this._event.getDescriptionTranslation()));
        if (this._event.images.length > 0) {
            this.findBy("#event-img").src = this._event.images[0];
        }

        //time
        let timeElement = this.findBy("#event-time");
        if (this._event.startTime.getFullYear() === this._event.endTime.getFullYear()) {
            if (this._event.startTime.getMonth() === this._event.endTime.getMonth() && this._event.startTime.getDate() === this._event.endTime.getDate()) {
                if (this._event.startTime.getHours() === this._event.endTime.getHours() && this._event.startTime.getMinutes() === this._event.endTime.getMinutes()) {
                    timeElement.innerHTML = Helper.strftime("%d. %B ´%y %H.%M ", this._event.startTime) + translator.makePersistentTranslation("uhr").outerHTML;
                } else {
                    timeElement.innerHTML =
                        Helper.strftime("%d. %B ´%y<br/>%H.%M", this._event.startTime) + " - " + Helper.strftime("%H.%M", this._event.endTime);
                }
            } else {
                timeElement.innerHTML =
                    Helper.strftime("%d. %b ´%y %H.%M", this._event.startTime) + " -<br/>" + Helper.strftime("%d. %b ´%y %H.%M", this._event.endTime);
            }
        } else {
            timeElement.innerHTML =
                Helper.strftime("%d. %b ´%y %H.%M", this._event.startTime) + " -<br/>" + Helper.strftime("%d. %b ´%y %H.%M", this._event.endTime);
        }

        //places
        let placesContainer = this.findBy("#places-container");

        let places = this._event.places;
        let placesAreObject = false;

        if (!Array.isArray(places)) {
            places = Object.keys(places);
            placesAreObject = true;
        }

        await Helper.asyncForEach(places, async place => {
            placesContainer.appendChild(await PlaceHelper.createPlace(place, (placesAreObject) ? this._event.places[place] : place));
        });

        //favorite
        let favElem = this.findBy("#favorite .favorite");
        if (this._isFavortite) {
            favElem.classList.add("is-favorite");
        }

        favElem.addEventListener("click", async (e) => {
            e.stopPropagation();

            let isFavorite = await Favorite.toggle(this._event.id);
            if (isFavorite) {
                favElem.classList.add("is-favorite");
            } else {
                favElem.classList.remove("is-favorite");
            }
            this._isFavortite = isFavorite;
        });

        let tagPanel = this.findBy("#tag-panel");

        let typeTag = document.createElement("span");
        typeTag.classList.add("tag");
        typeTag.appendChild(Translator.makePersistentTranslation(this._event.type));
        tagPanel.addEventListener("click", () => {
            alert("to be implemented!");
        });
        tagPanel.appendChild(typeTag);

        this._event.organisers.forEach(church => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

           let churchTag = document.createElement("span");
           churchTag.classList.add("tag");
           churchTag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
           churchTag.addEventListener("click", () => {
               alert("to be implemented!");
           });

           tagPanel.appendChild(churchTag);
        });

        this._checkRightsPanel();
        return res;
    }

    _checkRightsPanel() {
        UserManager.getInstance().addLoginChangeCallback((loggedIn, manager) => {
            if (loggedIn && manager.hasAccess(Event.ACCESS_MODIFY)) {
                this.findBy(".admin-panel").classList.remove("hidden");
            } else {
                this.findBy(".admin-panel").classList.add("hidden");
            }
        }, true);

        this.findBy("#delete-event").addEventListener("click", async () => {
            if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                if (await new ConfirmDialog("möchtest du das Event wirklich löschen? Es wird unwiederbringlich verloren gehen!", "Event löschen?").show()) {
                    await this._event.delete();
                    new Toast("event wurde erfolgreich gelscht").show();
                    this.finish();
                }
            }
        });
        this.findBy("#modify-event").addEventListener("click", async () => {
            if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {
                this.finishAndStartSite(AddEventSite, {id: this._event.id});
            }
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink("event", EventSite);
});