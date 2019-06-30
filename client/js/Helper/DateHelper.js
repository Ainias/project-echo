import {Helper} from "cordova-sites";

export class DateHelper {

    static setMonth(newMonth, day, date) {
        if (Helper.isNull(date) && day instanceof Date) {
            date = day;
            day = undefined;
        }
        date = Helper.nonNull(date, new Date());
        let currentDayOfMonth = date.getDate();
        date.setDate(1);
        date.setMonth(newMonth);

        let numberDaysOfMonth = DateHelper.getNumberDaysOfMonth(date);
        if (currentDayOfMonth > numberDaysOfMonth) {
            currentDayOfMonth = numberDaysOfMonth;
        }

        date.setDate(currentDayOfMonth);

        return date;
    }

    static getNumberDaysOfMonth(date) {
        if (!(date instanceof Date)) {
            if (typeof date === "number" && date <= 11) {
                date = new Date();
                date.setMonth(date, 1);
            } else {
                date = new Date(date);
            }
        }

        let workingDate = new Date(date);
        workingDate.setDate(1);
        workingDate.setMonth(date.getMonth() + 1);
        workingDate.setDate(0);
        return workingDate.getDate();
    }
}