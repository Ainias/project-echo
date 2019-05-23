import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";
import {Church} from "./Church";

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
        columns["names"] = BaseDatabase.TYPES.JSON;
        columns["descriptions"] = BaseDatabase.TYPES.JSON;
        columns["places"] = BaseDatabase.TYPES.JSON;
        columns["images"] = BaseDatabase.TYPES.JSON;
        columns["startTime"] = BaseDatabase.TYPES.DATE;
        columns["endTime"] = BaseDatabase.TYPES.DATE;
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
            // cascade: true
        };
        // relations["events"] = {
        //     target: Church.getSchemaName(),
        //     type: "many-to-many",
        //     joinTable: {
        //         name: "eventRegion"
        //     },
        //     cascade: true
        // };
        return relations;
    }

    // static getTableDefinition() {
    //     let definition = EasySyncBaseModel.getTableDefinition();
    //     definition["columns"].push(...[
    //         {key: "name", type: BaseDatabase.TYPES.STRING},
    //         {key: "startTime", type: BaseDatabase.TYPES.DATE},
    //         {key: "endTime", type: BaseDatabase.TYPES.DATE},
    //         {key: "places", type: BaseDatabase.TYPES.SIMPLE_JSON},
    //         {key: "organiser", type: BaseDatabase.TYPES.STRING},
    //         {key: "description", type: BaseDatabase.TYPES.STRING},
    //     ]);
    //     return definition;
    // }
}

Event.SCHEMA_NAME = "Event";
BaseDatabase.addModel(Event);