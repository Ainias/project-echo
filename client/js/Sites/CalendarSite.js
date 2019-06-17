import {Helper, App, Translator} from "cordova-sites"
import {Event} from "../../../model/Event";
import view from "../../html/Sites/calendarSite.html";
import {FooterSite} from "./FooterSite";
// import * as _typeorm from "typeorm";
import {LessThan} from "typeorm";
import {MoreThanOrEqual} from "typeorm";
import {EventSite} from "./EventSite";
import {Scaler} from "../Scaler";
import {Favorite} from "../Model/Favorite";
import {DragHelper} from "../Helper/DragHelper";

// let typeorm = _typeorm;
// if (typeorm.default) {
//     typeorm = typeorm.default;
// }

export class CalendarSite extends FooterSite {

    constructor(siteManager) {
        super(siteManager, view);
        this._date = new Date();
        this._footerFragment.setSelected(".icon.calendar");
        this._favourites = {};
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        if (Helper.isSet(constructParameters, "date")) {
            this._date = new Date(constructParameters["date"]);
        }

        let favourites = await Favorite.find();
        favourites.forEach(fav => {
            this._favourites[fav.eventId] = true;
        });
        return res;
    }

    async onViewLoaded() {
        this._dayTemplate = this.findBy("#day-template");
        this._dayContainer = this.findBy("#day-container");
        this._dayTemplate.removeAttribute("id");
        this._dayTemplate.remove();

        this._eventOverviewContainer = this.findBy("#event-overview-container");
        this._eventOverviewTemplate = this.findBy("#event-overview-template");
        this._eventOverviewTemplate.removeAttribute("id");
        this._eventOverviewTemplate.remove();

        this._monthName = this.findBy("#month-name");
        this.findBy("#button-left").addEventListener("click", () => {
            this._date.setMonth(this._date.getMonth() - 1);
            this.drawMonth(this._date);
        });
        this.findBy("#button-right").addEventListener("click", () => {
            this._date.setMonth(this._date.getMonth() + 1);
            this.drawMonth(this._date);
        });

        await DragHelper.makeDragToShow(this._eventOverviewContainer, (from) => {
            let maxTop = parseFloat(this._eventOverviewContainer.dataset["originalTop"]);
            if (from === maxTop) {
                if (window.getComputedStyle(this._eventOverviewContainer).getPropertyValue("top").replace("px", "") < maxTop * 0.75) {
                    this._eventOverviewContainer.style.top = "0";
                    this._eventOverviewContainer.classList.add("is-open");
                } else {
                    this._eventOverviewContainer.style.top = maxTop + "px";
                }
            }
            else {
                if (window.getComputedStyle(this._eventOverviewContainer).getPropertyValue("top").replace("px", "") < maxTop * 0.25) {
                    this._eventOverviewContainer.style.top = "0";
                } else {
                    this._eventOverviewContainer.classList.remove("is-open");
                    this._eventOverviewContainer.style.top = maxTop + "px";
                }
            }
        });

        return super.onViewLoaded();
    }

    async loadEventsForMonth(date) {
        let firstDay = new Date(date);
        firstDay.setDate(1);
        firstDay.setHours(0);
        firstDay.setMinutes(0);
        firstDay.setSeconds(0);
        firstDay.setMilliseconds(0);

        let firstDayOfNextMonth = new Date(firstDay);
        firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1);

