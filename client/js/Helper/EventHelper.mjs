import {EasySyncClientDb} from "cordova-sites-easy-sync/src/client/EasySyncClientDb";
import {Event} from "../../../model/Event";
import {Helper} from "js-helper";
import {Brackets} from "typeorm";

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
        console.log(res);
        return res;
    }
}