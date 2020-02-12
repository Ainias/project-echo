import {AbstractFragment} from "cordova-sites/dist/client/js/Context/AbstractFragment";
import {SystemCalendar} from "../../SystemCalendar";
import {ChooseDialog} from "cordova-sites/dist/client/js/Dialog/ChooseDialog";

import view from "../../../html/Fragments/Settings/systemCalendarSettingsFragment.html";
import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";

export class SystemCalendarSettingsFragment extends AbstractFragment {

    constructor(site) {
        super(site, view);
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();
        let calendarOptions = await this.getCalendarOptions();

        this.findBy("#system-calendar").innerText = (await SystemCalendar.getSelectedCalendar()).name;

        this.findBy("#system-calendar-line").addEventListener("click", async () => {
            this.getSite().showLoadingSymbol();

            let selectedCalendar = await (new ChooseDialog(calendarOptions, "select-calendar", false).show());

            if (selectedCalendar) {
                await NativeStoragePromise.setItem(SystemCalendar.SYSTEM_CALENDAR_ID_KEY, selectedCalendar);
                this.findBy("#system-calendar").innerText = calendarOptions[selectedCalendar];
            }

            this.getSite().removeLoadingSymbol();
        });

        return res;
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