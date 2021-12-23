import { App, Translator } from 'cordova-sites';
import { FooterSite } from './FooterSite';
import { Scaler } from '../Scaler';
import { Favorite } from '../Model/Favorite';
import { DateHelper } from '../../../shared/helper/DateHelper';
import { ViewHelper } from 'js-helper/dist/client';
import { EventOverviewFragment } from '../Fragments/EventOverviewFragment';
import { Helper } from 'js-helper';
import { EventHelper } from '../Helper/EventHelper';
import { FilterDialog } from '../Dialoges/FilterDialog';
import { NativeStoragePromise } from 'cordova-sites/dist/client/js/NativeStoragePromise';

const view = require('../../html/Sites/calendarSite.html');

export class CalendarSite extends FooterSite {
    private date: Date;
    private favorites: { [id: number]: boolean };
    private filter: any;
    private eventListFragment: EventOverviewFragment;
    private dayTemplate: HTMLElement;
    private dayContainer: HTMLElement;
    private eventOverviewContainer: HTMLElement;
    private eventOverview: HTMLElement;
    private monthNameElement: HTMLElement;
    private scrollContainer: HTMLElement;
    private buttonLeft: HTMLElement;

    constructor(siteManager) {
        super(siteManager, view);
        this.date = new Date();
        this.getFooterFragment().setSelected('.icon.calendar');
        this.favorites = {};

        this.filter = {};

        this.eventListFragment = new EventOverviewFragment(this);
        this.eventListFragment.setShowInPast(false);
        this.addFragment('#event-overview', this.eventListFragment);
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);

        if (Helper.isSet(constructParameters, 'date')) {
            this.date = new Date(constructParameters.date);
        }

        const favorites = <Favorite[]>await Favorite.find();
        favorites.forEach((fav) => {
            this.favorites[fav.getEventId()] = true;
        });

        if (Helper.isSet(constructParameters, 'filter')) {
            if (typeof constructParameters.filter === 'string') {
                this.filter = JSON.parse(constructParameters.filter);
            } else {
                this.filter = constructParameters.filter;
            }
        } else {
            this.filter = await NativeStoragePromise.getItem('calendar-filter', {});
        }

