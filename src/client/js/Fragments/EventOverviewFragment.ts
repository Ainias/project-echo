import {DateHelper} from "js-helper/dist/shared/DateHelper";

const view = require("../../html/Fragments/eventOverviewFragment.html");

import {AbstractFragment, Translator} from "cordova-sites";
import {PlaceHelper} from "../Helper/PlaceHelper";
import {EventSite} from "../Sites/EventSite";
import {Favorite} from "../Model/Favorite";
import {EventHelper} from "../Helper/EventHelper";
import {ViewHelper} from "js-helper/dist/client";
import {Helper} from "js-helper/dist/shared";
import {Event} from "../../../shared/model/Event";
import {Church} from "../../../shared/model/Church";

export class EventOverviewFragment extends AbstractFragment {
    private _events: Event[];
    private _showInPast: boolean;
    private _eventContainer: HTMLElement;
    private _eventContainerPast: HTMLElement;
    private _eventTemplate: HTMLElement;
    private _eventOverviewTemplate: HTMLElement;
    private _pastSection: HTMLElement;

    constructor(site) {
        super(site, view);
        this._events = [];
        this._showInPast = true;
    }

    setShowInPast(showInPast) {
        this._showInPast = (showInPast === true);
    }

    async setEvents(events) {
        this._events = events;
        await this._viewLoadedPromise;
        await this._renderList();
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        this._eventContainer = this.findBy("#event-container-future");
        this._eventContainerPast = this.findBy("#event-container-past");
        this._eventTemplate = this.findBy("#event-template");
        this._eventOverviewTemplate = this.findBy("#event-overview-template");
        this._pastSection = this.findBy("#past-section");

        this._eventTemplate.removeAttribute("id");
        this._eventOverviewTemplate.removeAttribute("id");

        this._eventTemplate.remove();
        this._eventOverviewTemplate.remove();

        return res;
    }

    async _renderList() {
        let currentYear = DateHelper.strftime("%y");
        let unsortedFavorites = {};
        this._events.forEach(event => {
            if (Helper.isNotNull(event)) {
                //adding translations
                Translator.addDynamicTranslations(event.getDynamicTranslations());

                let yearSuffixStart = (DateHelper.strftime("%y", event.getStartTime()));
                let yearSuffixEnd = (DateHelper.strftime("%y", event.getEndTime()));
                let dayName = DateHelper.strftime("%a %d.%m.", event.getStartTime());
                let endDay = DateHelper.strftime("%a %d.%m.", event.getEndTime());

                if (yearSuffixEnd !== yearSuffixStart) {
                    dayName += " " + yearSuffixStart + " - " + endDay + " " + yearSuffixEnd;
                } else if (dayName !== endDay) {
                    dayName += " - " + endDay;
                    if (currentYear !== yearSuffixStart) {
                        dayName += " " + yearSuffixStart;
                    }
                }

                let sortingStartDay = DateHelper.strftime("%Y.%m.%d", event.getStartTime()) + "," + dayName + "," + DateHelper.strftime("%Y.%m.%d", event.getEndTime());
                if (Helper.isNull(unsortedFavorites[sortingStartDay])) {
                    unsortedFavorites[sortingStartDay] = {};
                }

                let startTime = DateHelper.strftime("%H:%M", event.getStartTime());
                if (Helper.isNull(unsortedFavorites[sortingStartDay][startTime])) {
                    unsortedFavorites[sortingStartDay][startTime] = [];
                }
                unsortedFavorites[sortingStartDay][startTime].push(event);
            }
        });

        let sortedFavorites: { [key: string]: { [key: string]: Event[] } } = {};
        Object.keys(unsortedFavorites).sort().forEach(day => {
            sortedFavorites[day] = {};
            Object.keys(unsortedFavorites[day]).sort().forEach(time => {
                sortedFavorites[day][time] = unsortedFavorites[day][time].sort((a, b) => {
                    let aUpper = Translator.translate(a.getNameTranslation()).toUpperCase();
                    let bUpper = Translator.translate(b.getNameTranslation()).toUpperCase();

                    return (aUpper < bUpper) ? -1 : ((aUpper > bUpper) ? 1 : 0);
                });
            });
        });

        let today = DateHelper.strftime("%Y.%m.%d");

        ViewHelper.removeAllChildren(this._eventContainer);
        ViewHelper.removeAllChildren(this._eventContainerPast);

        let hasEventsInPast = false;
        let translator = Translator.getInstance();
        Object.keys(sortedFavorites).forEach(day => {
            let dayParts = day.split(",");

            let dayContainer = <HTMLElement>this._eventTemplate.cloneNode(true);
            dayContainer.querySelector(".day").innerHTML = dayParts[1];

            Object.keys(sortedFavorites[day]).forEach(time => {
                sortedFavorites[day][time].forEach(event => {
                    let eventElement = <HTMLElement>this._eventOverviewTemplate.cloneNode(true);
                    eventElement.querySelector(".name").appendChild(translator.makePersistentTranslation(event.getNameTranslation()));
                    (eventElement.querySelector(".time") as HTMLElement).innerText = time;

                    let places = event.getPlaces();
                    const placesIsArray = Array.isArray(places);
                    let placesIndexes = places;
                    if (!placesIsArray) {
                        placesIndexes = Object.keys(places);
                    }

                    if (placesIndexes.length > 0) {
                        ((placesIndexes.length === 1) ?
                            PlaceHelper.createPlace(placesIndexes[0], placesIsArray?places[0]:places[placesIndexes[0]], true)
                            : PlaceHelper.createMultipleLocationsView()).then(view => eventElement.querySelector(".place-container").appendChild(view));
                    }

                    eventElement.addEventListener("click", () => {
                        this.startSite(EventSite, {"id": event.getId()});
                    });

                    let favElem = eventElement.querySelector(".favorite");
                    Favorite.eventIsFavorite(event.getId()).then(isFavorite => {
                        if (isFavorite) {
                            favElem.classList.add("is-favorite");
                        }
                    });

                    favElem.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        //TODO changing
                        let isFavourite = await EventHelper.toggleFavorite(event);
                        if (isFavourite) {
                            favElem.classList.add("is-favorite");
                        } else {
                            favElem.classList.remove("is-favorite");
                        }
                    });

                    const organisers: Church[] = event.getOrganisers();
                    if (Array.isArray(organisers)) {
                        const tagPanel = eventElement.querySelector(".tag-panel");
                        organisers.forEach(organiser => {
                            Translator.addDynamicTranslations(organiser.getDynamicTranslations());

                            let organiserTagElement = document.createElement("span");
                            organiserTagElement.classList.add("tag");
                            organiserTagElement.appendChild(Translator.makePersistentTranslation(organiser.getNameTranslation()));
                            tagPanel.appendChild(organiserTagElement);
                        })
                    }

                    dayContainer.appendChild(eventElement);
                });
            });

            if (this._showInPast && dayParts[2] < today) {
                this._eventContainerPast.appendChild(dayContainer);
                hasEventsInPast = true;
            } else {
                this._eventContainer.appendChild(dayContainer);
            }
        });
        if (Object.keys(sortedFavorites).length === 0) {
            let elem = document.createElement("div");
            elem.classList.add("no-events");
            elem.appendChild(Translator.makePersistentTranslation("no events"));
            this._eventContainer.appendChild(elem);
        }
        if (hasEventsInPast) {
            this._pastSection.classList.remove("hidden");
        } else {
            this._pastSection.classList.add("hidden");
        }
        Translator.getInstance().updateTranslations(this._eventContainer);
        Translator.getInstance().updateTranslations(this._eventContainerPast);
    }
}
