import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared';
import { BaseDatabase } from 'cordova-sites-database';
import { Church } from './Church';
import { Region } from './Region';
import { AccessEasySyncModel } from 'cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel';
import { Helper } from 'js-helper/dist/shared/Helper';

export class Event extends AccessEasySyncModel {
    private names: Record<string, string>;
    private descriptions: Record<string, string>;
    private startTime: Date;
    private endTime: Date;
    private type: string;
    private images: any[];
    private organisers: any;
    private places: any[];
    private regions: any;
    private repeatedEvent: any;

    static readonly TYPES: any = {
        GOTTESDIENST: 'gottesdienst',
        KONZERT: 'konzert',
        HAUSKREIS: 'hauskreis',
        KONFERENZ: 'konferenz',
        GEBETSKREIS: 'gebetskreis',
        SPORT: 'sport',
        JUGENDKREIS: 'jugendkreis',
        STUDENTENKREIS: 'studentenkreis',
        SONSTIGES: 'sonstiges',
    };

    constructor() {
        super();
        this.names = null;
        this.descriptions = null;
        this.startTime = null;
        this.endTime = null;
        this.type = null;
        this.images = [];
        this.organisers = null;
        this.places = [];
        this.regions = null;
    }

    getNameTranslation() {
        return `event-name-${this.id}`;
    }

    getDescriptionTranslation() {
        return `event-description-${this.id}`;
    }

    getDynamicTranslations() {
        const translations = {};
        Object.keys(this.getNames()).forEach((language) => {
            translations[language] = translations[language] || {};
            translations[language][this.getNameTranslation()] = this.getNames()[language];
        });

        Object.keys(this.getDescriptions()).forEach((language) => {
            translations[language] = translations[language] || {};
            translations[language][this.getDescriptionTranslation()] = this.getDescriptions()[language];
        });
        return translations;
    }

    static getColumnDefinitions() {
        const columns = super.getColumnDefinitions();
        columns.names = { type: BaseDatabase.TYPES.MY_JSON, nullable: true };
        columns.descriptions = { type: BaseDatabase.TYPES.MY_JSON, nullable: true };
        columns.places = { type: BaseDatabase.TYPES.MY_JSON, nullable: true };
        columns.images = { type: BaseDatabase.TYPES.MY_JSON, nullable: true };
        columns.startTime = { type: BaseDatabase.TYPES.DATE, nullable: true };
        columns.endTime = { type: BaseDatabase.TYPES.DATE, nullable: true };
        columns.isTemplate = { type: BaseDatabase.TYPES.BOOLEAN, default: 0 };
        columns.type = {
            type: BaseDatabase.TYPES.STRING,
            default: Event.TYPES.GOTTESDIENST,
            nullable: true,
        };
        return columns;
    }

    static async find(where?, order?, limit?, offset?, relations?) {
        if (typeof relations === 'undefined') {
            relations = Event.getRelations();
        }
        return this.database.findEntities(this, where, order, limit, offset, relations);
    }

    static async findAndCount(where?, order?, limit?, offset?, relations?) {
        if (typeof relations === 'undefined') {
            relations = Event.getRelations();
        }
        return this.database.findAndCountEntities(this, where, order, limit, offset, relations);
    }

    static async findOne(where?, order?, offset?, relations?) {
        if (typeof relations === 'undefined') {
            relations = Event.getRelations();
        }
        return this.database.findOneEntity(this, where, order, offset, relations);
    }

    static async findById(id, relations?) {
        if (typeof relations === 'undefined') {
            relations = Event.getRelations();
        }
        return this.database.findById(this, id, relations);
    }

    static async findByIds(ids, relations?) {
        if (typeof relations === 'undefined') {
            relations = Event.getRelations();
        }
        return this.database.findByIds(this, ids, relations);
    }

    static getRelationDefinitions() {
        const relations = EasySyncBaseModel.getRelationDefinitions();
        relations.repeatedEvent = {
            target: 'RepeatedEvent',
            type: 'many-to-one',
            nullable: true,
            joinColumn: true,
            inverseSide: 'events',
        };
        relations.organisers = {
            target: Church.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'churchEvent',
            },
        };
        relations.regions = {
            target: Region.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'eventRegion',
            },
            // inverseSide: "events",
            sync: true,
        };
        return relations;
    }

    getNames() {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getNames();
        }
        return this.names;
    }

    setNames(value: Record<string, string>) {
        this.names = value;
    }

    getDescriptions() {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getDescription();
        }
        return this.descriptions;
    }

    setDescriptions(value: Record<string, string>) {
        this.descriptions = value;
    }

    getStartTime(): Date {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getStartTime();
        }
        return this.startTime;
    }

    setStartTime(value: Date) {
        this.startTime = value;
    }

    getEndTime(): Date {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getEndTime();
        }
        return this.endTime;
    }

    setEndTime(value: Date) {
        this.endTime = value;
    }

    getType(): string {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getType();
        }
        return this.type;
    }

    setType(value: string) {
        this.type = value;
    }

    getImages(): any[] {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getImages();
        }
        return this.images;
    }

    setImages(value: any[]) {
        this.images = value;
    }

    getOrganisers(): any {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getOrganisers();
        }
        return this.organisers;
    }

    setOrganisers(value: any) {
        this.organisers = value;
    }

    getPlaces(): any[] {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getPlaces();
        }
        return this.places;
    }

    setPlaces(value: any[]) {
        this.places = value;
    }

    getRegions(): any {
        if (Helper.isNull(this.names) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getRegions();
        }
        return this.regions;
    }

    setRegions(value: any) {
        this.regions = value;
    }
}

Event.ACCESS_MODIFY = 'admin';
Event.SCHEMA_NAME = 'Event';
