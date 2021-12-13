import { SyncController } from 'cordova-sites-user-management/dist/server';
import { EasySyncServerDb } from 'cordova-sites-easy-sync/dist/server';
import { Event } from '../../../../shared/model/Event';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { Helper } from 'js-helper';
import { RepeatedEvent } from '../../../../shared/model/RepeatedEvent';

export class EchoSyncController extends SyncController {
    static async _doSyncModel(model, lastSynced, offset, where, orderBy?) {
        if (model === Event && false) {
            return this._syncEvent(lastSynced, offset);
        } else if (model === RepeatedEvent && false) {
            return this._syncRepeatedEvent(lastSynced, offset);
        } else {
            return SyncController._doSyncModel(model, lastSynced, offset, where, orderBy);
        }
    }

    static async _syncEvent(lastSynced, offset) {
        lastSynced = new Date(Helper.nonNull(lastSynced, 0));
        let newDateLastSynced = new Date().getTime();

        const lastEventToShow = new Date();
        lastEventToShow.setDate(1);
        lastEventToShow.setMonth(lastEventToShow.getMonth() - 2);
        // const lastEventToShowString = DateHelper.strftime(DateHelper.FORMAT.ISO_TIME, lastEventToShow);

        let queryBuilder = <SelectQueryBuilder<Event>>await EasySyncServerDb.getInstance().createQueryBuilder(Event);
        queryBuilder = queryBuilder
            .leftJoinAndSelect('Event.repeatedEvent', 'repeatedEvent')
            .andWhere('Event.updatedAt >= :lastSynced', { lastSynced: lastSynced })
            .andWhere(
                new Brackets((qb) => {
                    qb.orWhere('Event.endTime >= :maxEndTime', { maxEndTime: lastEventToShow }).orWhere(
                        new Brackets((qb) => {
                            qb.andWhere('Event.isTemplate = 1').andWhere(
                                new Brackets((qb) => {
                                    qb.orWhere('repeatedEvent.repeatUntil >= :maxEndTime', {
                                        maxEndTime: lastEventToShow,
                                    }).orWhere('ISNULL(repeatedEvent.repeatUntil)');
                                })
                            );
                        })
                    );
                })
            )
            .offset(offset)
            .limit(this.MAX_MODELS_PER_RUN);

        let events = await queryBuilder.getMany();

        return {
            model: Event.getSchemaName(),
            newLastSynced: newDateLastSynced,
            entities: events,
            nextOffset: offset + events.length,
            shouldAskAgain: events.length === this.MAX_MODELS_PER_RUN,
        };
    }

    static async _syncRepeatedEvent(lastSynced, offset) {
        lastSynced = new Date(Helper.nonNull(lastSynced, 0));
        let newDateLastSynced = new Date().getTime();

        const lastEventToShow = new Date();
        lastEventToShow.setDate(1);
        lastEventToShow.setMonth(lastEventToShow.getMonth() - 2);

        let queryBuilder = <SelectQueryBuilder<RepeatedEvent>>(
            await EasySyncServerDb.getInstance().createQueryBuilder(RepeatedEvent)
        );
        queryBuilder = queryBuilder.leftJoinAndSelect('RepeatedEvent.originalEvent', 'event');
        queryBuilder = queryBuilder
            .andWhere('RepeatedEvent.updatedAt >= :lastSynced', { lastSynced: lastSynced })
            .andWhere(
                new Brackets((qb) => {
                    qb.orWhere('RepeatedEvent.repeatUntil >= :maxEndTime', { maxEndTime: lastEventToShow }).orWhere(
                        'ISNULL(RepeatedEvent.repeatUntil)'
                    );
                })
            )
            .offset(offset)
            .limit(this.MAX_MODELS_PER_RUN);

        let repeatedEvents = await queryBuilder.getMany();

        return {
            model: RepeatedEvent.getSchemaName(),
            newLastSynced: newDateLastSynced,
            entities: repeatedEvents,
            nextOffset: offset + repeatedEvents.length,
            shouldAskAgain: repeatedEvents.length === this.MAX_MODELS_PER_RUN,
        };
    }
}
