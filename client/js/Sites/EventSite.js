import {FooterSite} from "./FooterSite";
import {Helper, Toast, Translator} from "cordova-sites";
import {Event} from "../../../model/Event";

import view from "../../html/Sites/calendarSite.html";

export class EventSite extends FooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._footerFragment.setSelected(".icon.calendar");
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        if (!Helper.isSet(constructParameters, "id")){
            new Toast("no id given").show();
            this.finish();
        }

        this._event = await Event.findById(constructParameters[id]);
        if (!event){
            new Toast("no event found").show();
            this.finish();
        }
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(event.getDynamicTranslations());

        this.findBy("#event-name").appendChild(translator.makePersistentTranslation(this._event.getNameTranslation()));
        this.findBy("#event-description").appendChild(translator.makePersistentTranslation(this._event.getDescriptionTranslation()));

        return res;
    }
}