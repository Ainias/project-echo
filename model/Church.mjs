import {EasySyncBaseModel} from "cordova-sites-easy-sync/model";
import {BaseDatabase} from "cordova-sites-database";

export class Church extends EasySyncBaseModel{

    constructor() {
        super();
        this.names = [];
        this.descriptions = [];
        this.places = [];
        this.images = [];
        this.website = null;
    }

    static getColumnDefinitions(){
        let columns = super.getColumnDefinitions();
        columns["names"] = {type: BaseDatabase.TYPES.JSON};
        columns["descriptions"] = {type: BaseDatabase.TYPES.JSON};
        columns["places"] = {type: BaseDatabase.TYPES.JSON};
        columns["images"] = {type: BaseDatabase.TYPES.JSON};
        columns["website"] = {type: BaseDatabase.TYPES.STRING};
        return columns;
    }
}
BaseDatabase.addModel(Church);