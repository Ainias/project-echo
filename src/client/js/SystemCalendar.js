import {Favorite} from "./Model/Favorite";
import {Translator} from "cordova-sites/dist/client/js/Translator";
import {DataManager} from "cordova-sites/dist/client/js/DataManager";
import {Helper} from "js-helper";
import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";

export class SystemCalendar {
    static async createCalendar() {
        return new Promise(async (resolve, reject) => {
            if (device.platform === "browser") {
                resolve();
            } else {
                // await this.deleteCalendar();
                let options = window.plugins.calendar.getCreateCalendarOptions();
                options.calendarName = SystemCalendar.NAME;
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
                let calendar = await this.getSelectedCalendar().catch(e => console.error(e));
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
            if (device.platform === "browser") {
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

        let places = await event.getPlaces();

        fav.systemCalendarId = await this.createEvent(translator.translate(event.getNameTranslation()),
            ((Helper.isNotNull(places) && Object.keys(places).length >= 1) ? Object.keys(places)[0] : ""),
            translator.translate(event.getDescriptionTranslation()) + "\n\n",
            await event.getStartTime(),
            await event.getEndTime(),
            SystemCalendar.WEBSITE + DataManager.buildQuery({s: "event", "id": event.id})
        );
        await fav.save();
    }

    static async deleteEventFromSystemCalendar(event) {
        let fav = await Favorite.findOne({eventId: event.id});
        if (!fav) {
            return;
        }
        let res = this.deleteEvenById(fav.systemCalendarId);
        fav.systemCalendarId = null;
        await fav.save();
        return res;
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

        calendars.some(sysCalendar => {
            if (sysCalendar.name === SystemCalendar.NAME) {
                calendar = sysCalendar;
                return true;
            }
            return false;
        });

        if (calendar === null) {
            return this.getMyCalendar();
        }

        return calendar;
    }

    static async getSelectedCalendar() {
        let calendars = await this.listCalendars();
        let calendar = null;

        let calendarId = await NativeStoragePromise.getItem(SystemCalendar.SYSTEM_CALENDAR_ID_KEY);

        calendars.some(sysCalendar => {
            if ((Helper.isNotNull(calendarId) && sysCalendar.id === calendarId) ||
                (Helper.isNull(calendarId) && (sysCalendar.isPrimary) && sysCalendar.name.indexOf("@") !== -1) ||
                (calendarId === "OK, Calendar already exists" && sysCalendar.name === SystemCalendar.NAME)
            ){
                calendar = sysCalendar;
                return true;
            }
            return false;
        });

        if (calendar === null) {
            let id = await this.createCalendar();
            await NativeStoragePromise.setItem(SystemCalendar.SYSTEM_CALENDAR_ID_KEY, id);
            return this.getSelectedCalendar();
        }

        return calendar;
    }
}

SystemCalendar.NAME = "echo";
SystemCalendar.SYSTEM_CALENDAR_ID_KEY = "system-calendar-id";
SystemCalendar.WEBSITE = "echo.silas.link";