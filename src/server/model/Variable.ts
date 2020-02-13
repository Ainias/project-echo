import {EasySyncBaseModel} from "cordova-sites-easy-sync/dist/shared";
import {BaseDatabase} from "cordova-sites-database";

export class Variable extends EasySyncBaseModel{
    private value: null;
    private name;

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