import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared';
import { BaseDatabase } from 'cordova-sites-database';
import { Church } from './Church';
import { Event } from './Event';
import { AccessEasySyncModel } from 'cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel';

export class Region extends AccessEasySyncModel {
    private churches: Church[];
    private name: any;
    private events: any;

    constructor() {
        super();
        this.name = null;
        this.churches = null;
        this.events = null;
    }

    getName() {
        return this.name;
    }

    setName(value) {
        this.name = value;
    }

    setChurches(churches) {
        this.churches = churches;
    }

    getChurches() {
        return this.churches;
    }

    static getColumnDefinitions() {
        const columns = super.getColumnDefinitions();
        columns.name = { type: BaseDatabase.TYPES.STRING };
        return columns;
    }

    static getRelationDefinitions() {
        const relations = EasySyncBaseModel.getRelationDefinitions();
        relations.churches = {
            target: Church.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'churchRegion',
            },
            inverseSide: 'regions',
            sync: false,
            // cascade: true
        };
        relations.events = {
            target: Event.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'eventRegion',
            },
            inverseSide: 'regions',
            // cascade: true
            sync: false,
        };

        return relations;
    }
}
Region.ACCESS_MODIFY = 'events';
Region.SCHEMA_NAME = 'Region';
BaseDatabase.addModel(Region);
