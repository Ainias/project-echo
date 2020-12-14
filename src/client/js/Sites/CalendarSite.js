import {App, Translator} from "cordova-sites"
import view from "../../html/Sites/calendarSite.html";
import {FooterSite} from "./FooterSite";
import {Scaler} from "../Scaler";
import {Favorite} from "../Model/Favorite";
import {DragHelper} from "../Helper/DragHelper";
import {DateHelper} from "../Helper/DateHelper";
import {ViewHelper} from "js-helper/dist/client";
import {EventOverviewFragment} from "../Fragments/EventOverviewFragment";
import {Helper} from "js-helper"
import {EventHelper} from "../Helper/EventHelper";
import {FilterDialog} from "../Dialoges/FilterDialog.ts";
import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";

export class CalendarSite extends FooterSite {

    constructor(siteManager) {
        super(siteManager, view);
        this._date = new Date();
        this._footerFragment.setSelected(".icon.calendar");
        this._favourites = {};

        this._filter = {};

        this._eventListFragment = new EventOverviewFragment(this);
        this._eventListFragment.setShowInPast(false);
        this.addFragment("#event-overview", this._eventListFragment);
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        if (Helper.isSet(constructParameters, "date")) {
            this._date = new Date(constructParameters["date"]);
        }

        let favorites = await Favorite.find();
        favorites.forEach(fav => {
            this._favourites[fav.eventId] = true;
        });

        if (Helper.isSet(constructParameters, "filter")) {
            if (typeof constructParameters["filter"] === "string") {
                this._filter = JSON.parse(constructParameters["filter"]);
            }
            else {
                this._filter = constructParameters["filter"];
            }
        } else {
            this._filter = await NativeStoragePromise.getItem("calendar-filter", {});
        }

        return res;
    }

    async onViewLoaded() {
        this._dayTemplate = this.findBy("#day-template");
        this._dayContainer = this.findBy("#day-container");
        this._dayTemplate.removeAttribute("id");
        this._dayTemplate.remove();

        this._eventOverviewContainer = this.findBy("#event-overview-container");
        this._eventOverview = this.findBy("#event-overview");

        this._monthName = this.findBy("#month-name");
        this.findBy("#button-left").addEventListener("click", () => {
            DateHelper.setMonth(this._date.getMonth() - 1, this._date);
            this.drawMonth(this._date);
        });
        this.findBy("#button-right").addEventListener("click", () => {
            DateHelper.setMonth(this._date.getMonth() + 1, this._date);
            this.drawMonth(this._date);
        });

        let filterButton = this.findBy("#button-filter");
        filterButton.addEventListener("click", async () => {
            let res = await new FilterDialog(this._filter.types, this._filter.churches).show();
            if (Helper.isNotNull(res)) {
                this._filter = res;
            } else {
                this._filter = {};
            }

            if (this._filter.types && this._filter.types.length > 0 || this._filter.churches && this._filter.churches.length > 0) {
                filterButton.classList.add("active");
            } else {
                filterButton.classList.remove("active");
            }

            this.setParameter("filter", JSON.stringify(this._filter));

            await this.drawMonth(this._date);
            await NativeStoragePromise.setItem("calendar-filter", this._filter);
        });

        if (this._filter.types && this._filter.types.length > 0 || this._filter.churches && this._filter.churches.length > 0) {
            filterButton.classList.add("active");
        }

        await DragHelper.makeDragToShow(this._eventOverviewContainer, (from) => {
            let maxTop = parseFloat(this._eventOverviewContainer.dataset["originalTop"]);
            if (from === maxTop) {
                if (window.getComputedStyle(this._eventOverviewContainer).getPropertyValue("top").replace("px", "") < maxTop * 0.75) {
                    this._eventOverviewContainer.style.top = "0";
                    this._eventOverviewContainer.classList.add("is-open");
                } else {
                    this._eventOverviewContainer.style.top = maxTop + "px";
                }
            } else {
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

        let lastDay = new Date(firstDay);
        lastDay.setMonth(lastDay.getMonth() + 1);
        // lastDay.setSeconds(-1);

        return await EventHelper.search("", DateHelper.strftime("%Y-%m-%d", firstDay), DateHelper.strftime("%Y-%m-%d %H:%M:%S", lastDay), this._filter.types, this._filter.churches);
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

        console.log("events", events);

        date = new Date(Helper.nonNull(date, new Date()));
        date.setDate(1);

        let month = date.getMonth();
        let now = new Date();
        let isCurrentMonth = (now.getFullYear() === date.getFullYear() && now.getMonth() === month);

        let offset = (date.getDay() + 6) % 7;
        let numberDays = DateHelper.getNumberDaysOfMonth(date);

        let eventDays = {};
        events.forEach(event => {
            let firstDayOfEvent = event.getStartTime().getDate();
            let lastDayOfEvent = event.getEndTime().getDate();

            if (month > event.getStartTime().getMonth()) {
                firstDayOfEvent = 1;
            } else if (month < event.getEndTime().getMonth()) {
                lastDayOfEvent = numberDays;
            }

            for (let i = firstDayOfEvent - 1; i < lastDayOfEvent; i++) {
                if (!eventDays[i]) {
                    eventDays[i] = [];
                }
                eventDays[i].push(event);
            }
        });

        ViewHelper.removeAllChildren(this._monthName);
        this._monthName.appendChild(Translator.makePersistentTranslation(MONTH_NAMES[date.getMonth()]));
        this._monthName.appendChild(document.createTextNode(" " + date.getFullYear()));

        ViewHelper.removeAllChildren(this._dayContainer);
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

            day.addEventListener("click", () => {
                let oldActiveDay = this.findBy(".day.active");
                if (oldActiveDay) {
                    oldActiveDay.classList.remove("active");
                }
                day.classList.add("active");
                this.showEventOverviews((eventDays[i]) ? eventDays[i] : []);

                let newDate = new Date(date);
                newDate.setDate(i + 1);
                this._date = newDate;
                this.setParameter("date", DateHelper.strftime("%Y-%m-%d", newDate));
            });

            if (eventDays[i]) {
                day.classList.add("has-event");
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

        this.setParameter("date", DateHelper.strftime("%Y-%m-%d", date))
    }

    async showEventOverviews(events) {
        await this._eventListFragment.setEvents(events);
    }
}

App.addInitialization((app) => {
    app.addDeepLink("calendar", CalendarSite);
});