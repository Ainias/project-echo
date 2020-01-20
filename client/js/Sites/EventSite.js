import {FooterSite} from "./FooterSite";
import {App, ButtonChooseDialog, ConfirmDialog, Toast, Translator} from "cordova-sites";
import {Event} from "../../../model/Event";

import view from "../../html/Sites/eventSite.html";
import {Favorite} from "../Model/Favorite";
import {PlaceHelper} from "../Helper/PlaceHelper";
import {UserManager} from "cordova-sites-user-management/client";
import {AddEventSite} from "./AddEventSite";
import {EventHelper} from "../Helper/EventHelper";
import {SearchSite} from "./SearchSite";
import {Helper} from "js-helper";
import {DateHelper} from "js-helper/dist/shared/DateHelper";
import {RepeatedEvent} from "../../../model/RepeatedEvent";
import {BlockedDay} from "../../../model/BlockedDay";

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

        let id = constructParameters["id"];

        if (typeof id === "string" && id.startsWith("r")) {
            let parts = id.split("-");

            if (parts.length === 4) {

                console.log(parts);
                let repeatedEvent = await RepeatedEvent.findById(parts[0].substr(1), RepeatedEvent.getRelations());

                this._event = await EventHelper.generateSingleEventFromRepeatedEvent(repeatedEvent, new Date(parts[1], parts[2] - 1, parts[3]))
            }
        } else {
            this._event = await Event.findById(constructParameters["id"], Event.getRelations());
        }

        if (!this._event) {
            new Toast("no event found").show();
            this.finish();
            return;
        }
        this._isFavortite = (await Favorite.findOne({eventId: this._event.getId(), isFavorite: true}) !== null);

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(this._event.getDynamicTranslations());

        this.findBy("#event-name").appendChild(translator.makePersistentTranslation(this._event.getNameTranslation()));
        this.findBy("#event-description").appendChild(translator.makePersistentTranslation(this._event.getDescriptionTranslation()));
        if (this._event.getImages().length > 0) {
            this.findBy("#event-img").src = this._event.getImages()[0];
        }

        //time
        let timeElement = this.findBy("#event-time");
        if (this._event.getStartTime().getFullYear() === this._event.getEndTime().getFullYear()) {
            if (this._event.getStartTime().getMonth() === this._event.getEndTime().getMonth() && this._event.getStartTime().getDate() === this._event.getEndTime().getDate()) {
                if (this._event.getStartTime().getHours() === this._event.getEndTime().getHours() && this._event.getStartTime().getMinutes() === this._event.getEndTime().getMinutes()) {
                    timeElement.innerHTML = DateHelper.strftime("%d. %B ´%y, %H:%M ", this._event.getStartTime()) + translator.makePersistentTranslation("uhr").outerHTML;
                } else {
                    timeElement.innerHTML =
                        DateHelper.strftime("%d. %B ´%y<br/>%H:%M", this._event.getStartTime()) + " - " + DateHelper.strftime("%H:%M", this._event.getEndTime());
                }
            } else {
                timeElement.innerHTML =
                    DateHelper.strftime("%d. %b ´%y, %H:%M", this._event.getStartTime()) + " -<br/>" + DateHelper.strftime("%d. %b ´%y, %H:%M", this._event.getEndTime());
            }
        } else {
            timeElement.innerHTML =
                DateHelper.strftime("%d. %b ´%y, %H:%M", this._event.getStartTime()) + " -<br/>" + DateHelper.strftime("%d. %b ´%y, %H:%M", this._event.getEndTime());
        }

        //places
        let placesContainer = this.findBy("#places-container");

        let places = this._event.getPlaces();
        let placesAreObject = false;

        if (!Array.isArray(places)) {
            places = Object.keys(places);
            placesAreObject = true;
        }

        await Helper.asyncForEach(places, async place => {
            placesContainer.appendChild(await PlaceHelper.createPlace(place, (placesAreObject) ? this._event.getPlaces()[place] : place));
        });

        //favorite
        let favElem = this.findBy("#favorite .favorite");
        if (this._isFavortite) {
            favElem.classList.add("is-favorite");
        }

        favElem.addEventListener("click", async (e) => {
            e.stopPropagation();

            let isFavorite = await EventHelper.toggleFavorite(this._event);
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
        typeTag.appendChild(Translator.makePersistentTranslation(this._event.getType()));
        tagPanel.addEventListener("click", () => {
            this.startSite(SearchSite, {"types": this._event.getType()});
        });
        tagPanel.appendChild(typeTag);

        let organisers = this._event.getOrganisers();
        if (Array.isArray(organisers)) {
            organisers.forEach(church => {
                Translator.addDynamicTranslations(church.getDynamicTranslations());

                let churchTag = document.createElement("span");
                churchTag.classList.add("tag");
                churchTag.appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));
                churchTag.addEventListener("click", () => {
                    this.startSite(SearchSite, {"churches": church.id + ""});
                });

                tagPanel.appendChild(churchTag);
            });
        }

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

                if (Helper.isNotNull(this._event.repeatedEvent)) {
                    let editSeries = await new ButtonChooseDialog("", "delete event or event series", {
                        "0": "event",
                        "1": "series",
                        "2": "abort",
                    }).show();
                    if (editSeries === "1") {
                        this.showLoadingSymbol();
                        this._event.repeatedEvent.delete();
                        new Toast("eventserie wurde erfolgreich gelöscht").show();
                        this.finish();
                        this.removeLoadingSymbol();
                    } else if (editSeries === "0") {
                        this.showLoadingSymbol();
                        if (this._event.id.startsWith("r")) {
                            let blockedDay = new BlockedDay();
                            blockedDay.day = this._event.startTime;
                            blockedDay.day.setHours(12);
                            blockedDay.repeatedEvent = this._event.repeatedEvent;
                            this._event.repeatedEvent.blockedDays.push(blockedDay);
                            await blockedDay.save();
                            new Toast("event wurde erfolgreich gelöscht").show();
                            this.finish();
                        } else {
                            this._event.delete();
                            new Toast("event wurde erfolgreich gelöscht").show();
                            this.finish();
                        }
                        this.removeLoadingSymbol();
                    }
                } else if (await new ConfirmDialog("möchtest du das Event wirklich löschen? Es wird unwiederbringlich verloren gehen!", "Event löschen?").show()) {
                    this.showLoadingSymbol();
                    await this._event.delete();
                    new Toast("event wurde erfolgreich gelöscht").show();
                    this.finish();
                    this.removeLoadingSymbol();
                }
            }
        });
        this.findBy("#modify-event").addEventListener("click", async () => {
            if (UserManager.getInstance().hasAccess(Event.ACCESS_MODIFY)) {

                if (Helper.isNotNull(this._event.repeatedEvent)) {
                    let editSeries = await new ButtonChooseDialog("", "edit event or event series", {
                        "1": "event",
                        "2": "series"
                    }).show();

                    if (editSeries === "2") {
                        this.finishAndStartSite(AddEventSite, {
                            id: this._event.repeatedEvent.id,
                            isRepeatableEvent: true
                        });
                    } else if (editSeries === "1") {
                        this.finishAndStartSite(AddEventSite, {id: this._event.getId()});
                    }

                } else {
                    this.finishAndStartSite(AddEventSite, {id: this._event.getId()});
                }
            }
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink("event", EventSite);
});