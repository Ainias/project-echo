import {BaseDatabase, BaseModel} from "cordova-sites-database";
import {EasySyncBaseModel} from "cordova-sites-easy-sync/src/shared/EasySyncBaseModel";
import {Event} from "../../../model/Event";
import {RepeatedEvent} from "../../../model/RepeatedEvent";
import {EventHelper} from "../Helper/EventHelper";
import {Helper} from "js-helper/dist/shared/Helper";

export class Favorite extends BaseModel {

    constructor() {
        super();
        this.isFavorite = true;
        this.systemCalendarId = null;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        columns["eventId"] = {type: BaseDatabase.TYPES.STRING};
        columns["isFavorite"] = BaseDatabase.TYPES.BOOLEAN;
        columns["systemCalendarId"] = {type: BaseDatabase.TYPES.INTEGER, nullable: true};
        return columns;
    }

    static async getEvents(favorites) {
        let repeatedEventIds = {};
        let events = {};
        let eventIds = {};


        favorites.forEach((fav, index) => {
            if (fav.event !== null) {
                events[index] = fav.event
            } else if (fav.eventId.startsWith("r")) {
                let parts = fav.eventId.substr(1).split("-");
                repeatedEventIds[parts[0]] = Helper.nonNull(repeatedEventIds[parts[0]], []);
                repeatedEventIds[parts[0]].push(index);
            } else {
                eventIds[fav.eventId] = index;
            }
        });

        let promises = [];
        promises.push(RepeatedEvent.findByIds(Object.keys(repeatedEventIds)).then(async repeatedEvents => {
            await Helper.asyncForEach(repeatedEvents, async repeatedEvent => {
                let indexes = repeatedEventIds[repeatedEvent.id];
                await Helper.asyncForEach(indexes, async index => {
                    let fav = favorites[index];
                    let parts = fav.eventId.substr(1).split("-");

                    if (parts.length === 4) {
                        events[index] = await EventHelper.generateSingleEventFromRepeatedEvent(repeatedEvent,
                            new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3])), true)
                    } else {
                        //TODO get next event from helper
                        events[index] = repeatedEvent;
                    }
                }, true);
            }, true);
        }));
        promises.push(Event.findByIds(Object.keys(eventIds)).then(loadedEvents => {
            loadedEvents.forEach(event => {
                let index = eventIds[event.id];
                events[index] = event;
            });
        }));

        await Promise.all(promises);
        return Object.values(events);
    }

    async getEvent() {
        if (this.event !== null) {
            return this.event
        }

        if (this.eventId.startsWith("r")) {
            let parts = this.eventId.substr(1).split("-");
            let repeatedEvent = await RepeatedEvent.findById(parts[0]);
            if (parts.length === 4) {
                return EventHelper.generateSingleEventFromRepeatedEvent(repeatedEvent,
                    new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3])))
            } else {
                //TODO get next event from helper
                return repeatedEvent;
            }
        } else {
            return Event.findById(this.eventId);
        }
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