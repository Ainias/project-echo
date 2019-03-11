import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";
import {Church} from "./Church";

export class Region extends EasySyncBaseModel {

    constructor() {
        super();
        this.name = null;
        this.churches = null;
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
            cascade: true
        };
        return relations;
    }
}
BaseDatabase.addModel(Region);