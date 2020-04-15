import {BaseDatabase} from "cordova-sites-database/dist/BaseDatabase";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/dist/shared/EasySyncBaseModel";
import {Event} from "./Event";
import {AccessEasySyncModel} from "cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel";
import {BlockedDay} from "./BlockedDay";

export class RepeatedEvent extends AccessEasySyncModel {
    private repeatingStrategy: number;
    private repeatingArguments: string;
    private originalEvent: Event;
    private startDate: Date;

    private repeatUntil: Date;

    private static DELETE_PATH = "/sync/deleteRepeatedEvent";

    constructor() {
        super();
        this.repeatingStrategy = 0;
        this.repeatingArguments = "";
        this.originalEvent = null;

        this.repeatUntil = null;
        this.startDate = null;
    }

    static getRelations(){
        let relations = super.getRelations();
        relations.push("originalEvent.images");
        relations.push("originalEvent.organisers");
        return relations;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["repeatUntil"] = {type: BaseDatabase.TYPES.DATE, nullable: true};
        columns["startDate"] = {type: BaseDatabase.TYPES.DATE};
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
            sync: true,
        };
        relations["blockedDays"] = {
            target: BlockedDay.getSchemaName(),
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

    // async delete(): Promise<any> {
    //     return super.delete();
    // }
}

RepeatedEvent.ACCESS_MODIFY = "admin";
RepeatedEvent.SCHEMA_NAME = "RepeatedEvent";

BaseDatabase.addModel(RepeatedEvent);