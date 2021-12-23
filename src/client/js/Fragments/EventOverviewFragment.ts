import { DateHelper } from 'js-helper/dist/shared/DateHelper';

import { AbstractFragment, MenuSite, Translator } from 'cordova-sites';
import { PlaceHelper } from '../Helper/PlaceHelper';
import { EventSite } from '../Sites/EventSite';
import { Favorite } from '../Model/Favorite';
import { EventHelper } from '../Helper/EventHelper';
import { ViewHelper } from 'js-helper/dist/client';
import { Helper } from 'js-helper/dist/shared';
import { Event } from '../../../shared/model/Event';
import { Church } from '../../../shared/model/Church';

const view = require('../../html/Fragments/eventOverviewFragment.html');

export class EventOverviewFragment extends AbstractFragment<MenuSite> {
    private events: Event[];
    private showInPast: boolean;
    private eventContainer: HTMLElement;
    private eventContainerPast: HTMLElement;
    private eventTemplate: HTMLElement;
    private eventOverviewTemplate: HTMLElement;
    private pastSection: HTMLElement;

    private showMaxEvents = 0;

    constructor(site) {
        super(site, view);
        this.events = [];
        this.showInPast = true;
    }

    setShowMaxEvents(maxEvents) {
        this.showMaxEvents = maxEvents;
        this.getViewLoadedPromise().then(() => this.renderList());
    }

    setShowInPast(showInPast) {
        this.showInPast = showInPast === true;
    }

    async setEvents(events) {
        this.events = events;
        await this.getViewLoadedPromise();
        await this.renderList();
    }

    async onViewLoaded() {
        const res = super.onViewLoaded();
        this.eventContainer = this.findBy('#event-container-future');
        this.eventContainerPast = this.findBy('#event-container-past');
        this.eventTemplate = this.findBy('#event-template');
        this.eventOverviewTemplate = this.findBy('#event-overview-template');
        this.pastSection = this.findBy('#past-section');

        this.eventTemplate.removeAttribute('id');
        this.eventOverviewTemplate.removeAttribute('id');

        this.eventTemplate.remove();
        this.eventOverviewTemplate.remove();

        return res;
    }

