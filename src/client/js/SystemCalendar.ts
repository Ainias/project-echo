import { Favorite } from './Model/Favorite';
import { Translator } from 'cordova-sites/dist/client/js/Translator';
import { DataManager } from 'cordova-sites/dist/client/js/DataManager';
import { Helper } from 'js-helper';
import { NativeStoragePromise } from 'cordova-sites/dist/client/js/NativeStoragePromise';
import { ConfirmDialog } from 'cordova-sites/dist/client';

declare let device;

export class SystemCalendar {
    static NAME = 'echo';
    static SYSTEM_CALENDAR_ID_KEY = 'system-calendar-id';
    static WEBSITE = 'echo.silas.link';

    static async createCalendar() {
        return new Promise((resolve, reject) => {
            (async () => {
                if (device.platform === 'browser' || (await this.askIfFavoritesShouldBeInSystemCalendar()) === false) {
                    resolve(undefined);
                } else {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const options = window.plugins.calendar.getCreateCalendarOptions();
                    options.calendarName = SystemCalendar.NAME;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    window.plugins.calendar.createCalendar(options, resolve, reject);
                }
            })();
        }).catch((e) => console.error(e));
    }

    static async deleteCalendar() {
        return new Promise((resolve, reject) => {
            (async () => {
                if (device.platform === 'browser' || (await this.askIfFavoritesShouldBeInSystemCalendar()) === false) {
                    resolve(undefined);
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                window.plugins.calendar.deleteCalendar(SystemCalendar.NAME, resolve, reject);
            })();
        }).catch((e) => console.error(e));
    }

    static async createEvent(title, location, description, start, end, url) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (device.platform === 'browser' || (await this.askIfFavoritesShouldBeInSystemCalendar()) === false) {
                    resolve(undefined);
                } else {
                    const calendar = await this.getSelectedCalendar().catch((e) => console.error(e));
                    if (Helper.isNull(calendar)) {
                        resolve(undefined);
                        return;
                    }

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const options = window.plugins.calendar.getCalendarOptions();
                    options.calendarName = calendar.name;
                    options.calendarId = calendar.id;
                    options.url = url;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    window.plugins.calendar.createEventWithOptions(
                        title,
                        location,
                        description,
                        start,
                        end,
                        options,
                        resolve,
                        reject
                    );
                }
            })();
        }).catch((e) => console.error(e));
    }

    static async findEvent(title, location, description, start, end) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (device.platform === 'browser' || (await this.askIfFavoritesShouldBeInSystemCalendar()) === false) {
                    resolve(undefined);
                } else {
                    const calendar = await this.getMyCalendar();
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const options = window.plugins.calendar.getCalendarOptions();
                    options.calendarName = calendar.name;
                    options.calendarId = calendar.id;
                    options.url = 'https://echo.silas.link?s=event&id=1'; // TODO richtige URL?
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    window.plugins.calendar.findEventWithOptions(
                        title,
                        location,
                        description,
                        start,
                        end,
                        options,
                        resolve,
                        reject
                    );
                }
            })();
        }).catch((e) => console.error(e));
    }

    static async hasCalendarPermission() {
        return new Promise((resolve) => {
            if (device.platform === 'browser') {
                resolve(true);
                return;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.plugins.calendar.hasReadPermission((result) => resolve(result));
        });
    }

    static async askIfFavoritesShouldBeInSystemCalendar() {
        const shouldInsertFavorites = await NativeStoragePromise.getItem('insert-favorites', null);
        // const hasCalendarPermission = await this.hasCalendarPermission();

        if (Helper.isNull(shouldInsertFavorites)) {
            const shouldInsert = await new ConfirmDialog(
                'should favorites inserted to system calendar',
                'insert favorites',
                'yes',
                'no'
            ).show();
            if (shouldInsert) {
                await NativeStoragePromise.setItem('insert-favorites', '1');
            } else {
                await NativeStoragePromise.setItem('insert-favorites', '0');
            }
            return shouldInsert;
        }
        return shouldInsertFavorites === '1';
    }

    static async listCalendars() {
        return new Promise<any[]>((resolve, reject) => {
            (async () => {
                if (device.platform === 'browser' || (await this.askIfFavoritesShouldBeInSystemCalendar()) === false) {
                    return resolve([]);
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                window.plugins.calendar.listCalendars(resolve, reject);
                return undefined;
            })();
        }).catch((e) => {
            console.error(e);
            return [];
        });
    }

    static async addEventToSystemCalendar(event) {
        let fav = await Favorite.findOne({ eventId: event.id });
        if (!fav) {
            fav = new Favorite();
        }

        const translator = Translator.getInstance();
        translator.addDynamicTranslations(event.getDynamicTranslations());

        const places = await event.getPlaces();

        fav.systemCalendarId = await this.createEvent(
            translator.translate(event.getNameTranslation()),
            Helper.isNotNull(places) && Object.keys(places).length >= 1 ? Object.keys(places)[0] : '',
            `${translator.translate(event.getDescriptionTranslation())}\n\n`,
            await event.getStartTime(),
            await event.getEndTime(),
            SystemCalendar.WEBSITE + DataManager.buildQuery({ s: 'event', id: event.id })
        );
        await fav.save();
    }

    static async deleteEventFromSystemCalendar(event) {
        const fav = await Favorite.findOne({ eventId: event.id });
        if (!fav) {
            return Promise.resolve();
        }
        const res = this.deleteEvenById(fav.systemCalendarId);
        fav.systemCalendarId = null;
        await fav.save();
        return res;
    }

    static async deleteEvenById(id) {
        return new Promise((resolve, reject) => {
            (async () => {
                if (
                    device.platform === 'browser' ||
                    Helper.isNull(id) ||
                    (await this.askIfFavoritesShouldBeInSystemCalendar()) === false
                ) {
                    return resolve(undefined);
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                window.plugins.calendar.deleteEventById(id, undefined, resolve, reject);
                return undefined;
            })();
        }).catch((e) => console.error(e));
    }

    static async getMyCalendar() {
        const calendars = await this.listCalendars();
        let calendar = null;

        calendars.some((sysCalendar) => {
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
        if (!(await this.askIfFavoritesShouldBeInSystemCalendar())) {
            return null;
        }

        const calendars = await this.listCalendars();
        let calendar = null;

        const calendarId = await NativeStoragePromise.getItem(SystemCalendar.SYSTEM_CALENDAR_ID_KEY);

        calendars.some((sysCalendar) => {
            if (
                (Helper.isNotNull(calendarId) && sysCalendar.id === calendarId) ||
                (Helper.isNull(calendarId) && sysCalendar.isPrimary && sysCalendar.name.indexOf('@') !== -1) ||
                (calendarId === 'OK, Calendar already exists' && sysCalendar.name === SystemCalendar.NAME)
            ) {
                calendar = sysCalendar;
                return true;
            }
            return false;
        });

        // Dauerschleife durch Permission-Abfrage verhindern
        if (calendar === null && (await this.hasCalendarPermission())) {
            const id = await this.createCalendar();
            await NativeStoragePromise.setItem(SystemCalendar.SYSTEM_CALENDAR_ID_KEY, id);
            return this.getSelectedCalendar();
        }

        return calendar;
    }
}
