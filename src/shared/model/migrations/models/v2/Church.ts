import { BaseDatabase } from 'cordova-sites-database';
import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared/EasySyncBaseModel';
import { Region } from './Region';
import { FsjChurchBaseObject } from './FsjChurchBaseObject';
import { FileMedium } from 'cordova-sites-easy-sync/dist/shared';

export class Church extends FsjChurchBaseObject {
    public places: any[];

    constructor() {
        super();
        this.places = [];
    }

    static getColumnDefinitions() {
        const columns = super.getColumnDefinitions();
        columns.places = BaseDatabase.TYPES.MY_JSON;
        return columns;
    }

    // getNameTranslation() {
    //     return "church-name-" + this.id;
    // }
    //
    // getDescriptionTranslation() {
    //     return "church-description-" + this.id;
    // }
    //
    // getDynamicTranslations() {
    //     let translations = {};
    //     Object.keys(this.names).forEach(language => {
    //         translations[language] = translations[language] || {};
    //         translations[language][this.getNameTranslation()] = this.names[language];
    //     });
    //
    //     Object.keys(this.descriptions).forEach(language => {
    //         translations[language] = translations[language] || {};
    //         translations[language][this.getDescriptionTranslation()] = this.descriptions[language];
    //     });
    //     return translations;
    // }

    static getRelationDefinitions() {
        const relations = EasySyncBaseModel.getRelationDefinitions();
        relations.regions = {
            target: Region.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'churchRegion',
            },
            sync: true,
        };
        relations.images = {
            target: FileMedium.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'churchImages',
            },
            sync: true,
        };
        return relations;
    }
}

Church.ACCESS_MODIFY = 'admin';
Church.SCHEMA_NAME = 'Church';
