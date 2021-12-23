import { BaseDatabase, BaseModel } from 'cordova-sites-database';
import { Event } from '../../../shared/model/Event';
import { RepeatedEvent } from '../../../shared/model/RepeatedEvent';
import { EventHelper } from '../Helper/EventHelper';
import { Helper } from 'js-helper/dist/shared/Helper';

export class Favorite extends BaseModel {
    private isFavorite: boolean;
    private systemCalendarId: string;
    private eventId: string;

    constructor() {
        super();
        this.isFavorite = true;
        this.systemCalendarId = null;
    }

    static getColumnDefinitions() {
        const columns = super.getColumnDefinitions();
        columns.eventId = { type: BaseDatabase.TYPES.STRING };
        columns.isFavorite = BaseDatabase.TYPES.BOOLEAN;
        columns.systemCalendarId = { type: BaseDatabase.TYPES.INTEGER, nullable: true };
        return columns;
    }

    static async getEvents(favorites) {
        const repeatedEventIds = {};
        const events = {};
        const eventIds = {};

        favorites.forEach((fav, index) => {
            if (fav.eventId.startsWith('r')) {
                const parts = fav.eventId.substr(1).split('-');
                repeatedEventIds[parts[0]] = Helper.nonNull(repeatedEventIds[parts[0]], []);
                repeatedEventIds[parts[0]].push(index);
            } else {
                eventIds[Number(fav.eventId)] = index;
            }
        });

        const promises = [];
        promises.push(
            RepeatedEvent.findByIds(Object.keys(repeatedEventIds), RepeatedEvent.getRelations()).then(
                async (repeatedEvents) => {
                    await Helper.asyncForEach(
                        repeatedEvents,
                        async (repeatedEvent) => {
                            const indexes = repeatedEventIds[repeatedEvent.id];
                            await Helper.asyncForEach(
                                indexes,
                                async (index) => {
                                    const fav = favorites[index];
                                    const parts = fav.eventId.substr(1).split('-');

                                    if (parts.length === 4) {
                                        events[index] = await EventHelper.generateSingleEventFromRepeatedEvent(
                                            repeatedEvent,
                                            new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])),
                                            true
                                        );
                                    } else {
                                        // TODO get next event from helper
                                        events[index] = repeatedEvent;
                                    }
                                },
                                true
                            );
                        },
                        true
                    );
                }
            )
        );
        promises.push(
            Event.findByIds(Object.keys(eventIds), ['repeatedEvent', 'repeatedEvent.originalEvent']).then(
                (loadedEvents) => {
                    loadedEvents.forEach((event) => {
                        const index = eventIds[event.id];
                        events[index] = event;
                    });
                }
            )
        );

        await Promise.all(promises);
        return Object.values(events);
    }

    async getEvent(): Promise<Event> {
        if (this.eventId.startsWith('r')) {
            const parts = this.eventId.substr(1).split('-');
            const repeatedEvent = await RepeatedEvent.findById(parts[0]);
            if (parts.length === 4) {
                return EventHelper.generateSingleEventFromRepeatedEvent(
                    repeatedEvent,
                    new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
                );
            }
            // TODO get next event from helper
            return repeatedEvent;
        }
        return Event.findById(this.eventId);
    }

    static async eventIsFavorite(eventId) {
        const fav = await this.findOne({ eventId });
        return fav instanceof Favorite && fav.isFavorite;
    }

    static async toggle(eventId) {
        let fav = await this.findOne({ eventId });
        if (fav instanceof Favorite) {
            fav.isFavorite = !fav.isFavorite;
            await fav.save();
        } else {
            fav = new Favorite();
            fav.eventId = eventId;
            await fav.save();
        }
        return fav;
    }

    getEventId() {
        return this.eventId;
    }

    getIsFavorite() {
        return this.isFavorite;
    }

    setEventId(id: string) {
        this.eventId = id;
    }
}

BaseDatabase.addModel(Favorite);
