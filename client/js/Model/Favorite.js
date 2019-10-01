import {BaseDatabase, BaseModel} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/src/shared/EasySyncBaseModel";
import {Event} from "../../../model/Event";

export class Favorite extends BaseModel
{
    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["eventId"] = {type: BaseDatabase.TYPES.INTEGER};
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

    static async isFavorite(eventId){
        let fav = await this.findOne({"eventId": eventId});
        return (fav instanceof Favorite);
    }

    static async toggle(eventId){
        let fav = await this.findOne({"eventId": eventId});
        if (fav instanceof Favorite){
            await fav.delete();
            return false;
        }
        else {
            fav = new Favorite();
            fav.eventId = eventId;
            await fav.save();
            return true;
        }
    }
}
BaseDatabase.addModel(Favorite);