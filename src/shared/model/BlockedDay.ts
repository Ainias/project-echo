import { AccessEasySyncModel } from 'cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel';
import { BaseDatabase } from 'cordova-sites-database/dist/BaseDatabase';
import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared/EasySyncBaseModel';
import { RepeatedEvent } from './RepeatedEvent';
import { Event } from './Event';

export class BlockedDay extends AccessEasySyncModel {
    private day: Date;
    private repeatedEvent: RepeatedEvent;
    private event: Event;

    getEvent() {
        return this.event;
    }

    setEvent(event: Event) {
        this.event = event;
    }

    getRepeatedEvent() {
        return this.repeatedEvent;
    }

    setRepeatedEvent(repeatedEvent: RepeatedEvent) {
        this.repeatedEvent = repeatedEvent;
    }

    getDay() {
        return this.day;
    }

    setDay(day: Date) {
        this.day = day;
    }

    static getColumnDefinitions() {
        const columns = super.getColumnDefinitions();
        columns.day = BaseDatabase.TYPES.DATE;
        return columns;
    }

    static getRelationDefinitions() {
        const relations = EasySyncBaseModel.getRelationDefinitions();
        relations.repeatedEvent = {
            target: RepeatedEvent.getSchemaName(),
            type: 'many-to-one',
            inverseSide: 'blockedDays',
            joinColumn: true,
            sync: true,
        };
        relations.event = {
            target: Event.getSchemaName(),
            type: 'one-to-one',
            joinColumn: true,
            sync: true,
        };
        return relations;
    }
}

BlockedDay.ACCESS_MODIFY = 'events';
BaseDatabase.addModel(BlockedDay);
