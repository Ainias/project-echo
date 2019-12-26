import {AccessEasySyncModel} from "cordova-sites-user-management/src/shared/v1/model/AccessEasySyncModel";
import {BaseDatabase} from "cordova-sites-database/src/BaseDatabase";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/src/shared/EasySyncBaseModel";
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
        return relations;
    }
}

BlockedDay.ACCESS_MODIFY = "admin";
BaseDatabase.addModel(BlockedDay);