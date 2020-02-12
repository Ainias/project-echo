import {MenuFooterSite} from "./MenuFooterSite";
import view from "../../html/Sites/addEventSite.html";
import {App, Form, Translator, Helper, Toast} from "cordova-sites";
import {Church} from "../../../shared/model/Church";
import {Event} from "../../../shared/model/Event";
import {Region} from "../../../shared/model/Region";
import {EventSite} from "./EventSite";
import flatpickr from "flatpickr";
import {UserSite} from "cordova-sites-user-management/src/client/js/Context/UserSite";
import {PlaceHelper} from "../Helper/PlaceHelper";
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import {CONSTANTS} from "../CONSTANTS";
import {RepeatedEvent} from "../../../shared/model/RepeatedEvent";
import {German} from "flatpickr/dist/l10n/de";
import {DateHelper} from "js-helper/dist/shared/DateHelper";
import {EventHelper} from "../Helper/EventHelper";
import {BlockedDay} from "../../../shared/model/BlockedDay";
import {CalendarSite} from "./CalendarSite";

export class AddEventSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, "admin"));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this._churches = await Church.find();

        if (constructParameters["id"]) {

            if (constructParameters["isRepeatableEvent"]) {
                this._event = await RepeatedEvent.findById(constructParameters["id"], RepeatedEvent.getRelations());
            } else {
                let id = constructParameters["id"];
                if (typeof id === "string" && id.startsWith("r")) {
                    let parts = id.split("-");
                    if (parts.length === 4) {
                        let repeatedEvent = await RepeatedEvent.findById(parts[0].substr(1), RepeatedEvent.getRelations());

                        this._blockedDay = new Date(parts[1], parts[2] - 1, parts[3]);
                        this._event = await EventHelper.generateSingleEventFromRepeatedEvent(repeatedEvent, this._blockedDay);
                        this._event.id = null;
                    }
                } else {
                    this._event = await Event.findById(id, Event.getRelations());
                }
            }
        }

        this._placeNumber = 0;
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let organizerCheckbox = this.findBy(".organizer-template");
        let organizerContainer = organizerCheckbox.parentElement;

        organizerCheckbox.remove();
        organizerCheckbox.classList.remove("organizer-template");

        this._placesContainer = this.findBy("#places-container");
        this._placesLineTemplate = this.findBy("#place-line-template");
        this._placesLineTemplate.removeAttribute("id");
        this._placesLineTemplate.remove();

        this._placePreview = this.findBy("#place-preview");

        this._churches.forEach(church => {
            Translator.addDynamicTranslations(church.getDynamicTranslations());

            let elem = organizerCheckbox.cloneNode(true);
            elem.querySelector(".organizer-checkbox").name = "church-" + church.id;
            elem.querySelector(".organizer-checkbox").value = church.id;
            elem.querySelector(".church-name").appendChild(Translator.makePersistentTranslation(church.getNameTranslation()));

            organizerContainer.appendChild(elem);
        });

        let imageInput = this.findBy("#event-image-input");
        imageInput.addEventListener("change", () => {
            if (imageInput.files && imageInput.files[0]) {
                let reader = new FileReader();
                reader.onload = e => {
                    this.findBy("#event-image").src = e.target.result;
                };
                reader.readAsDataURL(imageInput.files[0]);
            }
        });

        let typeSelect = this.findBy("[name=type]");
        Object.values(Event.TYPES).forEach(type => {
            let optionElem = Translator.makePersistentTranslation(type, undefined, "option");
            optionElem.value = type;
            typeSelect.appendChild(optionElem);
        });

        this._form = new Form(this.findBy("#add-event-form"), async values => {
            this.showLoadingSymbol()
            let names = {};
            let descriptions = {};
            let organizers = [];
            let images = [values["image"]];

            if (Helper.imageUrlIsEmpty(values["image"])) {
                images = [values["image-before"]];
            }

            let places = {};
            let regions = [await Region.findById(1)];

            let indexedChurches = Helper.arrayToObject(this._churches, church => church.id);

            Object.keys(values).forEach(valName => {
                if (valName.startsWith("church-")) {
                    organizers.push(indexedChurches[parseInt(values[valName])]);
                }
                if (valName.startsWith("name-")) {
                    names[valName.split("-")[1]] = values[valName];
                }
                if (valName.startsWith("description-")) {
                    descriptions[valName.split("-")[1]] = values[valName];
                }
                if (valName.startsWith("place-name-")) {
                    let val = values["place-query-" + valName.substring(11)];
                    if (val.trim() === "") {
                        val = values[valName];
                    }
                    places[values[valName]] = val;
                }
            });

            let event = null;
            if (this._event) {
                if (this._event instanceof RepeatedEvent) {
                    event = this._event.originalEvent;
                } else {
                    event = this._event;
                }

            } else {
                event = new Event();
            }

            event.setNames(names);
            event.setDescriptions(descriptions);
            event.setOrganisers(organizers);
            event.setImages(images);
            event.setPlaces(places);
            event.setStartTime(new Date(values["start"]));
            event.setEndTime(new Date(values["end"]));
            event.setType(values["type"]);
            event.setRegions(regions);

            let eventId = event.id;
            let savePromise = event.save();
            if (Helper.isNotNull(event.repeatedEvent) && eventId === null) {
                let blockedDay = new BlockedDay();
                blockedDay.day = this._blockedDay;
                blockedDay.day.setHours(12);
                blockedDay.repeatedEvent = event.repeatedEvent;
                blockedDay.event = event;
                event.repeatedEvent.blockedDays.push(blockedDay);
                await savePromise;
                await blockedDay.save();
            }
            await savePromise;
            eventId = event.id;

            if (values["repeatable"]) {
                let repeatedEvent = null;
                if (this._event instanceof RepeatedEvent) {
                    repeatedEvent = this._event;
                } else {
                    repeatedEvent = new RepeatedEvent();
                    this._event = repeatedEvent;
                }

                repeatedEvent.startDate = new Date(values["start"]);

                repeatedEvent.originalEvent = event;
                event.repeatedEvent = repeatedEvent;
                event.setIsTemplate(true);

                let repeatUntil = new Date(values["repeat-until"]);
                if (isNaN(repeatUntil.getTime())) {
                    repeatedEvent.repeatUntil = null;
                } else {
                    repeatedEvent.repeatUntil = repeatUntil;
                }

                let repeatedDays = [];
                let days = [1, 2, 3, 4, 5, 6, 0];

                days.forEach(day => {
                    if (values["repeat-" + day]) {
                        repeatedDays.push(values["repeat-" + day]);
                    }
                });

                repeatedEvent.repeatingArguments = repeatedDays.join(",");
                await repeatedEvent.save();
                await event.save()
            }

            if (this._event instanceof RepeatedEvent) {
                this.finishAndStartSite(CalendarSite);
            } else {
                this.finishAndStartSite(EventSite, {
                    id: event.id
                });
            }
            this.showLoadingSymbol();
        });

        this._form.addValidator(values => {

            console.log(values);
            // return {
            //     "error": "the endpoint must be after the start"
            // };
            let errors = {};
            if (values["start"].trim() === ""){
                errors["error1"] = "required"
            }
            if (values["end"].trim() === ""){
                errors["error2"] = "reqired";
            }
            if (Object.keys(errors).length > 0){
                return errors;
            }

            if (new Date(values["start"]).getTime() > new Date(values["end"]).getTime()) {
                new Toast("the endpoint must be after the start").show();
                return {
                    "end": "the endpoint must be after the start"
                }
            }
            return true;
        });

        this.findBy(".editor", true).forEach(async e => {
            this._form.addEditor(await CKEditor.create(e, CONSTANTS.CK_EDITOR_CONFIG));
        });

        this.findBy("#add-place").addEventListener("click", () => {
            this.addPlaceLine();
        });

        this.addPlaceLine();

        this._repeatableSectionElement = this.findBy("#repeatable-section");

        this._repeatableCheckbox = this.findBy("#repeatable-checkbox");
        this._repeatableCheckbox.addEventListener("change", () => {
            if (this._repeatableCheckbox.checked) {
                this._repeatableSectionElement.classList.remove("hidden");
            } else {
                this._repeatableSectionElement.classList.add("hidden");
            }
        });

        await this.setFormValuesFromEvent();

        flatpickr(this.findBy(".date-time", true), {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            time_24hr: true,
            locale: German
        });

        return res;
    }

    addPlaceLine() {
        this._placeNumber++;
        let newLine = this._placesLineTemplate.cloneNode(true);

        let placeNameElem = newLine.querySelector(".place-name");
        placeNameElem.name = "place-name-" + this._placeNumber;

        let placeQueryElem = newLine.querySelector(".place-query");
        placeQueryElem.name = "place-query-" + this._placeNumber;

        placeNameElem.addEventListener("keyup", e => {
            placeQueryElem.placeholder = placeNameElem.value;
            updatePreview();
        });

        placeNameElem.addEventListener("change", e => {
            placeQueryElem.placeholder = placeNameElem.value;
            updatePreview();
        });


        let updateTimeout = null;
        let updatePreview = () => {

            if (updateTimeout !== null) {
                clearTimeout(updateTimeout);
            }
            updateTimeout = setTimeout(() => {

                let newSrc = PlaceHelper._buildMapsLink(placeQueryElem.value || placeQueryElem.placeholder);
                if (this._placePreview.src !== newSrc) {
                    this._placePreview.src = newSrc;
                }
            }, 200);
        };
        placeNameElem.addEventListener("focus", updatePreview);
        placeQueryElem.addEventListener("focus", updatePreview);
        placeQueryElem.addEventListener("change", updatePreview);
        placeQueryElem.addEventListener("keyup", updatePreview);

        newLine.querySelector(".remove-place").addEventListener("click", () => {
            newLine.remove();
        });

        this._placesContainer.appendChild(newLine);
        requestAnimationFrame(() => {
            placeNameElem.focus();
        });

        Translator.getInstance().updateTranslations(newLine);
    }

    async setFormValuesFromEvent() {
        if (this._event instanceof Event || this._event instanceof RepeatedEvent) {

            let values = {};

            let names = this._event.getNames();
            Object.keys(names).forEach(lang => {
                values["name-" + lang] = names[lang];
            });

            let descriptions = this._event.getDescriptions();
            Object.keys(descriptions).forEach(lang => {
                values["description-" + lang] = descriptions[lang];
            });
            values["type"] = this._event.getType();
            values["start"] = DateHelper.strftime("%Y-%m-%d %H:%M", this._event.getStartTime());
            values["end"] = DateHelper.strftime("%Y-%m-%d %H:%M", this._event.getEndTime());

            let organisers = this._event.getOrganisers();
            if (Helper.isNotNull(organisers)) {
                organisers.forEach(church => {
                    values["church-" + church.id] = church.id;
                });
            }

            this.findBy("#event-image").src = this._event.getImages()[0];
            this.findBy("input[type='hidden'][name='image-before']").value = this._event.getImages()[0];
            this.findBy("input[type='file'][name='image']").removeAttribute("required");

            let places = this._event.getPlaces();
            if (Array.isArray(places)) {
                places = Helper.arrayToObject(places, place => place);
            }
            Object.keys(places).forEach((placeName, i) => {
                if (i > 0) {
                    this.addPlaceLine();
                }

                values["place-name-" + (i + 1)] = placeName;
                if (placeName !== places[placeName]) {
                    values["place-query-" + (i + 1)] = places[placeName];
                } else {
                    let queryElem = this.findBy("[name='place-query-" + (i + 1) + "']");
                    queryElem.placeholder = placeName;
                    delete queryElem.removeAttribute("data-translation-placeholder");
                }
            });

            if (this._event instanceof RepeatedEvent) {
                this._repeatableCheckbox.checked = true;
                this._repeatableCheckbox.setAttribute("readonly", true);
                this._repeatableCheckbox.setAttribute("disabled", true);
                this._repeatableSectionElement.classList.remove("hidden");

                if (Helper.isNotNull(this._event.repeatUntil)) {
                    values["repeat-until"] = DateHelper.strftime("%Y-%m-%d %H:%M", this._event.repeatUntil)
                }

                let repeatingArguments = this._event.repeatingArguments.split(",");
                repeatingArguments.forEach(weekday => {
                    values["repeat-" + weekday] = weekday;
                });
            } else if (this._event.repeatedEvent) {
                this._repeatableCheckbox.setAttribute("readonly", true);
                this._repeatableCheckbox.setAttribute("disabled", true);
            }

            await this._form.setValues(values);
        }
    }
}

App.addInitialization((app) => {
    app.addDeepLink("addEvent", AddEventSite);
});