import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";
import {Church} from "./Church";
import {Event} from "./Event";
import {AccessEasySyncModel} from "cordova-sites-user-management/src/shared/v1/model/AccessEasySyncModel";

export class Region extends AccessEasySyncModel {

    constructor() {
        super();
        this.name = null;
        this.churches = null;
        this.events= null;
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
        let columns = super.getColumnDefinitions();
        columns["name"] = {type: BaseDatabase.TYPES.STRING};
        return columns;
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations["churches"] = {
            target: Church.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "churchRegion"
            },
            sync: false,
            // cascade: true
        };
        relations["events"] = {
            target: Event.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "eventRegion"
            },
            // inverseSide: "regions"
            // cascade: true
            sync: false,
        };
        return relations;
    }
}
Region.ACCESS_MODIFY = "admin";
Region.SCHEMA_NAME="Region";
BaseDatabase.addModel(Region);