import {MenuSite} from "cordova-sites/dist/client/js/Context/MenuSite";

import view from "../../html/Sites/settingsSite.html"
import {SystemCalendarSettingsFragment} from "../Fragments/Settings/SystemCalendarSettingsFragment";
import {NotificationsSettingsFragment} from "../Fragments/Settings/NotificationsSettingsFragment";

export class SettingsSite extends MenuSite {

    constructor(siteManager) {
        super(siteManager, view);
        this.addFragment("#systemCalendarSettings", new SystemCalendarSettingsFragment(this));
        this.addFragment("#notificationsSettings", new NotificationsSettingsFragment(this));
    }
}