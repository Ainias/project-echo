import {EasySyncBaseModel} from "cordova-sites-easy-sync/dist/shared";
import {BaseDatabase} from "cordova-sites-database/dist/BaseDatabase";
import {Church} from "./Church";
import {Region} from "./Region";
import {AccessEasySyncModel} from "cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel";
import {Helper} from "js-helper/dist/shared/Helper";
import {JsonHelper} from "js-helper/dist/shared/JsonHelper";
import {BaseModel} from "cordova-sites-database/dist/BaseModel";
import { FileMedium } from "cordova-sites-easy-sync/dist/shared";

export class Event extends AccessEasySyncModel {
    private names: {};
    private descriptions: {};
    private startTime: Date;
    private endTime: Date;
    private type: string;
    private images: any;
    private organisers: any;
    private places: any[];
    private regions: any;
    private repeatedEvent: any;
    private isTemplate: boolean = false;

    static readonly TYPES: any = {
        GOTTESDIENST: "gottesdienst",
        KONZERT: "konzert",
        HAUSKREIS: "hauskreis",
        KONFERENZ: "konferenz",
        GEBETSKREIS: "gebetskreis",
        SPORT: "sport",
        JUGENDKREIS: "jugendkreis",
        STUDENTENKREIS: "studentenkreis",
        SONSTIGES: "sonstiges",
    };

    constructor() {
        super();
        this.names = null;
        this.descriptions = null;
        this.startTime = null;
        this.endTime = null;
        this.type = null;
        this.organisers = null;
        this.places = [];
        this.regions = null;
        this.isTemplate = false;
    }

    static getRelations(){
        let relations = super.getRelations();
        relations.push("repeatedEvent.originalEvent");
        relations.push("repeatedEvent.originalEvent.images");
        return relations;
    }

    getNameTranslation() {
        return "event-name-" + this.id;
    }

    getDescriptionTranslation() {
        return "event-description-" + this.id;
    }

    getDynamicTranslations() {
        let translations = {};
        Object.keys(this.getNames()).forEach(language => {
            translations[language] = translations[language] || {};
            translations[language][this.getNameTranslation()] = this.getNames()[language];
        });

        Object.keys(this.getDescriptions()).forEach(language => {
            translations[language] = translations[language] || {};
            translations[language][this.getDescriptionTranslation()] = this.getDescriptions()[language];
        });
        return translations;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["names"] = {type: BaseDatabase.TYPES.MY_JSON, nullable: true};
        columns["descriptions"] = {type: BaseDatabase.TYPES.MY_JSON, nullable: true};
        columns["places"] = {type: BaseDatabase.TYPES.MY_JSON, nullable: true};
        columns["startTime"] = {type: BaseDatabase.TYPES.DATE, nullable: true};
        columns["endTime"] = {type: BaseDatabase.TYPES.DATE, nullable: true};
        columns["isTemplate"] = {type: BaseDatabase.TYPES.BOOLEAN, default: false};
        columns["type"] = {
            type: BaseDatabase.TYPES.STRING,
            default: Event.TYPES.GOTTESDIENST,
            nullable: true,
        };
        return columns;
    }

    static async find(where?, order?, limit?, offset?, relations?) {
        if (typeof relations === "undefined") {
            relations = Event.getRelations();
        }

        if (Helper.isNull(where)) {
            where = {};
        }
        if (!Helper.isSet(where, "isTemplate") && typeof document === "object") {
            where["isTemplate"] = false;
        }

        return this._database.findEntities(this, where, order, limit, offset, relations);
    }

    static async findAndCount(where?, order?, limit?, offset?, relations?) {
        if (typeof relations === "undefined") {
            relations = Event.getRelations();
        }

        if (Helper.isNull(where)) {
            where = {};
        }
        if (!Helper.isSet(where, "isTemplate") && typeof document === "object") {
            where["isTemplate"] = false;
        }

        return this._database.findAndCountEntities(this, where, order, limit, offset, relations);
    }

    static async findOne(where?, order?, offset?, relations?) {
        if (typeof relations === "undefined") {
            relations = Event.getRelations();
        }

        if (Helper.isNull(where)) {
            where = {};
        }
        if (!Helper.isSet(where, "isTemplate") && typeof document === "object") {
            where["isTemplate"] = false;
        }

        return this._database.findOneEntity(this, where, order, offset, relations);
    }

