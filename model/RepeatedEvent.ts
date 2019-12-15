import {BaseDatabase} from "cordova-sites-database/src/BaseDatabase";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/src/shared/EasySyncBaseModel";
import {Event} from "./Event";
import {Church} from "./Church";
import {Region} from "./Region";
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
            sync: true,
        };
        relations["events"] = {
            target: Event.getSchemaName(),
            type: "one-to-many",
            inverseSide: "repeatedEvent",
        };
        return relations;
    }
}

RepeatedEvent.SCHEMA_NAME = "RepeatedEvent";
BaseDatabase.addModel(RepeatedEvent);