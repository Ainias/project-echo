import {AbstractFragment, Helper, Translator} from "cordova-sites";
import view from "../../html/Fragments/eventOverviewFragment.html"
import {PlaceHelper} from "../Helper/PlaceHelper";
import {EventSite} from "../Sites/EventSite";
import {Favorite} from "../Model/Favorite";

export class EventOverviewFragment extends AbstractFragment {

    constructor(site) {
        super(site, view);
        this._events = [];
    }

    async setEvents(events){
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

        // await this._renderList();

        return res;
    }

    async _renderList() {

        let currentYear = Helper.strftime("%y");
        let unsortedFavorites = {};
        this._events.forEach(event => {
            //adding translations
            Translator.addDynamicTranslations(event.getDynamicTranslations());

            let yearSuffixStart = (Helper.strftime("%y", event.startTime));
            let yearSuffixEnd = (Helper.strftime("%y", event.endTime));
            let dayName = Helper.strftime("%a %d.%m.", event.startTime);
            let endDay = Helper.strftime("%a %d.%m.", event.endTime);

            if (yearSuffixEnd !== yearSuffixStart) {
                dayName += " " + yearSuffixStart + " - " + endDay + " " + yearSuffixEnd;
            } else if (dayName !== endDay) {
                dayName += " - " + endDay;
                if (currentYear !== yearSuffixStart) {
                    dayName += " " + yearSuffixStart;
                }
            }

            let sortingStartDay = Helper.strftime("%Y.%m.%d", event.startTime) + "," + dayName + "," + Helper.strftime("%Y.%m.%d", event.endTime);
            if (Helper.isNull(unsortedFavorites[sortingStartDay])) {
                unsortedFavorites[sortingStartDay] = {};
            }

            let startTime = Helper.strftime("%H:%M", event.startTime);
            if (Helper.isNull(unsortedFavorites[sortingStartDay][startTime])) {
                unsortedFavorites[sortingStartDay][startTime] = [];
            }
            unsortedFavorites[sortingStartDay][startTime].push(event);
        });

        let sortedFavorites = {};
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

        let today = Helper.strftime("%Y.%m.%d");

        Helper.removeAllChildren(this._eventContainer);
        Helper.removeAllChildren(this._eventContainerPast);

        let translator = Translator.getInstance();
        Object.keys(sortedFavorites).forEach(day => {
            let dayParts = day.split(",");

            let dayContainer = this._eventTemplate.cloneNode(true);
            dayContainer.querySelector(".day").innerHTML = dayParts[1];

            Object.keys(sortedFavorites[day]).forEach(time => {
                sortedFavorites[day][time].forEach(event => {
                    let eventElement = this._eventOverviewTemplate.cloneNode(true);
                    eventElement.querySelector(".name").appendChild(translator.makePersistentTranslation(event.getNameTranslation()));
                    eventElement.querySelector(".time").innerText = time;

                    let places = event.places;
                    if (!Array.isArray(places)) {
                        places = Object.keys(places);
                    }

                    if (places.length > 0) {
                        ((places.length === 1) ?
                            PlaceHelper.createPlace(places[0]) : PlaceHelper.createMultipleLocationsView()).then(view => eventElement.querySelector(".place-container").appendChild(view));
                    }

                    eventElement.addEventListener("click", () => {
                        this.startSite(EventSite, {"id": event.id});
                    });

                    let favElem = eventElement.querySelector(".favorite");
                    favElem.classList.add("is-favorite");

                    favElem.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        //TODO changing
                        let isFavourite = await Favorite.toggle(event.id);
                        if (isFavourite) {
                            favElem.classList.add("is-favorite");
                        } else {
                            favElem.classList.remove("is-favorite");
                        }
                    });

                    dayContainer.appendChild(eventElement);
                });
            });

            if (dayParts[2] < today) {
                this._eventContainerPast.appendChild(dayContainer);
                this._pastSection.classList.remove("hidden");
            } else {
                this._eventContainer.appendChild(dayContainer);
            }
        });
        if (Object.keys(sortedFavorites).length === 0) {
            let elem = document.createElement("div");
            elem.classList.add("no-events");
            elem.appendChild(Translator.makePersistentTranslation("no events"));
            debugger;
            this._eventContainer.appendChild(elem);
        }
    }
}