    async renderList() {
        const currentYear = DateHelper.strftime('%y');
        const unsortedFavorites = {};
        this.events.forEach((event) => {
            if (Helper.isNotNull(event)) {
                // adding translations
                Translator.addDynamicTranslations(event.getDynamicTranslations());

                const yearSuffixStart = DateHelper.strftime('%y', event.getStartTime());
                const yearSuffixEnd = DateHelper.strftime('%y', event.getEndTime());
                let dayName = DateHelper.strftime('%a %d.%m.', event.getStartTime());
                const endDay = DateHelper.strftime('%a %d.%m.', event.getEndTime());

                if (yearSuffixEnd !== yearSuffixStart) {
                    dayName += ` ${yearSuffixStart} - ${endDay} ${yearSuffixEnd}`;
                } else if (dayName !== endDay) {
                    dayName += ` - ${endDay}`;
                    if (currentYear !== yearSuffixStart) {
                        dayName += ` ${yearSuffixStart}`;
                    }
                }

                const sortingStartDay = `${DateHelper.strftime(
                    '%Y.%m.%d',
                    event.getStartTime()
                )},${dayName},${DateHelper.strftime('%Y.%m.%d', event.getEndTime())}`;
                if (Helper.isNull(unsortedFavorites[sortingStartDay])) {
                    unsortedFavorites[sortingStartDay] = {};
                }

                const startTime = DateHelper.strftime('%H:%M', event.getStartTime());
                if (Helper.isNull(unsortedFavorites[sortingStartDay][startTime])) {
                    unsortedFavorites[sortingStartDay][startTime] = [];
                }
                unsortedFavorites[sortingStartDay][startTime].push(event);
            }
        });

        const sortedFavorites: { [key: string]: { [key: string]: Event[] } } = {};
        Object.keys(unsortedFavorites)
            .sort()
            .forEach((day) => {
                sortedFavorites[day] = {};
                Object.keys(unsortedFavorites[day])
                    .sort()
                    .forEach((time) => {
                        sortedFavorites[day][time] = unsortedFavorites[day][time].sort((a, b) => {
                            const aUpper = Translator.translate(a.getNameTranslation()).toUpperCase();
                            const bUpper = Translator.translate(b.getNameTranslation()).toUpperCase();

                            // eslint-disable-next-line no-nested-ternary
                            return aUpper < bUpper ? -1 : aUpper > bUpper ? 1 : 0;
                        });
                    });
            });

        const today = DateHelper.strftime('%Y.%m.%d');

        ViewHelper.removeAllChildren(this.eventContainer);
        ViewHelper.removeAllChildren(this.eventContainerPast);

        let hasEventsInPast = false;
        const translator = Translator.getInstance();

        let numEvents = 0;

        Object.keys(sortedFavorites).some((day) => {
            const dayParts = day.split(',');

            const dayContainer = <HTMLElement>this.eventTemplate.cloneNode(true);
            [, dayContainer.querySelector('.day').innerHTML] = dayParts;

            const res = Object.keys(sortedFavorites[day]).some((time) => {
                return sortedFavorites[day][time].some((event) => {
                    const eventElement = <HTMLElement>this.eventOverviewTemplate.cloneNode(true);
                    eventElement
                        .querySelector('.name')
                        .appendChild(translator.makePersistentTranslation(event.getNameTranslation()));
                    (eventElement.querySelector('.time') as HTMLElement).innerText = time;

                    const places = event.getPlaces();
                    const placesIsArray = Array.isArray(places);
                    let placesIndexes = places;
                    if (!placesIsArray) {
                        placesIndexes = Object.keys(places);
                    }

                    if (placesIndexes.length > 0) {
                        (placesIndexes.length === 1
                            ? PlaceHelper.createPlace(
                                  placesIndexes[0],
                                  placesIsArray ? places[0] : places[placesIndexes[0]],
                                  true
                              )
                            : PlaceHelper.createMultipleLocationsView()
                        ).then((placeView) => eventElement.querySelector('.place-container').appendChild(placeView));
                    }

                    eventElement.addEventListener('click', () => {
                        this.startSite(EventSite, { id: event.getId() });
                    });

                    const favElem = eventElement.querySelector('.favorite');
                    Favorite.eventIsFavorite(event.getId()).then((isFavorite) => {
                        if (isFavorite) {
                            favElem.classList.add('is-favorite');
                        }
                    });

                    favElem.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        // TODO changing
                        const isFavourite = await EventHelper.toggleFavorite(event);
                        if (isFavourite) {
                            favElem.classList.add('is-favorite');
                        } else {
                            favElem.classList.remove('is-favorite');
                        }
                    });

                    const organisers: Church[] = event.getOrganisers();
                    if (Array.isArray(organisers)) {
                        const tagPanel = eventElement.querySelector('.tag-panel');
                        organisers.forEach((organiser) => {
                            Translator.addDynamicTranslations(organiser.getDynamicTranslations());

                            const organiserTagElement = document.createElement('span');
                            organiserTagElement.classList.add('tag');
                            organiserTagElement.appendChild(
                                Translator.makePersistentTranslation(organiser.getNameTranslation())
                            );
                            tagPanel.appendChild(organiserTagElement);
                        });
                    }

                    dayContainer.appendChild(eventElement);
                    numEvents++;
                    return this.showMaxEvents > 0 && numEvents >= this.showMaxEvents;
                });
            });

            if (this.showInPast && dayParts[2] < today) {
                this.eventContainerPast.appendChild(dayContainer);
                hasEventsInPast = true;
            } else {
                this.eventContainer.appendChild(dayContainer);
            }
            return res;
        });
        if (Object.keys(sortedFavorites).length === 0) {
            const elem = document.createElement('div');
            elem.classList.add('no-events');
            elem.appendChild(Translator.makePersistentTranslation('no events'));
            this.eventContainer.appendChild(elem);
        }
        if (hasEventsInPast) {
            this.pastSection.classList.remove('hidden');
        } else {
            this.pastSection.classList.add('hidden');
        }
        Translator.getInstance().updateTranslations(this.eventContainer);
        Translator.getInstance().updateTranslations(this.eventContainerPast);
    }
}