    static async findById(id, relations?) {
        if (typeof relations === "undefined") {
            relations = Event.getRelations();
        }

        return await this._database.findById(this, id, relations);
    }

    static async findByIds(ids, relations?) {
        if (typeof relations === "undefined") {
            relations = Event.getRelations();
        }

        let noTemplateEvents = [];

        let events = await this._database.findByIds(this, ids, relations);
        if (typeof document === "object") {
            events.forEach(e => {
                if (!e.getIsTemplate()) {
                    noTemplateEvents.push(e);
                }
            });
        }
        return events;
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations["repeatedEvent"] = {
            target: "RepeatedEvent",
            type: "many-to-one",
            nullable: true,
            joinColumn: true,
            inverseSide: "events"
        };
        relations["organisers"] = {
            target: Church.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "churchEvent"
            },
        };
        relations["regions"] = {
            target: Region.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "eventRegion"
            },
            // inverseSide: "events",
            sync: true
        };
        relations["images"] = {
            target: FileMedium.getSchemaName(),
            type: "many-to-many",
            joinTable: {
                name: "eventImages"
            },
            sync: true
        };
        return relations;
    }

    getNames(): {} {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getNames();
        }
        return this.names;
    }

    setNames(value: {}) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && JsonHelper.deepEqual(this.repeatedEvent.getNames(), value)) {
            this.names = null;
        } else {
            this.names = value;
        }
    }

    getDescriptions(): {} {
        if (Helper.isNull(this.descriptions) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getDescriptions();
        }
        return this.descriptions;
    }

    setDescriptions(value: {}) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && JsonHelper.deepEqual(this.repeatedEvent.getDescriptions(), value)) {
            this.descriptions = null;
        } else {
            this.descriptions = value;
        }
    }

    getStartTime(): Date {
        if (Helper.isNull(this.startTime) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getStartTime();
        }
        return this.startTime;
    }

    setStartTime(value: Date) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && JsonHelper.deepEqual(this.repeatedEvent.getStartTime(), value)) {
            this.startTime = null;
        } else {
            this.startTime = value;
        }
    }

    getEndTime(): Date {
        if (Helper.isNull(this.endTime) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getEndTime();
        }
        return this.endTime;
    }

    setEndTime(value: Date) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && JsonHelper.deepEqual(this.repeatedEvent.getEndTime(), value)) {
            this.endTime = null;
        } else {
            this.endTime = value;
        }
    }

    getType(): string {
        if (Helper.isNull(this.type) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getType();
        }
        return this.type;
    }

    setType(value: string) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && this.repeatedEvent.getType() == value) {
            this.type = null;
        } else {
            this.type = value;
        }
    }

    getImages(): any[] {
        if (Helper.isNull(this.images) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getImages();
        }
        return this.images;
    }

    setImages(value: any[]) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && JsonHelper.deepEqual(this.repeatedEvent.getImages(), value)) {
            this.images = null;
        } else {
            this.images = value;
        }
    }

    getOrganisers(): any {
        if (Helper.isNull(this.organisers) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getOrganisers();
        }
        return this.organisers;
    }

    setOrganisers(value: any) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && BaseModel.equals(this.repeatedEvent.getOrganisers(), value)) {
            this.organisers = null;
        } else {
            this.organisers = value;
        }
    }

    getPlaces(): any[] {
        if (Helper.isNull(this.places) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getPlaces();
        }
        return this.places;
    }

    setPlaces(value: any[]) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && JsonHelper.deepEqual(this.repeatedEvent.getPlaces(), value)) {
            this.places = null;
        } else {
            this.places = value;
        }
    }

    getRegions(): any {
        if (Helper.isNull(this.regions) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getRegions();
        }
        return this.regions;
    }

    setRegions(value: any) {
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && BaseModel.equals(this.repeatedEvent.getRegions(), value)) {
            this.regions = null;
        } else {
            this.regions = value;
        }
    }

    getIsTemplate() {
        return this.isTemplate;
    }

    setIsTemplate(template) {
        this.isTemplate = template;
    }
}

Event.ACCESS_MODIFY = "admin";
Event.SCHEMA_NAME = "Event";
BaseDatabase.addModel(Event);
