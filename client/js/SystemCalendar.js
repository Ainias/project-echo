import {Favorite} from "./Model/Favorite";
import {Translator} from "cordova-sites/src/client/js/Translator";
import {DataManager} from "cordova-sites/src/client/js/DataManager";
import {Helper} from "js-helper/src/shared/Helper";

export class SystemCalendar {
    static async createCalendar() {
        return new Promise(async (resolve, reject) => {
            if (device.platform === "browser") {
                resolve();
            } else {
                await this.deleteCalendar();
                let options = window.plugins.calendar.getCreateCalendarOptions();
                options.calendarName = SystemCalendar.NAME;
                options.accountName = "silas@silas.link";
                window.plugins.calendar.createCalendar(options, resolve, reject);
            }
        });
    }

    static async deleteCalendar() {
        return new Promise((resolve, reject) => {
            if (device.platform === "browser") {
                return resolve();
            }
            window.plugins.calendar.deleteCalendar(SystemCalendar.NAME, resolve, reject);
        });
    }

    static async createEvent(title, location, description, start, end, url) {
        return new Promise(async (resolve, reject) => {
            if (device.platform === "browser") {
                resolve();
            } else {

                let calendar = await this.getMyCalendar();
                let options = window.plugins.calendar.getCalendarOptions();
                options.calendarName = calendar.name;
                options.calendarId = calendar.id;
                options.url = url;
                window.plugins.calendar.createEventWithOptions(title, location, description, start, end, options, resolve, reject);
            }
        });
    }

    static async findEvent(title, location, description, start, end) {
        return new Promise(async (resolve, reject) => {
            if (device.platform === "browser") {
                resolve();
            } else {

                let calendar = await this.getMyCalendar();
                let options = window.plugins.calendar.getCalendarOptions();
                options.calendarName = calendar.name;
                options.calendarId = calendar.id;
                options.url = "https://echo.silas.link?s=event&id=1";
                window.plugins.calendar.findEventWithOptions(title, location, description, start, end, options, resolve, reject);
            }
        });
    }

    static async listCalendars() {
        return new Promise((resolve, reject) => {
            if (device.platform === "browser"){
                return resolve([]);
            }
            window.plugins.calendar.listCalendars(resolve, reject)
        });
    }

    static async addEventToSystemCalendar(event) {
        let fav = await Favorite.findOne({event: {id: event.id}});
        if (!fav) {
            fav = new Favorite();
        }

        let translator = Translator.getInstance();
        translator.addDynamicTranslations(event.getDynamicTranslations());
        fav.systemCalendaId = await this.createEvent(translator.translate(event.getNameTranslation()),
            ((Helper.isNotNull(event.places) && Object.keys(event.places).length >= 1) ? Object.keys(event.places)[0] : ""),
            translator.translate(event.getDescriptionTranslation()) + "\n\n",
            event.startTime,
            event.endTime,
            SystemCalendar.WEBSITE + DataManager.buildQuery({s: "event", "id": event.id})
        );
    }

    static async deleteEventFromSystemCalendar(event) {
        let fav = await Favorite.findOne({event: {id: event.id}});
        if (!fav) {
            return;
        }
        return this.deleteEvenById(fav.systemCalendaId);
    }

    static async deleteEvenById(id) {
        return new Promise((resolve, reject) => {
            if (device.platform === "browser" || Helper.isNull(id)) {
                return resolve();
            }
            window.plugins.calendar.deleteEventById(id, undefined, resolve, reject)
        });
    }

    static async getMyCalendar() {
        let calendars = await this.listCalendars();
        let calendar = null;

        console.log("calendars", calendars);
        calendars.some(sysCalendar => {
            if (sysCalendar.name === SystemCalendar.NAME) {
                calendar = sysCalendar;
                return true;
            }
            return false;
        });

        if (calendar === null) {
            console.log("c", await this.createCalendar());
            return this.getMyCalendar();
        }

        return calendar;
    }
}

SystemCalendar.NAME = "echo";
SystemCalendar.WEBSITE = "echo.silas.link";