        //TODO filter nach region
        return Event.find({
            startTime: LessThan(Helper.strftime("%Y-%m-%d %H:%M:%S", firstDayOfNextMonth)),
            endTime: MoreThanOrEqual(Helper.strftime("%Y-%m-%d %H:%M:%S", firstDay))
        });
    }


    async onStart(pauseArguments) {
        await this.drawMonth(this._date);
        await super.onStart(pauseArguments);
    }

    /**
     *
     * @param {Date} date
     */
    async drawMonth(date) {
        const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let actualDayOfMonth = date.getDate();

        let events = await this.loadEventsForMonth(date);

        date = new Date(Helper.nonNull(date, new Date()));
        date.setDate(1);

        let month = date.getMonth();
        let now = new Date();
        let isCurrentMonth = (now.getFullYear() === date.getFullYear() && now.getMonth() === month);

        let offset = (date.getDay() + 6) % 7;
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        let numberDays = date.getDate();

        let eventDays = {};
        events.forEach(event => {
            let firstDayOfEvent = event.startTime.getDate();
            let lastDayOfEvent = event.endTime.getDate();

            if (month > event.startTime.getMonth()) {
                firstDayOfEvent = 1;
            } else if (month < event.endTime.getMonth()) {
                lastDayOfEvent = numberDays;
            }

            for (let i = firstDayOfEvent - 1; i < lastDayOfEvent; i++) {
                if (!eventDays[i]) {
                    eventDays[i] = [];
                }
                eventDays[i].push(event);
            }
        });

        Helper.removeAllChildren(this._monthName);
        this._monthName.appendChild(Translator.makePersistentTranslation(MONTH_NAMES[date.getMonth()]));
        this._monthName.appendChild(document.createTextNode(" " + date.getFullYear()));

        Helper.removeAllChildren(this._dayContainer);
        for (let i = 0; i < offset; i++) {
            let day = this._dayTemplate.cloneNode(true);
            day.classList.add("oldMonth");
            this._dayContainer.appendChild(day);
        }
        for (let i = 0; i < numberDays; i++) {
            let day = this._dayTemplate.cloneNode(true);
            day.querySelector(".day-number").innerText = i + 1;

            if (isCurrentMonth && now.getDate() === i + 1) {
                day.classList.add("today");
            }

            if (eventDays[i]) {
                day.classList.add("has-event");
                day.addEventListener("click", () => {
                    let oldActiceDay = this.findBy(".day.active");
                    if (oldActiceDay) {
                        oldActiceDay.classList.remove("active");
                    }
                    day.classList.add("active");
                    this.showEventOverviews(eventDays[i]);

                    let newDate = new Date(date);
                    newDate.setDate(i + 1);
                    this.setParameter("date", Helper.strftime("%Y-%m-%d", newDate));
                });
            } else {
                day.addEventListener("click", () => {
                    let oldActiceDay = this.findBy(".day.active");
                    if (oldActiceDay) {
                        oldActiceDay.classList.remove("active");
                    }
                    day.classList.add("active");
                    this.showEventOverviews([]);

                    let newDate = new Date(date);
                    newDate.setDate(i + 1);
                    this.setParameter("date", Helper.strftime("%Y-%m-%d", newDate));
                });
            }

            if (i + 1 === actualDayOfMonth) {
                day.classList.add("active");
                if (eventDays[i]) {
                    this.showEventOverviews(eventDays[i]);
                } else {
                    this.showEventOverviews([]);
                }
            }

            this._dayContainer.appendChild(day);
        }

        for (let i = offset + numberDays; i < 37; i++) {
            let day = this._dayTemplate.cloneNode(true);
            day.classList.add("nextMonth");
            this._dayContainer.appendChild(day);
        }

        date.setDate(actualDayOfMonth);

        let scaler = new Scaler();
        let maxHeight = window.getComputedStyle(this.findBy("#calendar")).getPropertyValue("height").replace("px", "");
        this._eventOverviewContainer.style.top = (maxHeight * 0.85) + "px";

        await scaler.scaleHeightThroughWidth(this.findBy("#scale-container"), maxHeight * 0.70);


        this.setParameter("date", Helper.strftime("%Y-%m-%d", date))
    }

    showEventOverviews(events) {
        Helper.removeAllChildren(this._eventOverviewContainer);
        events.forEach(event => {
            let translator =
                Translator.getInstance();
            translator.addDynamicTranslations(event.getDynamicTranslations());

            let eventElement = this._eventOverviewTemplate.cloneNode(true);
            eventElement.querySelector(".name").appendChild(translator.makePersistentTranslation(event.getNameTranslation()));
            eventElement.querySelector(".time").innerText = Helper.strftime("%H:%M", event.startTime);
            if (event.places.length > 0) {
                eventElement.querySelector(".place .place-name").appendChild((event.places.length === 1) ?
                    document.createTextNode(event.places[0]) : Translator.makePersistentTranslation("Multiple locations"));
            }

            eventElement.addEventListener("click", () => {
                if (!this._eventOverviewContainer.classList.contains("is-dragging")) {
                    this.startSite(EventSite, {"id": event.id});
                }
            });

            let favElem = eventElement.querySelector(".favorite");

            if (this._favourites[event.id]) {
                favElem.classList.add("is-favorite");
            }

            favElem.addEventListener("click", async (e) => {
                if (!this._eventOverviewContainer.classList.contains("is-dragging")) {
                    e.stopPropagation();

                    let isFavourite = await Favorite.toggle(event.id);
                    console.log("is Favorite", isFavourite);
                    if (isFavourite) {
                        favElem.classList.add("is-favorite");
                        this._favourites[event.id] = true;
                    } else {
                        favElem.classList.remove("is-favorite");
                        this._favourites[event.id] = false;
                    }
                }
            });

            this._eventOverviewContainer.appendChild(eventElement);
        });

        if (events.length === 0) {
            let elem = document.createElement("div");
            elem.classList.add("no-events");
            elem.appendChild(Translator.makePersistentTranslation("no events"));
            this._eventOverviewContainer.appendChild(elem);
        }
    }
}

App.addInitialization((app) => {
    app.addDeepLink("calendar", CalendarSite);
});