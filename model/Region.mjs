import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";
import {Church} from "./Church";
import {Event} from "./Event";

export class Region extends EasySyncBaseModel {

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
Region.SCHEMA_NAME="Region";
BaseDatabase.addModel(Region);