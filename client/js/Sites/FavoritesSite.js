import view from "../../html/Sites/favoritesSite.html";
import {FooterSite} from "./FooterSite";
import {App, Helper, Translator} from "cordova-sites";
import {Favorite} from "../Model/Favorite";
import {EventSite} from "./EventSite";
import {PlaceHelper} from "../Helper/PlaceHelper";

export class FavoritesSite extends FooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._footerFragment.setSelected(".icon.favorites");
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);
        this._favorites = await Favorite.find(undefined, undefined, undefined, undefined, Favorite.getRelations());
        console.log(this._favorites);
        return res;
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        this._favoriteContainer = this.findBy("#favorite-container-future");
        this._favoriteContainerPast = this.findBy("#favorite-container-past");
        this._favoriteTemplate = this.findBy("#favorite-template");
        this._eventOverviewTemplate = this.findBy("#event-overview-template");
        this._pastSection = this.findBy("#past-section");

        this._favoriteTemplate.removeAttribute("id");
        this._eventOverviewTemplate.removeAttribute("id");

        this._favoriteTemplate.remove();
        this._eventOverviewTemplate.remove();

        await this._renderList();

        return res;
    }

    async _renderList() {
        let currentYear = Helper.strftime("%y");
        let unsortedFavorites = {};
        this._favorites.forEach(fav => {
            //adding translations
            Translator.addDynamicTranslations(fav.event.getDynamicTranslations());

            let yearSuffixStart = (Helper.strftime("%y", fav.event.startTime));
            let yearSuffixEnd = (Helper.strftime("%y", fav.event.endTime));
            let dayName = Helper.strftime("%a %d.%m.", fav.event.startTime);
            let endDay = Helper.strftime("%a %d.%m.", fav.event.endTime);

            if (yearSuffixEnd !== yearSuffixStart) {
                dayName += " " + yearSuffixStart + " - " + endDay + " " + yearSuffixEnd;
            } else if (dayName !== endDay) {
                dayName += " - " + endDay;
                if (currentYear !== yearSuffixStart) {
                    dayName += " " + yearSuffixStart;
                }
            }

            let sortingStartDay = Helper.strftime("%Y.%m.%d", fav.event.startTime) + "," + dayName + ","+Helper.strftime("%Y.%m.%d", fav.event.endTime);
            if (Helper.isNull(unsortedFavorites[sortingStartDay])) {
                unsortedFavorites[sortingStartDay] = {};
            }

            let startTime = Helper.strftime("%H:%M", fav.event.startTime);
            if (Helper.isNull(unsortedFavorites[sortingStartDay][startTime])) {
                unsortedFavorites[sortingStartDay][startTime] = [];
            }
            unsortedFavorites[sortingStartDay][startTime].push(fav);
        });

        let sortedFavorites = {};
        Object.keys(unsortedFavorites).sort().forEach(day => {
            sortedFavorites[day] = {};
            Object.keys(unsortedFavorites[day]).sort().forEach(time => {
                sortedFavorites[day][time] = unsortedFavorites[day][time].sort((a, b) => {
                    let aUpper = Translator.translate(a.event.getNameTranslation()).toUpperCase();
                    let bUpper = Translator.translate(b.event.getNameTranslation()).toUpperCase();

                    return (aUpper < bUpper) ? -1 : ((aUpper > bUpper) ? 1 : 0);
                });
            });
        });

        let today = Helper.strftime("%Y.%m.%d");

        Helper.removeAllChildren(this._favoriteContainer);
        Helper.removeAllChildren(this._favoriteContainerPast);

        let translator = Translator.getInstance();
        Object.keys(sortedFavorites).forEach(day => {
            let dayParts = day.split(",");

            let dayContainer = this._favoriteTemplate.cloneNode(true);
            dayContainer.querySelector(".day").innerHTML = dayParts[1];

            Object.keys(sortedFavorites[day]).forEach(time => {
                sortedFavorites[day][time].forEach(fav => {
                    let eventElement = this._eventOverviewTemplate.cloneNode(true);
                    eventElement.querySelector(".name").appendChild(translator.makePersistentTranslation(fav.event.getNameTranslation()));
                    eventElement.querySelector(".time").innerText = time;

                    let places = fav.event.places;
                    if (!Array.isArray(places)) {
                        places = Object.keys(places);
                    }

                    if (places.length > 0) {
                        ((places.length === 1) ?
                            PlaceHelper.createPlace(places[0]) : PlaceHelper.createMultipleLocationsView()).then(view => eventElement.querySelector(".place-container").appendChild(view));
                    }

                    eventElement.addEventListener("click", () => {
                        this.startSite(EventSite, {"id": fav.event.id});
                    });

                    let favElem = eventElement.querySelector(".favorite");
                    favElem.classList.add("is-favorite");

                    favElem.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        let isFavourite = await Favorite.toggle(fav.event.id);
                        if (isFavourite) {
                            favElem.classList.add("is-favorite");
                            this._favorites.push(fav);
                        } else {
                            favElem.classList.remove("is-favorite");
                            delete this._favorites.indexOf(fav);
                        }
                    });

                    dayContainer.appendChild(eventElement);
                });
            });

            if (dayParts[2] < today) {
                this._favoriteContainerPast.appendChild(dayContainer);
                this._pastSection.classList.remove("hidden");
            } else {
                this._favoriteContainer.appendChild(dayContainer);
            }
        });
        if (Object.keys(sortedFavorites).length === 0){
            let elem = document.createElement("div");
            elem.classList.add("no-events");
            elem.appendChild(Translator.makePersistentTranslation("no events"));
            this._favoriteContainer.appendChild(elem);
        }
    }
}

App.addInitialization((app) => {
    app.addDeepLink("favorites", FavoritesSite);
});