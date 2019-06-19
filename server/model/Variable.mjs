import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";

export class Variable extends EasySyncBaseModel{

    constructor() {
        super();
        this.name = null;
        this.value = null;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["name"] = BaseDatabase.TYPES.STRING;
        columns["value"] = BaseDatabase.TYPES.TEXT;
        return columns;
    }
}
Variable.CAN_BE_SYNCED = false;

BaseDatabase.addModel(Variable);