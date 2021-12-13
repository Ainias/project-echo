import { BaseDatabase } from 'cordova-sites-database';
import { FsjChurchBaseObject } from './FsjChurchBaseObject';
import { FileMedium, EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared';

export class Fsj extends FsjChurchBaseObject {
    constructor() {
        super();
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations['images'] = {
            target: FileMedium.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'fsjImages',
            },
            sync: true,
        };
        return relations;
    }
}

Fsj.ACCESS_MODIFY = 'fsjs';
Fsj.SCHEMA_NAME = 'Fsj';
BaseDatabase.addModel(Fsj);
