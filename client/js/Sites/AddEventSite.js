import {MenuFooterSite} from "./MenuFooterSite";
import view from "../../html/Sites/addEventSite.html";
import {App, Form, Translator, Helper, Toast} from "cordova-sites";
import {Church} from "../../../model/Church";
import {Event} from "../../../model/Event";
import {Region} from "../../../model/Region";
import {EventSite} from "./EventSite";
import flatpickr from "flatpickr";
import {UserSite} from "cordova-sites-user-management/src/client/js/Context/UserSite";
import {PlaceHelper} from "../Helper/PlaceHelper";
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import {CONSTANTS} from "../CONSTANTS";
import {RepeatedEvent} from "../../../model/RepeatedEvent";
import {German} from "flatpickr/dist/l10n/de";

//TODO userManagement hinzufügen
export class AddEventSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, "admin"));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this._churches = await Church.find();

        this._isRepeatable = false;

        if (constructParameters["id"]) {

            if (constructParameters["isRepeatableEvent"]) {
                this._event = await RepeatedEvent.findById(constructParameters["id"], RepeatedEvent.getRelations());
                this._isRepeatable = true;
            } else {
                this._event = await Event.findById(constructParameters["id"], Event.getRelations());
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
                event = this._event
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

            await event.save();

            this.finishAndStartSite(EventSite, {
                id: event.id
            });
        });


        this._form.addValidator(values => {
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
        if (this._event instanceof Event) {

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
            values["start"] = Helper.strftime("%Y-%m-%d %H:%M", this._event.getStartTime());
            values["end"] = Helper.strftime("%Y-%m-%d %H:%M", this._event.getEndTime());

            this._event.getOrganisers().forEach(church => {
                values["church-" + church.id] = church.id;
            });

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

            await this._form.setValues(values);
        }
    }
}

App.addInitialization((app) => {
    app.addDeepLink("addEvent", AddEventSite);
});