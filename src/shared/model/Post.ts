import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared';
import { BaseDatabase } from 'cordova-sites-database';
import { AccessEasySyncModel } from 'cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel';
import { Region } from './Region';

export class Post extends AccessEasySyncModel {
    texts;
    priority;

    constructor() {
        super();
        this.texts = null;
        this.priority = 0;
    }

    getTextTranslation() {
        return `post-text-${  this.id}`;
    }

    getDynamicTranslations() {
        const translations = {};
        Object.keys(this.texts).forEach((language) => {
            translations[language] = translations[language] || {};
            translations[language][this.getTextTranslation()] = this.texts[language];
        });
        return translations;
    }

    static getColumnDefinitions() {
        const columns = super.getColumnDefinitions();
        columns.texts = BaseDatabase.TYPES.MY_JSON;
        columns.priority = BaseDatabase.TYPES.INTEGER;
        return columns;
    }

    static getRelationDefinitions() {
        const relations = EasySyncBaseModel.getRelationDefinitions();
        relations.regions = {
            target: Region.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'postRegion',
            },
            sync: true,
        };
        return relations;
    }
}
Post.ACCESS_MODIFY = 'posts';
Post.SCHEMA_NAME = 'Post';
BaseDatabase.addModel(Post);
