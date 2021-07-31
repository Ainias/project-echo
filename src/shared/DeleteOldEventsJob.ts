import {DateHelper} from "./helper/DateHelper";
import {Event} from "./model/Event";
import {LessThan} from "typeorm";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";

export class DeleteOldEventsJob{
    async deleteOldEvents(){
        const deleteDate = new Date();
        DateHelper.setMonth(deleteDate.getMonth() - 2, 1, deleteDate);
        deleteDate.setDate(-1);

        const events = <Event[]>await Event.find({
            isTemplate: false,
            endTime: LessThan(DateHelper.strftime(DateHelper.FORMAT.ISO_TIME, deleteDate))
        }, null, null, null, ["images"]);

        const images = [];
        events.forEach(e => {
            images.push(...e.getImages());
        });

        // @ts-ignore
        await FileMedium.deleteMany(images, true);
        // @ts-ignore
        await Event.deleteMany(events, true);
        return events.length;
    }
}
