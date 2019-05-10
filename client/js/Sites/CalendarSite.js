import {Helper, App, Translator} from "cordova-sites"
import {Event} from "../../../model/Event";
import view from "../../html/Sites/calendarSite.html";
import {FooterSite} from "./FooterSite";
// import * as _typeorm from "typeorm";
import {LessThan} from "typeorm";
import {MoreThanOrEqual} from "typeorm";
import {EventSite} from "./EventSite";

// let typeorm = _typeorm;
// if (typeorm.default) {
//     typeorm = typeorm.default;
// }

export class CalendarSite extends FooterSite {

    constructor(siteManager) {
        super(siteManager, view);
        this._date = new Date();
        this._footerFragment.setSelected(".icon.calendar");
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

        this.drawMonth(this._date);

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

    /**
     *
     * @param {Date} date
     */
    async drawMonth(date) {
        const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
                    this.showEventOverviews(eventDays[i]);
                });
            }

            this._dayContainer.appendChild(day);
        }
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
                this.startSite(EventSite, {"id": event.id});
            });

            this._eventOverviewContainer.appendChild(eventElement);
        });
    }
}

App.addInitialization((app) => {
    app.addDeepLink("calendar", CalendarSite);
});