import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";

export class Church extends EasySyncBaseModel {

    constructor() {
        super();
        this.names = [];
        this.descriptions = [];
        this.places = [];
        this.images = [];
        this.website = null;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["names"] = BaseDatabase.TYPES.MY_JSON;
        columns["descriptions"] = BaseDatabase.TYPES.MY_JSON;
        columns["places"] = BaseDatabase.TYPES.MY_JSON;
        columns["images"] = BaseDatabase.TYPES.MY_JSON;
        columns["website"] = BaseDatabase.TYPES.STRING;
        return columns;
    }

    getNameTranslation() {
        return "church-name-" + this.id;
    }

    getDescriptionTranslation() {
        return "church-description-" + this.id;
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
}

Church.SCHEMA_NAME = "Church";
BaseDatabase.addModel(Church);