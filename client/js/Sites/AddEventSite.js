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

//TODO userManagement hinzufügen
export class AddEventSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, "admin"));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this._churches = await Church.find();

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

        flatpickr(this.findBy(".date-time", true), {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            time_24hr: true
        });

        let imageInput = this.findBy("#event-image-input");
        imageInput.addEventListener("change", () => {
            if (imageInput.files && imageInput.files[0]){
                let reader = new FileReader();
                reader.onload = e => {
                    this.findBy("#event-image").src = e.target.result;
                };
                reader.readAsDataURL(imageInput.files[0]);
            }
        });

        this._form = new Form(this.findBy("#add-event-form"), async values => {
            let names = {};
            let descriptions = {};
            let organizers = [];
            let images = [values["image"]];
            let places = {};
            let regions = [await Region.findById(1)];

            let indexedChurches = Helper.arrayToObject(this._churches, church => church.id);
            console.log(values);

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
                if (valName.startsWith("place-name-")){
                    let val = values["place-query-"+valName.substring(11)];
                    if (val.trim() === ""){
                        val = values[valName];
                    }
                    places[values[valName]] = val;
                }
            });

            let event = new Event();
            event.names = names;
            event.descriptions = descriptions;
            event.organisers = organizers;
            event.images = images;
            event.places = places;
            event.startTime = new Date(values["start"]);
            event.endTime = new Date(values["end"]);
            event.type = values["type"];
            event.regions = regions;

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

        this.findBy("#add-place").addEventListener("click", () => {
            this.addPlaceLine();
        });

        this.addPlaceLine();
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
}

App.addInitialization((app) => {
    app.addDeepLink("addEvent", AddEventSite);
});