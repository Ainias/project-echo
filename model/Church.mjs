import {EasySync, EasySyncBaseModel} from "cordova-sites-easy-sync/model";

export class Church extends EasySyncBaseModel{

    constructor() {
        super();
        this._names = null;
        this._descirptions = null;
        this._places = [];
        this._images = [];
        this._website = null;
    }

    setNames(name){
        this._names = name;
    }

    getNames(){
        return this._names;
    }

    setDescriptions(description){
        this._descirptions = description;
    }

    getDescriptions(){
        return this._descirptions;
    }

    getPlaces() {
        return this._places;
    }

    setPlaces(value) {
        this._places = value;
    }

    getImages() {
        return this._images;
    }

    setImages(value) {
        this._images = value;
    }

    getWebsite() {
        return this._website;
    }

    setWebsite(value) {
        this._website = value;
    }

    static getTableDefinition(){
        let definition = EasySyncBaseModel.getTableDefinition();
        definition["columns"].push(...[
            {key: "names", type: EasySync.TYPES.JSON},
            {key: "places", type: EasySync.TYPES.JSON},
            {key: "descriptions", type: EasySync.TYPES.JSON},
            {key: "website", type: EasySync.TYPES.STRING},
            {key: "images", type: EasySync.TYPES.JSON},
        ]);
        return definition;
    }
}
Church.modelName = "church";
EasySync.addModel(Church);