import {AbstractFragment} from "cordova-sites/src/client/js/Context/AbstractFragment";
import {SystemCalendar} from "../../SystemCalendar";
import {ChooseDialog} from "cordova-sites/src/client/js/Dialog/ChooseDialog";

export class SystemCalendarSettings extends AbstractFragment {
    async onViewLoaded(){
        let res = super.onViewLoaded();
        this.findBy("#system-calendar-line").addEventListener("click", async () => {
            this.getSite().showLoadingSymbol();
            let calendars = await SystemCalendar.listCalendars();
            let calendarOptions = {};

            calendars.forEach(cal => {
                calendarOptions[cal.id] = cal.name;
            });
            console.log(calendars);

            let selectedCalendar = await (new ChooseDialog(calendarOptions, "select-calendar").show());
            console.log("selected:", selectedCalendar);
            this.getSite().removeLoadingSymbol();
        });
        return res;
    }
}