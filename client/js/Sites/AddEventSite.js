import {MenuFooterSite} from "./MenuFooterSite";
import view from "../../html/Sites/addEventSite.html";
import {App, Form, Translator, Helper, Toast} from "cordova-sites";
import {Church} from "../../../model/Church";
import {Event} from "../../../model/Event";
import {Region} from "../../../model/Region";
import {EventSite} from "./EventSite";
import flatpickr from "flatpickr";
import {UserSite} from "cordova-sites-user-management/src/client/js/Context/UserSite";

//TODO userManagement hinzufügen
export class AddEventSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.addDelegate(new UserSite(this, "admin"));
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this._churches = await Church.find();
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let organizerCheckbox = this.findBy(".organizer-template");
        let organizerContainer = organizerCheckbox.parentElement;

        organizerCheckbox.remove();
        organizerCheckbox.classList.remove("organizer-template");

        console.log("churches", this._churches);

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

        this._form = new Form(this.findBy("#add-event-form"), async values => {
            let names = {};
            let descriptions = {};
            let organizers = [];
            let images = ["https://upload.wikimedia.org/wikipedia/commons/3/36/Stadtpfarrkirche_Sankt_Peter.jpg"];
            let places = values["places"].split("\n");
            console.log(places);
            let regions = [await Region.findById(1)];

            let indexedChurches = Helper.arrayToObject(this._churches, church => church.id);

            Object.keys(values).forEach(valName => {
                if (valName.startsWith("church-")) {
                    organizers.push(indexedChurches[parseInt(values[valName])]);
                }
                if (valName.startsWith("name-")){
                    names[valName.split("-")[1]] = values[valName];
                }
                if (valName.startsWith("description-")){
                    descriptions[valName.split("-")[1]] = values[valName];
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
            if (new Date(values["start"]).getTime() > new Date(values["end"]).getTime()){
                new Toast("the endpoint must be after the start").show();
                return {
                    "end": "the endpoint must be after the start"
                }
            }
            return true;
        });
        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("addEvent", AddEventSite);
});