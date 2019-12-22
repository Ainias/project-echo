import {BaseDatabase} from "cordova-sites-database/src/BaseDatabase";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/src/shared/EasySyncBaseModel";
import {Event} from "./Event";
import {AccessEasySyncModel} from "cordova-sites-user-management/src/shared/v1/model/AccessEasySyncModel";

export class RepeatedEvent extends AccessEasySyncModel {
    private repeatingStrategy: number;
    private repeatingArguments: string;
    private generatedUntil: Date;
    private originalEvent: Event;

    private endsAt: Date;

    constructor() {
        super();
        this.repeatingStrategy = 0;
        this.repeatingArguments = "";
        this.generatedUntil = new Date();
        this.originalEvent = null;

        this.endsAt = null;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["generatedUntil"] = BaseDatabase.TYPES.DATE;
        columns["endsAt"] = {type: BaseDatabase.TYPES.DATE, nullable: true};
        columns["repeatingStrategy"] = BaseDatabase.TYPES.INTEGER;
        columns["repeatingArguments"] = BaseDatabase.TYPES.TEXT;
        return columns;
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations["originalEvent"] = {
            target: Event.getSchemaName(),
            type: "one-to-one",
            joinColumn: true,
            eager: true,
            sync: true,
        };
        relations["events"] = {
            target: Event.getSchemaName(),
            type: "one-to-many",
            inverseSide: "repeatedEvent",
        };
        return relations;
    }

    getNames(): {} {
        return this.originalEvent.getNames();
    }

    getDescriptions(): {} {
        return this.originalEvent.getDescriptions();
    }

    getStartTime(): Date {
        return this.originalEvent.getStartTime();
    }

    getEndTime(): Date {
        return this.originalEvent.getEndTime();
    }

    getType(): string {
        return this.originalEvent.getType();
    }

    getImages(): any[] {
        return this.originalEvent.getImages();
    }

    getOrganisers(): any {
        return this.originalEvent.getOrganisers();
    }

    getPlaces(): any[] {
        return this.originalEvent.getPlaces();
    }

    getRegions(): any {
        return this.originalEvent.getRegions();
    }

}

RepeatedEvent.SCHEMA_NAME = "RepeatedEvent";
BaseDatabase.addModel(RepeatedEvent);