import {EasySyncClientDb} from "cordova-sites-easy-sync/dist/client/EasySyncClientDb";
import {Event} from "../../../shared/model/Event";
import {Between, Brackets, DeleteQueryBuilder, In, LessThan, SelectQueryBuilder} from "typeorm";
import {NotificationScheduler} from "../NotificationScheduler";
import {Favorite} from "../Model/Favorite";
import {Translator, NativeStoragePromise} from "cordova-sites/dist/client";
import {SystemCalendar} from "../SystemCalendar";
import {BlockedDay} from "../../../shared/model/BlockedDay";
import {DateHelper} from "js-helper";
import {Helper} from "js-helper/dist/shared";
import {RepeatedEvent} from "../../../shared/model/RepeatedEvent";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";

export class EventHelper {
    static async search(searchString?, beginTime?, endTime?, types?, organisers?, regions?, loadOrganisers?: boolean) {
        let queryBuilder = <SelectQueryBuilder<Event>>await EasySyncClientDb.getInstance().createQueryBuilder(Event);
        queryBuilder = queryBuilder.leftJoinAndSelect("Event.repeatedEvent", "repeatedEvent");
        queryBuilder = queryBuilder.leftJoinAndSelect("repeatedEvent.originalEvent", "originalEvent");

        if (Helper.nonNull(loadOrganisers, false)) {
            queryBuilder = queryBuilder.leftJoinAndSelect("Event.organisers", "organisers");
            queryBuilder = queryBuilder.leftJoinAndSelect("originalEvent.organisers", "originalOrganisers");
        }

        if (Helper.isNotNull(searchString) && searchString.trim() !== "") {
            searchString = "%" + searchString + "%";

            queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                qb.orWhere("Event.names LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.descriptions LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.places LIKE :searchString", {searchString: searchString})
            }));
        }

        if (Helper.isNotNull(types)) {
            if (!Array.isArray(types)) {
                types = [types];
            }
            if (types.length > 0) {
                queryBuilder = queryBuilder.andWhere("Event.type IN (:...types)", {types: types});
            }
        }

        if (Helper.isNotNull(organisers)) {
            if (!Array.isArray(organisers)) {
                organisers = [organisers];
            }
            if (organisers.length > 0) {
                queryBuilder = queryBuilder.innerJoin("Event.organisers", "organiser").andWhere("organiser.id IN(:...organisers)", {organisers: organisers})
            }
        }
        let repeatedEventQueryBuilder = queryBuilder.clone();

        // isTemplate = 'false' is needed for android & iOS
        queryBuilder = queryBuilder.andWhere("(Event.isTemplate = 0 or Event.isTemplate = 'false')");
        if (Helper.isNotNull(beginTime) && beginTime.trim() !== "") {
            queryBuilder = queryBuilder.andWhere("Event.endTime >= :beginTime", {beginTime: beginTime});
        }

        if (Helper.isNotNull(endTime) && endTime.trim() !== "") {
            queryBuilder = queryBuilder.andWhere("Event.startTime < :endTime", {endTime: endTime});
        }

        let eventPromise = queryBuilder.getMany();

        // isTemplate = 'true' is needed for android & iOS
        repeatedEventQueryBuilder = repeatedEventQueryBuilder.andWhere("(Event.isTemplate = 1 OR Event.isTemplate = 'true')");
        if (Helper.isNotNull(beginTime) && beginTime.trim() !== "") {
            repeatedEventQueryBuilder = repeatedEventQueryBuilder.andWhere("(repeatedEvent.repeatUntil >= :beginTime OR repeatedEvent.repeatUntil IS NULL)", {beginTime: beginTime});
        }

        if (Helper.isNotNull(endTime) && endTime.trim() !== "") {
            repeatedEventQueryBuilder = repeatedEventQueryBuilder.andWhere("repeatedEvent.startDate <= :endTime", {endTime: endTime});
        }

        let repeatUntilEvents = await repeatedEventQueryBuilder.getMany();

        if (Helper.isNull(beginTime) || beginTime.trim() === "") {
            beginTime = new Date();
        } else {
            beginTime = new Date(Date.parse(beginTime.replace(" ", "T")));
        }

        if (Helper.isNull(endTime) || endTime.trim() === "") {
            endTime = new Date(beginTime.getTime() + 1000 * 60 * 60 * 24 * 30);
        } else {
            endTime = new Date(Date.parse(endTime.replace(" ", "T")));
        }

        let events = [];
        await Helper.asyncForEach(repeatUntilEvents, async event => {
            if (event.repeatedEvent) {
                events.push.apply(events, await EventHelper.generateEventFromRepeatedEvent(event.repeatedEvent, beginTime, endTime, false, false))
            }
        });
        events.push.apply(events, await eventPromise);

        return events;
    }

    static async toggleFavorite(event) {
        let fav = await Favorite.toggle(event.id);
        if (fav.isFavorite) {
            await Promise.all([
                EventHelper.setNotificationFor(fav.id, event).catch(console.error),
                SystemCalendar.addEventToSystemCalendar(event).catch(console.error)
            ]);
            return true;
        } else {
            let notificationScheduler = NotificationScheduler.getInstance();
            await notificationScheduler.cancelNotification(fav.id);
            await SystemCalendar.deleteEventFromSystemCalendar(event);
            return false;
        }
    }

    static async updateNotificationsForEvents(eventIds) {

        let events = await Event.findByIds(eventIds);

        let notificationScheduler = NotificationScheduler.getInstance();

        let favorites = await Favorite.find({eventId: In(eventIds)});
        let promises = [this.updateNotificationsForFavorites(favorites)];

        //Delete notifications for changed favorites
        favorites = Helper.arrayToObject(favorites, f => f.eventId);

        events.forEach(event => {
            if (Helper.isNotNull(favorites[event.id]) && favorites[event.id].isFavorite === false) {
                promises.push(notificationScheduler.cancelNotification(favorites[event.id].id));
            }
        });
        await Promise.all(promises);
    }

    static async deleteNotificationsForEvents(eventIds) {
        let notificationScheduler = NotificationScheduler.getInstance();

        let favorites = await Favorite.find({eventId: In(eventIds)});
        await Helper.asyncForEach(favorites, async f => await notificationScheduler.cancelNotification(f.id), true);
    }

    static async updateNotificationsForFavorites(favorites) {
        if (Helper.isNull(favorites)) {
            favorites = await Favorite.find();
        }
        let events = await Favorite.getEvents(favorites);

        await Helper.asyncForEach(favorites, async (fav, index) => {
            if (fav.isFavorite) {
                await EventHelper.setNotificationFor(fav.id, events[index]);
            }
        }, true);
    }

    static async setNotificationFor(id, event) {
        let timeInfos = await Promise.all([NativeStoragePromise.getItem("send-notifications", "1"),
            NativeStoragePromise.getItem("time-to-notify-base", 1),
            NativeStoragePromise.getItem("time-to-notify-multiplier", 60 * 60 * 24)]);

        let notificationScheduler = NotificationScheduler.getInstance();

        if (timeInfos[0] === "0") {
            await notificationScheduler.cancelNotification(id);
            return;
        }

        Translator.getInstance().addDynamicTranslations(event.getDynamicTranslations());

        let startTime = await event.getStartTime();

        //IF event started already, cancel notification
        let now = new Date();
        if (startTime.getTime() < now.getTime()) {
            return;
        }

        let timeToNotify = new Date();
        timeToNotify.setTime(startTime.getTime() - (parseInt(timeInfos[1]) * parseInt(timeInfos[2]) * 1000));

        let timeFormat = "";
        if (timeToNotify.getFullYear() !== startTime.getFullYear()) {
            timeFormat = DateHelper.strftime("%a., %d.%m.%y, %H:%M", startTime, undefined);
        } else if (timeToNotify.getMonth() !== startTime.getMonth()) {
            timeFormat = DateHelper.strftime("%a., %d.%m, %H:%M", startTime, undefined);
        } else if (timeToNotify.getDate() === startTime.getDate()) {
            timeFormat = Translator.translate("today") + DateHelper.strftime(", %H:%M", startTime);
        } else if (timeToNotify.getDate() + 1 === startTime.getDate()) {
            timeFormat = Translator.getInstance().translate("tomorrow") + DateHelper.strftime(", %H:%M", startTime);
        } else {
            timeFormat = DateHelper.strftime("%a., %d.%m, %H:%M", startTime, undefined);
        }

        await notificationScheduler.schedule(id, event.getId(), Translator.translate(event.getNameTranslation()), timeFormat, timeToNotify);
    }

    static async generateNextSingleEventFromRepeatedEvent(repeatedEvent: RepeatedEvent, addDatabaseEvents?: boolean) {

        const maxTime = Math.max(new Date().getTime(), repeatedEvent.getStartDate().getTime());
        const startTime = new Date(maxTime);
        const endTime = new Date(maxTime);
        endTime.setDate(endTime.getDate() + 7);

        let events = await this.generateEventFromRepeatedEvent(repeatedEvent, startTime, endTime, addDatabaseEvents);
        if (events.length >= 1) {
            return events[0];
        } else {
            return null;
        }
    }

    static async generateSingleEventFromRepeatedEvent(repeatedEvent: RepeatedEvent, day, addDatabaseEvents?: boolean) {
        let events = await this.generateEventFromRepeatedEvent(repeatedEvent, day, day, addDatabaseEvents);
        if (events.length === 1) {
            return events[0];
        } else {
            return null;
        }
    }

    static async generateEventFromRepeatedEvent(repeatedEvent: RepeatedEvent, from, to, addDatabaseEvents?: boolean, ignoreTime?: boolean) {
        addDatabaseEvents = Helper.nonNull(addDatabaseEvents, false);
        ignoreTime = Helper.nonNull(ignoreTime, true);

        if (repeatedEvent.getRepeatingStrategy() !== 0) {
            return [];
        }

        if (from.getTime() < repeatedEvent.getStartDate().getTime()) {
            from = repeatedEvent.getStartDate();
        }

        from = new Date(from.getTime());
        to = new Date(to.getTime());

        from.setHours(0);
        if (ignoreTime) {
            to.setHours(23);
        }

        let between = new Date(from.getTime());

        let fromString = DateHelper.strftime("%Y-%m-%d", from);
        let toString = DateHelper.strftime("%Y-%m-%d %H:%M", to);

        let blockedDaysObjects = await BlockedDay.find({
            repeatedEvent: {id: repeatedEvent.id},
            day: Between(fromString, toString)
        }, null, null, null, BlockedDay.getRelations());

        let indexedBlockedDaysObjects = Helper.arrayToObject(blockedDaysObjects, blockedDay => DateHelper.strftime("%Y-%m-%d", blockedDay.day));
        let blockedDays = Object.keys(indexedBlockedDaysObjects);

        let weekdaysString = repeatedEvent.getRepeatingArguments().split(",");
        let weekdays = [];
        weekdaysString.forEach(weekday => {
            weekdays.push(parseInt(weekday))
        });

        between.setHours(repeatedEvent.getStartTime().getHours());
        between.setMinutes(repeatedEvent.getStartTime().getMinutes());
        between.setSeconds(repeatedEvent.getStartTime().getSeconds());
        between.setMilliseconds(repeatedEvent.getStartTime().getMilliseconds());

        let duration = repeatedEvent.getEndTime().getTime() - repeatedEvent.getStartTime().getTime();

        let events = [];
        while (from.getTime() < to.getTime() && (ignoreTime || between.getTime() <= to.getTime())) {

            let today = DateHelper.strftime("%Y-%m-%d", from);

            if (blockedDays.indexOf(today) === -1 && weekdays.indexOf(from.getDay()) !== -1) {
                let event = new Event();
                // @ts-ignore
                event.id = "r" + repeatedEvent.id + "-" + DateHelper.strftime("%Y-%m-%d", between);
                event.setRepeatedEvent(repeatedEvent);
                event.setStartTime(new Date(between.getTime()));

                event.setEndTime(new Date(between.getTime() + duration));
                event.setPlaces(null);
                event.setImages(null);

                events.push(event);
            } else if (addDatabaseEvents && blockedDays.indexOf(today) !== -1) {
                if (indexedBlockedDaysObjects[today].event !== null) {
                    indexedBlockedDaysObjects[today].event.repeatedEvent = repeatedEvent;
                    events.push(indexedBlockedDaysObjects[today].event);
                }
            }
            from.setDate(from.getDate() + 1);
            between.setDate(between.getDate() + 1);
        }
        return events;
    }

    static async updateFavorites(res) {

        //load blockedDays with repeatedEvent
        let blockedDayIds = [];
        res["changed"].forEach(blockedDay => {
            blockedDayIds.push(blockedDay);
        });

        let changedBlockedDays = await BlockedDay.findByIds(blockedDayIds, BlockedDay.getRelations());

        let favEventIds = {};
        changedBlockedDays.forEach(blockedDay => {
            favEventIds["r" + blockedDay.repeatedEvent.id + "-" + DateHelper.strftime("%Y-%m-%d", blockedDay.day)] = blockedDay;
        });

        let favorites = await Favorite.find({
            eventId: In(Object.keys(favEventIds))
        });

        let deleteFavIds = [];
        let saveFavs = [];

        favorites.forEach(fav => {
            let blockedDay = favEventIds[fav.eventId];
            if (blockedDay.event) {
                fav.eventId = blockedDay.event.id;
                saveFavs.push(fav);
            } else {
                deleteFavIds.push(fav.id);
            }
        });

        await Promise.all([
            Favorite.saveMany(saveFavs),
            EasySyncClientDb.getInstance().deleteEntity(deleteFavIds, Favorite)
        ]);
    }

    static async deleteEventsOlderThan(date: Date) {
        const events = <Event[]>await Event.find({
            isTemplate: false,
            endTime: LessThan(date.toString())
        }, null, null, null, ["images"]);

        const images = [];
        events.forEach(e => {
            images.push(...e.getImages());
        });

        await FileMedium.deleteMany(images);
        await Event.deleteMany(events);

        console.log("events", await Event.find({
            isTemplate: false,
            endTime: LessThan(date.toString())
        }, null, null, null, ["images"]));
    }
}