        return res;
    }

    async onViewLoaded() {
        const res = super.onViewLoaded();

        this._view.classList.add('calendar-site');

        this.dayTemplate = this.findBy('#day-template');
        this.dayContainer = this.findBy('#day-container');
        this.dayTemplate.removeAttribute('id');
        this.dayTemplate.remove();

        this.eventOverviewContainer = this.findBy('#event-overview-container');
        this.eventOverview = this.findBy('#event-overview');

        this.monthNameElement = this.findBy('#month-name');
        this.buttonLeft = this.findBy('#button-left');
        this.buttonLeft.addEventListener('click', () => {
            DateHelper.setMonth(this.date.getMonth() - 1, this.date);
            this.drawMonth(this.date);
        });
        this.findBy('#button-right').addEventListener('click', () => {
            DateHelper.setMonth(this.date.getMonth() + 1, this.date);
            this.drawMonth(this.date);
        });

        const filterButton = this.findBy('#button-filter');
        filterButton.addEventListener('click', async () => {
            const filterRes = await new FilterDialog(this.filter.types, this.filter.churches).show();
            if (Helper.isNotNull(filterRes)) {
                this.filter = filterRes;
            } else {
                this.filter = {};
            }

            if (
                (this.filter.types && this.filter.types.length > 0) ||
                (this.filter.churches && this.filter.churches.length > 0)
            ) {
                filterButton.classList.add('active');
            } else {
                filterButton.classList.remove('active');
            }

            this.setParameter('filter', JSON.stringify(this.filter));

            await this.drawMonth(this.date);
            await NativeStoragePromise.setItem('calendar-filter', this.filter);
        });

        if (
            (this.filter.types && this.filter.types.length > 0) ||
            (this.filter.churches && this.filter.churches.length > 0)
        ) {
            filterButton.classList.add('active');
        }

        this.findBy('#icon-big-small .makeBig').addEventListener('click', () => this.openEventList());
        this.findBy('#icon-big-small .makeSmall').addEventListener('click', () => this.closeEventList());

        this.scrollContainer = this.findBy('#calendar-scroll-container');
        this.scrollContainer.addEventListener('scroll', () => {
            if (this.scrollContainer.scrollTop > 0) {
                this.openEventList();
            } else {
                this.closeEventList();
            }
        });
        // setInterval(() => {
        //     console.log("scroll top", this.scrollContainer.scrollTop);
        // }, 2000);

        return res;
    }

    openEventList() {
        this.eventOverviewContainer.classList.add('is-open');
        this.scrollContainer.scroll(0, 1);
    }

    closeEventList() {
        this.eventOverviewContainer.classList.remove('is-open');
        this.scrollContainer.scroll(0, 0);
    }

    async loadEventsForMonth(date) {
        const firstDay = new Date(date);
        firstDay.setDate(1);
        firstDay.setHours(0);
        firstDay.setMinutes(0);
        firstDay.setSeconds(0);
        firstDay.setMilliseconds(0);

        const lastDay = new Date(firstDay);
        lastDay.setMonth(lastDay.getMonth() + 1);
        // lastDay.setSeconds(-1);

        return EventHelper.search(
            '',
            DateHelper.strftime('%Y-%m-%d', firstDay),
            DateHelper.strftime('%Y-%m-%d %H:%M:%S', lastDay),
            this.filter.types,
            this.filter.churches,
            undefined,
            true
        );
    }

    async onStart(pauseArguments) {
        await this.drawMonth(this.date);
        await super.onStart(pauseArguments);
    }

    /**
     *
     * @param {Date} date
     */
    async drawMonth(date) {
        const MONTH_NAMES = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const minDate = new Date();
        minDate.setDate(1);
        DateHelper.setMonth(minDate.getMonth() - 2, minDate);
        if (minDate.getTime() > date.getTime()) {
            date.setFullYear(minDate.getFullYear());
            DateHelper.setMonth(minDate.getMonth(), date);
        }

        if (minDate.getMonth() === date.getMonth() && minDate.getFullYear() === date.getFullYear()) {
            this.buttonLeft.classList.add('hidden');
        } else {
            this.buttonLeft.classList.remove('hidden');
        }

        const actualDayOfMonth = date.getDate();

        date = new Date(Helper.nonNull(date, new Date()));
        date.setDate(1);

        const now = new Date();
        const month = date.getMonth();
        const isCurrentMonth = now.getFullYear() === date.getFullYear() && now.getMonth() === month;

        const offset = (date.getDay() + 6) % 7;
        const numberDays = DateHelper.getNumberDaysOfMonth(date);

        const eventDays = {};
        const events = await this.loadEventsForMonth(date);
        events.forEach((event) => {
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

        ViewHelper.removeAllChildren(this.monthNameElement);
        this.monthNameElement.appendChild(Translator.makePersistentTranslation(MONTH_NAMES[date.getMonth()]));
        this.monthNameElement.appendChild(document.createTextNode(` ${date.getFullYear()}`));

        ViewHelper.removeAllChildren(this.dayContainer);
        for (let i = 0; i < offset; i++) {
            const day = <HTMLElement>this.dayTemplate.cloneNode(true);
            day.classList.add('oldMonth');
            this.dayContainer.appendChild(day);
        }
        for (let i = 0; i < numberDays; i++) {
            const day = <HTMLElement>this.dayTemplate.cloneNode(true);
            (day.querySelector('.day-number') as HTMLElement).innerText = (i + 1).toString();

            if (isCurrentMonth && now.getDate() === i + 1) {
                day.classList.add('today');
            }

            day.addEventListener('click', () => {
                const oldActiveDay = this.findBy('.day.active');
                if (oldActiveDay) {
                    oldActiveDay.classList.remove('active');
                }
                day.classList.add('active');
                this.showEventOverviews(eventDays[i] ? eventDays[i] : []);

                const newDate = new Date(date);
                newDate.setDate(i + 1);
                this.date = newDate;
                this.setParameter('date', DateHelper.strftime('%Y-%m-%d', newDate));
            });

            if (eventDays[i]) {
                day.classList.add('has-event');
            }
            if (i + 1 === actualDayOfMonth) {
                day.classList.add('active');
                if (eventDays[i]) {
                    this.showEventOverviews(eventDays[i]);
                } else {
                    this.showEventOverviews([]);
                }
            }

            this.dayContainer.appendChild(day);
        }

        for (let i = offset + numberDays; i < 37; i++) {
            const day = <HTMLElement>this.dayTemplate.cloneNode(true);
            day.classList.add('nextMonth');
            this.dayContainer.appendChild(day);
        }

        date.setDate(actualDayOfMonth);

        const scaler = new Scaler();
        const maxHeight = window
            .getComputedStyle(this.findBy('#calendar'))
            .getPropertyValue('height')
            .replace('px', '');

        await scaler.scaleHeightThroughWidth(this.findBy('#scale-container'), parseFloat(maxHeight) * 0.73);

        this.setParameter('date', DateHelper.strftime('%Y-%m-%d', date));
    }

    async showEventOverviews(events) {
        await this.eventListFragment.setEvents(events);
    }
}

App.addInitialization((app) => {
    app.addDeepLink('calendar', CalendarSite);
});
