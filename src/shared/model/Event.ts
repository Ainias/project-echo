import { EasySyncBaseModel, FileMedium } from 'cordova-sites-easy-sync/dist/shared';
import { BaseDatabase } from 'cordova-sites-database/dist/BaseDatabase';
import { Church } from './Church';
import { Region } from './Region';
import { AccessEasySyncModel } from 'cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel';
import { Helper } from 'js-helper/dist/shared/Helper';
import { JsonHelper } from 'js-helper/dist/shared/JsonHelper';
import { BaseModel } from 'cordova-sites-database/dist/BaseModel';
import { RepeatedEvent } from './RepeatedEvent';
import { ClientFileMedium } from 'cordova-sites-easy-sync';

export class Event extends AccessEasySyncModel {
    private names: Record<string, string>;
    private descriptions: Record<string, string>;
    private startTime: Date;
    private endTime: Date;
    private type: string;
    private images: any;
    private organisers: any;
    private places: any[];
    private regions: any;
    private repeatedEvent: any;
    private website: string;
    private isTemplate = false;

    static readonly TYPES = {
        GOTTESDIENST: 'gottesdienst',
        KONZERT: 'konzert',
        // HAUSKREIS: "hauskreis",
        KONFERENZ: 'konferenz',
        // GEBETSKREIS: "gebetskreis",
        // SPORT: "sport",
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
        this.organisers = null;
        this.places = [];
        this.regions = null;
        this.website = null;
        this.isTemplate = false;
    }

    static getRelations() {
        const relations = super.getRelations();
        relations.push('repeatedEvent.originalEvent');
        relations.push('repeatedEvent.originalEvent.images');
        relations.push('repeatedEvent.originalEvent.organisers');
        return relations;
    }

    getRepeatedEvent() {
        return this.repeatedEvent;
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
        columns.startTime = { type: BaseDatabase.TYPES.DATE, nullable: true };
        columns.endTime = { type: BaseDatabase.TYPES.DATE, nullable: true };
        columns.isTemplate = { type: BaseDatabase.TYPES.BOOLEAN, default: false };
        columns.website = { type: BaseDatabase.TYPES.STRING, nullable: true };
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

        if (Helper.isNull(where)) {
            where = {};
        }
        if (!Array.isArray(where)) {
            where = [where];
        }

        // Android saves boolean as strings (why ever?!?), so copy every condition and "or" them with both, string and boolean
        const newWheres = [];
        where.forEach((orCondition) => {
            // Check first, if it is client only. On server load all non-deleted for syncing purpose
            if (!Helper.isSet(orCondition, 'isTemplate') && typeof document === 'object') {
                orCondition.isTemplate = false;
            } else if (orCondition.isTemplate === 'false') {
                orCondition.isTemplate = false;
            } else if (orCondition.isTemplate === 'true') {
                orCondition.isTemplate = true;
            }

            newWheres.push(orCondition);

            const newCondition: Record<string, any> = {};
            Object.keys(orCondition).forEach((key) => (newCondition[key] = orCondition[key]));
            newCondition.isTemplate = newCondition.isTemplate ? 'true' : 'false';

            newWheres.push(newCondition);
        });

        return this.database.findEntities(this, newWheres, order, limit, offset, relations);
    }

    static async findAndCount(where?, order?, limit?, offset?, relations?) {
        if (typeof relations === 'undefined') {
            relations = Event.getRelations();
        }

        if (Helper.isNull(where)) {
            where = {};
        }
        if (!Helper.isSet(where, 'isTemplate') && typeof document === 'object') {
            where.isTemplate = false;
        }

        return this.database.findAndCountEntities(this, where, order, limit, offset, relations);
    }

    static async findOne(where?, order?, offset?, relations?) {
        if (typeof relations === 'undefined') {
            relations = Event.getRelations();
        }

        if (Helper.isNull(where)) {
            where = {};
        }
        if (!Helper.isSet(where, 'isTemplate') && typeof document === 'object') {
            where.isTemplate = false;
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

        const noTemplateEvents = [];

        const events = await this.database.findByIds(this, ids, relations);
        if (typeof document === 'object') {
            events.forEach((e) => {
                if (!e.getIsTemplate()) {
                    noTemplateEvents.push(e);
                }
            });
        }
        return events;
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
        relations.images = {
            target: FileMedium.getSchemaName(),
            type: 'many-to-many',
            joinTable: {
                name: 'eventImages',
            },
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
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            JsonHelper.deepEqual(this.repeatedEvent.getNames(), value)
        ) {
            this.names = null;
        } else {
            this.names = value;
        }
    }

    getWebsite(): string {
        if (Helper.isNull(this.website) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getWebsite();
        }
        return this.website;
    }

    setWebsite(value: string) {
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            this.repeatedEvent.getWebsite() === value
        ) {
            this.website = null;
        } else {
            this.website = value;
        }
    }

    getDescriptions() {
        if (Helper.isNull(this.descriptions) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getDescriptions();
        }
        return this.descriptions;
    }

    setDescriptions(value: Record<string, string>) {
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            JsonHelper.deepEqual(this.repeatedEvent.getDescriptions(), value)
        ) {
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
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            JsonHelper.deepEqual(this.repeatedEvent.getStartTime(), value)
        ) {
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
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            JsonHelper.deepEqual(this.repeatedEvent.getEndTime(), value)
        ) {
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
        if (!this.getIsTemplate() && Helper.isNotNull(this.repeatedEvent) && this.repeatedEvent.getType() === value) {
            this.type = null;
        } else {
            this.type = value;
        }
    }

    getImages(): FileMedium[] | ClientFileMedium[] {
        if (Helper.isNull(this.images) && Helper.isNotNull(this.repeatedEvent)) {
            return this.repeatedEvent.getImages();
        }
        return this.images;
    }

    setImages(value: any[]) {
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            JsonHelper.deepEqual(this.repeatedEvent.getImages(), value)
        ) {
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
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            BaseModel.equals(this.repeatedEvent.getOrganisers(), value)
        ) {
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
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            JsonHelper.deepEqual(this.repeatedEvent.getPlaces(), value)
        ) {
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
        if (
            !this.getIsTemplate() &&
            Helper.isNotNull(this.repeatedEvent) &&
            BaseModel.equals(this.repeatedEvent.getRegions(), value)
        ) {
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

    setRepeatedEvent(repeatedEvent: RepeatedEvent) {
        this.repeatedEvent = repeatedEvent;
    }
}

Event.ACCESS_MODIFY = 'events';
Event.SCHEMA_NAME = 'Event';
BaseDatabase.addModel(Event);
