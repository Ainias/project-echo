import {EasySyncClientDb} from "cordova-sites-easy-sync/src/client/EasySyncClientDb";
import {Event} from "../../../model/Event";
import {Helper} from "js-helper";
import {Brackets} from "typeorm";

export class EventHelper {
    static async search(searchString, startTime, endTime, type, organisers, regions) {
        let queryBuilder = await EasySyncClientDb.getInstance().createQueryBuilder(Event);

        if (Helper.isNotNull(searchString) && searchString.trim() !== ""){
            searchString = "%"+searchString+"%";

            queryBuilder = queryBuilder.andWhere(new Brackets(qb => {
                qb.orWhere("Event.names LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.descriptions LIKE :searchString", {searchString: searchString})
                    .orWhere("Event.places LIKE :searchString", {searchString: searchString})
            }));
        }

        let res = await queryBuilder.getMany();
        console.log(res);
        return res;
    }
}