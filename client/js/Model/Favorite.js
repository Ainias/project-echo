import {BaseDatabase, BaseModel} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/src/shared/EasySyncBaseModel";
import {Event} from "../../../model/Event";

export class Favorite extends BaseModel {


    constructor() {
        super();
        this.isFavorite = true;
        this.systemCalendaId = null;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["eventId"] = {type: BaseDatabase.TYPES.INTEGER};
        columns["isFavorite"] = BaseDatabase.TYPES.BOOLEAN;
        columns["systemCalendarId"] = {type: BaseDatabase.TYPES.INTEGER, nullable: true};
        return columns;
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        relations["event"] = {
            target: Event.getSchemaName(),
            type: "one-to-one",
            joinColumn: "eventId"
        };
        return relations;
    }

    static async eventIsFavorite(eventId) {
        let fav = await this.findOne({"eventId": eventId});
        return (fav instanceof Favorite && fav.isFavorite);
    }

    static async toggle(eventId) {
        let fav = await this.findOne({"eventId": eventId});
        if (fav instanceof Favorite) {
            fav.isFavorite = !fav.isFavorite;
            await fav.save();
            return fav.isFavorite;
        } else {
            fav = new Favorite();
            fav.eventId = eventId;
            await fav.save();
            return true;
        }
    }
}

BaseDatabase.addModel(Favorite);