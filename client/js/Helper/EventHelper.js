import {EasySyncClientDb} from "cordova-sites-easy-sync/src/client/EasySyncClientDb";
import {Event} from "../../../model/Event";
import {Between, Brackets, In} from "typeorm";
import {NotificationScheduler} from "../NotificationScheduler";
import {Favorite} from "../Model/Favorite";
import {Translator, Helper, NativeStoragePromise} from "cordova-sites/dist/cordova-sites";
import {SystemCalendar} from "../SystemCalendar";
import {BlockedDay} from "../../../model/BlockedDay";
import {DateHelper} from "js-helper";

export class EventHelper {
    static async search(searchString, beginTime, endTime, types, organisers, regions) {
        let queryBuilder = await EasySyncClientDb.getInstance().createQueryBuilder(Event);

        if (Helper.isNotNull(searchString) && searchString.trim() !== "") {
            searchString = "%" + searchString + "%";

            queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                qb.orWhere("Event.names LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.descriptions LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.places LIKE :searchString", {searchString: searchString})
            }));
        }
        if (Helper.isNotNull(beginTime) && beginTime.trim() !== "") {
            queryBuilder = queryBuilder.andWhere("Event.endTime >= :beginTime", {beginTime: beginTime});
        }

        if (Helper.isNotNull(endTime) && endTime.trim() !== "") {
            queryBuilder = queryBuilder.andWhere("Event.startTime <= :endTime", {endTime: endTime});
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

        return await queryBuilder.getMany();
    }

    static async toggleFavorite(event) {
        if (await Favorite.toggle(event.id)) {
            await EventHelper.setNotificationFor(event);
            await SystemCalendar.addEventToSystemCalendar(event);
            return true;
        } else {
            let notificationScheduler = NotificationScheduler.getInstance();
            await notificationScheduler.cancelNotification(event.id);
            await SystemCalendar.deleteEventFromSystemCalendar(event);
            return false;
        }
    }

    static async updateNotificationsForEvents(events) {
        let eventIds = [];
        events.forEach(event => eventIds.push(event.id));

        let notificationScheduler = NotificationScheduler.getInstance();

        let favorites = await Favorite.find({event: {id: In(eventIds)}});
        let promises = [this.updateNotificationsForFavorites(favorites)];
        favorites = Helper.arrayToObject(favorites, f => f.event.id);
        events.forEach(event => {
            if (Helper.isNull(favorites[event.id])) {
                promises.push(notificationScheduler.cancelNotification(event.id));
            }
        });
        await Promise.all(promises);
    }

    static async deleteNotificationsForEvents(events) {
        let notificationScheduler = NotificationScheduler.getInstance();
        await Helper.asyncForEach(events, e => notificationScheduler.cancelNotification(e.id), true);
    }

    static async updateNotificationsForFavorites(favorites) {
        if (Helper.isNull(favorites)) {
            favorites = await Favorite.find();
        }
        await Helper.asyncForEach(favorites, fav => {
            if (fav.isFavorite) {
                EventHelper.setNotificationFor(fav.event);
            }
        }, true);
    }

    static async setNotificationFor(event) {
        let timeInfos = await Promise.all([NativeStoragePromise.getItem("send-notifications"),
            NativeStoragePromise.getItem("time-to-notify-base"),
            NativeStoragePromise.getItem("time-to-notify-multiplier")]);

        let notificationScheduler = NotificationScheduler.getInstance();

        if (timeInfos[0] === "0") {
            await notificationScheduler.cancelNotification(event.id);
            return;
        }

        Translator.getInstance().addDynamicTranslations(event.getDynamicTranslations());


        let timeToNotify = new Date();
        timeToNotify.setTime(event.startTime.getTime() - (parseInt(timeInfos[1]) * parseInt(timeInfos[2]) * 1000));

        let timeFormat = "";
        if (timeToNotify.getFullYear() !== event.startTime.getFullYear()) {
            timeFormat = Helper.strftime("%a., %d.%m.%y, %H:%M", event.startTime, undefined, true);
        } else if (timeToNotify.getMonth() !== event.startTime.getMonth()) {
            timeFormat = Helper.strftime("%a., %d.%m, %H:%M", event.startTime, undefined, true);
        } else if (timeToNotify.getDate() === event.startTime.getDate()) {
            timeFormat = Translator.translate("today") + Helper.strftime(", %H:%M", event.startTime);
        } else if (timeToNotify.getDate() + 1 === event.startTime.getDate()) {
            timeFormat = Translator.getInstance().translate("tomorrow") + Helper.strftime(", %H:%M", event.startTime);
        } else {
            timeFormat = Helper.strftime("%a., %d.%m, %H:%M", event.startTime, undefined, false);
        }

        await notificationScheduler.schedule(event.id, Translator.translate(event.getNameTranslation()), timeFormat, timeToNotify);
    }

    static async generateSingleEventFromRepeatedEvent(repeatedEvent, day){
        let events = await this.generateEventFromRepeatedEvent(repeatedEvent, day, day);
        if (events.length === 1){
            return events[0];
        }
        else {
            return null;
        }
    }

    static async generateEventFromRepeatedEvent(repeatedEvent, from, to){

        if (repeatedEvent.repeatingStrategy !== 0){
            return [];
        }

        if (from.getTime() < repeatedEvent.startDate.getTime()){
            from = repeatedEvent.startDate;
        }

        from = new Date(from.getTime());
        to = new Date(to.getTime());

        from.setHours(0);
        to.setHours(23);

        let between = new Date(from.getTime());

        let fromString = DateHelper.strftime("%Y-%m-%d", from);
        let toString = DateHelper.strftime("%Y-%m-%d %H:%M", to);

        let blockedDaysObjects = await BlockedDay.find({
            repeatedEvent: {id: repeatedEvent.id},
            day: Between(fromString, toString)
        });

        let blockedDays = [];
        blockedDaysObjects.forEach(blockedDay => {
            blockedDays.push(DateHelper.strftime("%Y-%m-%d", blockedDay.day));
        });

        let weekdaysString = repeatedEvent.repeatingArguments.split(",");
        let weekdays = [];
        weekdaysString.forEach(weekday => {
            weekdays.push(parseInt(weekday))
        });

        between.setHours(repeatedEvent.getStartTime().getHours());
        between.setMinutes(repeatedEvent.getStartTime().getMinutes());
        between.setSeconds(repeatedEvent.getStartTime().getSeconds());
        between.setMilliseconds(repeatedEvent.getStartTime().getMilliseconds());

        let duration = repeatedEvent.getEndTime().getTime()-repeatedEvent.getStartTime().getTime();

        let events = [];
        while(from.getTime() < to.getTime()){

            if (blockedDays.indexOf(DateHelper.strftime("%Y-%m-%d", from)) === -1 && weekdays.indexOf(from.getDay()) !== -1){
                let event = new Event();
                event.id= "r"+repeatedEvent.id+"-"+DateHelper.strftime("%Y-%m-%d", between);
                event.repeatedEvent = repeatedEvent;
                event.setStartTime(new Date(between.getTime()));

                event.setEndTime(new Date(between.getTime()+duration));
                event.setPlaces(null);
                event.setImages(null);

                events.push(event);
            }
            from.setDate(from.getDate()+1);
            between.setDate(between.getDate()+1);
        }

        return events;
    }
}