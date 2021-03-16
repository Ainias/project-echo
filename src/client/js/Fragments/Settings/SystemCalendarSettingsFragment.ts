import {AbstractFragment} from "cordova-sites/dist/client/js/Context/AbstractFragment";
import {SystemCalendar} from "../../SystemCalendar";
import {ChooseDialog} from "cordova-sites/dist/client/js/Dialog/ChooseDialog";

const view = require("../../../html/Fragments/Settings/systemCalendarSettingsFragment.html");

import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";
import {Helper} from "js-helper/dist/shared";

export class SystemCalendarSettingsFragment extends AbstractFragment {
    private insertFavoritesCheckbox: HTMLInputElement;

    constructor(site) {
        super(site, view);
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let currentName = (await SystemCalendar.getSelectedCalendar())?.name
        if (Helper.isNull(currentName)) {
            currentName = "";
        }
        this.findBy("#system-calendar").innerText = currentName;

        const systemCalendarLine = this.findBy("#system-calendar-line");
        systemCalendarLine.addEventListener("click", async () => {
            currentName = await this.selectNewCalendar();
        });

        let insertFavorites = await NativeStoragePromise.getItem("insert-favorites", "1");

        this.insertFavoritesCheckbox = this.findBy("#insert-favorites");
        this.insertFavoritesCheckbox.addEventListener("change", async () => {
            if (this.insertFavoritesCheckbox.checked) {
                systemCalendarLine.classList.remove("hidden");
                await NativeStoragePromise.setItem("insert-favorites", "1");

                if (currentName === "") {
                    currentName = await this.selectNewCalendar();
                    if (!await SystemCalendar.hasCalendarPermission()) {
                        await NativeStoragePromise.setItem("insert-favorites", "0");
                        systemCalendarLine.classList.add("hidden");
                        this.insertFavoritesCheckbox.checked = false;
                    }
                }
                // await EventHelper.updateNotificationsForFavorites();
            } else {
                systemCalendarLine.classList.add("hidden");
                await NativeStoragePromise.setItem("insert-favorites", "0");
                // await NotificationScheduler.getInstance().cancelAllNotifications();
            }
        });
        if (insertFavorites === "0" || !await SystemCalendar.hasCalendarPermission()) {
            this.insertFavoritesCheckbox.checked = false;
            systemCalendarLine.classList.add("hidden");
        }

        return res;
    }

    async selectNewCalendar() {
        this.getSite().showLoadingSymbol();

        let calendarOptions = await this.getCalendarOptions();
        if (!await SystemCalendar.hasCalendarPermission()){
            this.getSite().removeLoadingSymbol();
            return "";
        }

        let selectedCalendar: number = await (new ChooseDialog(calendarOptions, "select-calendar", false).show()) as number;

        this.getSite().removeLoadingSymbol();
        if (selectedCalendar) {
            this.findBy("#system-calendar").innerText = calendarOptions[selectedCalendar];
            await NativeStoragePromise.setItem(SystemCalendar.SYSTEM_CALENDAR_ID_KEY, selectedCalendar);
            return calendarOptions[selectedCalendar];
        }
        return "";
    }

    async getCalendarOptions() {
        let calendars = await SystemCalendar.listCalendars();
        let calendarOptions = {};

        let addOwnCalendar = true;
        calendars.forEach(cal => {
            calendarOptions[cal.id] = cal.name;
            if (cal.name === SystemCalendar.NAME) {
                addOwnCalendar = false;
            }
        });

        if (addOwnCalendar) {
            calendarOptions[-1] = SystemCalendar.NAME;
        }
        return calendarOptions;
    }
}
