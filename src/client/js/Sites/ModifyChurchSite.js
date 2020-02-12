import {MenuFooterSite} from "./MenuFooterSite";
import view from "../../html/Sites/modifyChurchSite.html";
import {App, ConfirmDialog, Form, Helper, Toast, Translator} from "cordova-sites";
import {Church} from "../../../shared/model/Church";
import {UserSite} from "cordova-sites-user-management/src/client/js/Context/UserSite";
import {Region} from "../../../shared/model/Region";
import {Event} from "../../../shared/model/Event";
import {EventSite} from "./EventSite";
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import {CONSTANTS} from "../CONSTANTS";
import {PlaceHelper} from "../Helper/PlaceHelper";
import {ShowChurchSite} from "./ShowChurchSite";
import {UserManager} from "cordova-sites-user-management/src/client/js/UserManager";
import {AddEventSite} from "./AddEventSite";

export class ModifyChurchSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, "admin"));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        this._church = null;
        if (constructParameters["id"]) {
            this._church = await Church.findById(constructParameters["id"], Church.getRelations());
        }
        this._placeNumber = 0;

        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        this._placesContainer = this.findBy("#places-container");
        this._placesLineTemplate = this.findBy("#place-line-template");
        this._placesLineTemplate.removeAttribute("id");
        this._placesLineTemplate.remove();

        this._placePreview = this.findBy("#place-preview");

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

        this._form = new Form(this.findBy("#modify-church-form"), async values => {
            let names = {};
            let descriptions = {};
            let images = (!Helper.imageUrlIsEmpty(values["image"])?[values["image"]]: [values["image-before"]]);
            let places = {};
            let regions = [await Region.findById(1)];

            Object.keys(values).forEach(valName => {
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

            let church = null;
            if (this._church) {
                church = this._church
            } else {
                church = new Church();
            }
            church.names = names;
            church.descriptions = descriptions;
            church.images = images;
            church.places = places;
            church.website = values["website-url"];
            church.regions = regions;

            await church.save();

            this.finishAndStartSite(ShowChurchSite, {
                id: church.id
            });
        });

        this.findBy(".editor", true).forEach(async e => {
            this._form.addEditor(await CKEditor.create(e, CONSTANTS.CK_EDITOR_CONFIG));
        });

        this.findBy("#add-place").addEventListener("click", () => {
            this.addPlaceLine();
        });

        this.addPlaceLine();

        await this.setFormValuesFromChurch();

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

    async setFormValuesFromChurch() {
        if (Helper.isNull(this._church) || !this._church instanceof Church) {
            return;
        }

        let values = {};

        let names = this._church.names;
        Object.keys(names).forEach(lang => {
            values["name-" + lang] = names[lang];
        });

        let descriptions = this._church.descriptions;
        Object.keys(descriptions).forEach(lang => {
            values["description-" + lang] = descriptions[lang];
        });

        values["website-url"] = this._church.website;

        this.findBy("#event-image").src = this._church.images[0];
        this.findBy("input[type='hidden'][name='image-before']").value = this._church.images[0];
        this.findBy("input[type='file'][name='image']").removeAttribute("required");

        let places = this._church.places;
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

App.addInitialization((app) => {
    app.addDeepLink("modifyChurch", ModifyChurchSite);
});