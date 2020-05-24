import view from "../../html/Sites/settingsSite.html"
import {SystemCalendarSettingsFragment} from "../Fragments/Settings/SystemCalendarSettingsFragment";
import {NotificationsSettingsFragment} from "../Fragments/Settings/NotificationsSettingsFragment";
import {MenuFooterSite} from "./MenuFooterSite";
import {App} from "cordova-sites/dist/client/js/App";

export class SettingsSite extends MenuFooterSite {

    constructor(siteManager) {
        super(siteManager, view);
        this.addFragment("#systemCalendarSettings", new SystemCalendarSettingsFragment(this));
        this.addFragment("#notificationsSettings", new NotificationsSettingsFragment(this));
    }
}

App.addInitialization((app) => {
    app.addDeepLink("settings", SettingsSite);
});