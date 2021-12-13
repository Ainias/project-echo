import { BaseDatabase } from 'cordova-sites-database';
import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared/EasySyncBaseModel';
import { Region } from './Region';
import { FsjChurchBaseObject } from './FsjChurchBaseObject';
import { FileMedium } from 'cordova-sites-easy-sync/dist/shared';

export class Church extends FsjChurchBaseObject {
    public places: any[];
    private instagram: string;

    constructor() {
        super();
        this.places = [];
        this.instagram = '';
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns['places'] = BaseDatabase.TYPES.MY_JSON;
        columns['instagram'] = { type: BaseDatabase.TYPES.STRING, nullable: true };
        return columns;
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations['regions'] = {
            target: Region.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'churchRegion',
            },
            sync: true,
        };
        relations['images'] = {
            target: FileMedium.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'churchImages',
            },
            sync: true,
        };
        return relations;
    }

    getInstagram() {
        return this.instagram;
    }
    setInstagram(instagram: string) {
        this.instagram = instagram;
    }
}

Church.ACCESS_MODIFY = 'organisers';
Church.SCHEMA_NAME = 'Church';
BaseDatabase.addModel(Church);
