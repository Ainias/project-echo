import {BaseDatabase} from "cordova-sites-database";
import {AccessEasySyncModel} from "cordova-sites-user-management/src/shared/v1/model/AccessEasySyncModel";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/src/shared/EasySyncBaseModel";
import {Region} from "./Region";

export class Church extends AccessEasySyncModel {
    private names: any[];
    private descriptions: any[];
    private places: any[];
    private images: any[];
    private website: string;

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

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations["regions"] = {
            target: Region.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "churchRegion"
            },
            sync: true
        };
        return relations;
    }
}

Church.ACCESS_MODIFY = "admin";
Church.SCHEMA_NAME = "Church";
BaseDatabase.addModel(Church);