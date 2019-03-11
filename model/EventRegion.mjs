import {EasySync, EasySyncBaseModel} from "cordova-sites-easy-sync/model";

export class EventRegion extends EasySyncBaseModel{

    constructor() {
        super();
        this._churchId = null;
        this._regionId = null;
    }

    getChurchId() {
        return this._churchId;
    }

    setChurchId(value) {
        this._churchId = value;
    }

    getRegionId() {
        return this._regionId;
    }

    setRegionId(value) {
        this._regionId = value;
    }

    static getTableDefinition(){
        let definition = EasySyncBaseModel.getTableDefinition();
        definition["columns"].push(...[
            {key: "churchId", type: EasySync.TYPES.INTEGER},
            {key: "regionId", type: EasySync.TYPES.INTEGER},
        ]);
        return definition;
    }
}

EventRegion.modelName = "eventRegion";
EasySync.addModel(EventRegion);