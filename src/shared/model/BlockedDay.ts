import {AccessEasySyncModel} from "cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel";
import {BaseDatabase} from "cordova-sites-database/dist/BaseDatabase";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/dist/shared/EasySyncBaseModel";
import {RepeatedEvent} from "./RepeatedEvent";
import {Event} from "./Event";

export class BlockedDay extends AccessEasySyncModel{
    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["day"] = BaseDatabase.TYPES.DATE;
        return columns;
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations["repeatedEvent"] = {
            target: RepeatedEvent.getSchemaName(),
            type: "many-to-one",
            inverseSide: "blockedDays",
            joinColumn: true,
            sync: true,
        };
        relations["event"] = {
            target: Event.getSchemaName(),
            type: "one-to-one",
            joinColumn: true,
            sync: true,
        };
        return relations;
    }
}

BlockedDay.ACCESS_MODIFY = "admin";
BaseDatabase.addModel(BlockedDay);