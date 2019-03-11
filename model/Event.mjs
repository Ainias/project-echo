import {EasySync, EasySyncBaseModel} from "cordova-sites-easy-sync/model";

export class Event extends EasySyncBaseModel {
    constructor() {
        super();
        this._name = null;
        this._startTime = null;
        this._endTime = null;
        this._places = [];
        this._type = null;
        this._organiser = null;
        this._description = null;
    }

    setName(name){
        this._name = name;
    }

    getName(){
        return this._name;
    }

    setPlacesJson(places){
        this._places = JSON.parse(places);
    }

    getPlacesJson(){
        return JSON.stringify(this._places);
    }

    getPlaces(){
        return this._places;
    }

    setPlaces(places){
        this._places = places;
    }

    getStartTime() {
        return this._startTime;
    }

    setStartTime(startTime) {
        this._startTime = startTime;
    }

    getEndTime() {
        return this._endTime;
    }

    setEndTime(endTime) {
        this._endTime = endTime;
    }

    setType(type) {
        this._type = type;
    }

    getType() {
        return this._type;
    }

    getOrganiser() {
        return this._organiser;
    }

    setOrganiser(organiser) {
        this._organiser = organiser;
    }

    getDescription() {
        return this._description;
    }

    setDescription(description) {
        this._description = description;
    }

    static getTableDefinition(){
        let definition = EasySyncBaseModel.getTableDefinition();
        definition["columns"].push(...[
            {key: "name", type: EasySync.TYPES.STRING},
            {key: "startTime", type: EasySync.TYPES.DATE},
            {key: "endTime", type: EasySync.TYPES.DATE},
            {key: "placesJson", type: EasySync.TYPES.STRING},
            {key: "organiser", type: EasySync.TYPES.STRING},
            {key: "description", type: EasySync.TYPES.STRING},

        ]);
        return definition;
    }
}

Event.modelName = "event";
EasySync.addModel(Event);