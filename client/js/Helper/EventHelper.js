import {EasySyncClientDb} from "cordova-sites-easy-sync/src/client/EasySyncClientDb";
import {Event} from "../../../model/Event";
import {Brackets} from "typeorm";
import {NotificationScheduler} from "../NotificationScheduler";
import {Favorite} from "../Model/Favorite";
import {Translator, Helper} from "cordova-sites/dist/cordova-sites";

export class EventHelper {
    static async search(searchString, beginTime, endTime, types, organisers, regions) {
        let queryBuilder = await EasySyncClientDb.getInstance().createQueryBuilder(Event);

        if (Helper.isNotNull(searchString) && searchString.trim() !== ""){
            searchString = "%"+searchString+"%";

            queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                qb.orWhere("Event.names LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.descriptions LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.places LIKE :searchString", {searchString: searchString})
            }));
        }
        if (Helper.isNotNull(beginTime) && beginTime.trim() !== ""){
            queryBuilder = queryBuilder.andWhere("Event.endTime >= :beginTime", {beginTime: beginTime});
        }

        if (Helper.isNotNull(endTime) && endTime.trim() !== ""){
            queryBuilder = queryBuilder.andWhere("Event.startTime <= :endTime", {endTime: endTime});
        }

        if (Helper.isNotNull(types)){
            if (!Array.isArray(types)){
                types = [types];
            }
            if (types.length > 0){
                queryBuilder = queryBuilder.andWhere("Event.type IN (:...types)", {types: types});
            }
        }

        if (Helper.isNotNull(organisers)){
            if (!Array.isArray(organisers)){
                organisers = [organisers];
            }
            if (organisers.length > 0){
                queryBuilder = queryBuilder.innerJoin("Event.organisers", "organiser").andWhere("organiser.id IN(:...organisers)", {organisers: organisers})
            }
        }

        let res = await queryBuilder.getMany();
        return res;
    }

    static async toggleFavorite(event){

        const TRIGGER_SECONDS_BEFORE = 60*30;

        let notificationScheduler = NotificationScheduler.getInstance();

        if (await Favorite.toggle(event.id)){
            Translator.getInstance().addDynamicTranslations(event.getDynamicTranslations());

            let timeToNotify = new Date();
            timeToNotify.setTime(event.startTime.getTime() - TRIGGER_SECONDS_BEFORE*1000);

            let timeFormat = "";
            if (timeToNotify.getFullYear() !== event.startTime.getFullYear()){
                timeFormat = Helper.strftime("%a., %d.%m.%y, %H:%M", event.startTime, undefined, true);
            }
            else if (timeToNotify.getMonth() !== event.startTime.getMonth()){
                timeFormat = Helper.strftime("%a., %d.%m, %H:%M", event.startTime, undefined, true);
            }
            else if (timeToNotify.getDate() === event.startTime.getDate()){
                timeFormat = Translator.translate("today")+Helper.strftime(", %H:%M", event.startTime);
            }
            else if (timeToNotify.getDate()+1 === event.startTime.getDate()){
                timeFormat = Translator.getInstance().translate("tomorrow")+Helper.strftime(", %H:%M", event.startTime);
            }
            else {
                timeFormat = Helper.strftime("%a., %d.%m, %H:%M", event.startTime, undefined, false);
            }

            notificationScheduler.schedule(event.id, Translator.translate(event.getNameTranslation()), timeFormat, timeToNotify);
            return true;
        }
        else {
            console.log("deleting notification");
            notificationScheduler.cancelNotification(event.id);
            return false;
        }
    }
}