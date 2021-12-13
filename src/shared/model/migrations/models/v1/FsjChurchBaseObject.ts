import { BaseDatabase } from 'cordova-sites-database';
import { AccessEasySyncModel } from 'cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel';
import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared/EasySyncBaseModel';

export class FsjChurchBaseObject extends AccessEasySyncModel {
    private names: any[];
    private descriptions: any[];
    private images: any[];
    private website: string;

    constructor() {
        super();
        this.names = [];
        this.descriptions = [];
        this.images = [];
        this.website = null;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns['names'] = BaseDatabase.TYPES.MY_JSON;
        columns['descriptions'] = BaseDatabase.TYPES.MY_JSON;
        columns['images'] = BaseDatabase.TYPES.MY_JSON;
        columns['website'] = BaseDatabase.TYPES.STRING;
        return columns;
    }

    getNameTranslation() {
        return (<typeof EasySyncBaseModel>this.constructor).getSchemaName() + '-name-' + this.id;
    }

    getDescriptionTranslation() {
        return (<typeof EasySyncBaseModel>this.constructor).getSchemaName() + '-description-' + this.id;
    }

    getDynamicTranslations() {
        let translations = {};
        Object.keys(this.names).forEach((language) => {
            translations[language] = translations[language] || {};
            translations[language][this.getNameTranslation()] = this.names[language];
        });

        Object.keys(this.descriptions).forEach((language) => {
            translations[language] = translations[language] || {};
            translations[language][this.getDescriptionTranslation()] = this.descriptions[language];
        });
        return translations;
    }
}
