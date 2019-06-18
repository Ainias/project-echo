import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";
import {Church} from "./Church";
import {Region} from "./Region";

export class Event extends EasySyncBaseModel {
    constructor() {
        super();
        this.names = null;
        this.descriptions = null;
        this.startTime = null;
        this.endTime = null;
        this.type = null;
        this.images = [];
        this.organisers = null;
        this.places = [];
        this.regions = null;
    }

    getNameTranslation() {
        return "event-name-" + this.id;
    }

    getDescriptionTranslation() {
        return "event-description-" + this.id;
    }

    getDynamicTranslations() {
        let translations = {};
        Object.keys(this.names).forEach(language => {
            translations[language] = translations[language] || {};
            translations[language][this.getNameTranslation()] = this.names[language];
        });

        Object.keys(this.descriptions).forEach(language => {
            translations[language] = translations[language] || {};
            translations[language][this.getDescriptionTranslation()] = this.descriptions[language];
        });
        return translations;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["names"] = BaseDatabase.TYPES.MY_JSON;
        columns["descriptions"] = BaseDatabase.TYPES.MY_JSON;
        columns["places"] = BaseDatabase.TYPES.MY_JSON;
        columns["images"] = BaseDatabase.TYPES.MY_JSON;
        columns["startTime"] = BaseDatabase.TYPES.DATE;
        columns["endTime"] = BaseDatabase.TYPES.DATE;
        columns["type"] = BaseDatabase.TYPES.STRING;
        return columns;
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations["organisers"] = {
            target: Church.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "churchEvent"
            },
        };
        relations["regions"] = {
            target: Region.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "eventRegion"
            },
            // inverseSide: "events",
            sync: true
        };
        return relations;
    }
}

Event.SCHEMA_NAME = "Event";
BaseDatabase.addModel(Event);

Event.TYPES = {
    GOTTESDIENST : "gottesdienst",
    KONZERT: "konzert"
};