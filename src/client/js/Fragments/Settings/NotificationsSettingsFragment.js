import {AbstractFragment} from "cordova-sites/dist/client/js/Context/AbstractFragment";
import {NativeStoragePromise} from "cordova-sites/dist/client/js/NativeStoragePromise";

import view from "../../../html/Fragments/Settings/notificationsSettingsFragment.html";
import {NotificationScheduler} from "../../NotificationScheduler";
import {EventHelper} from "../../Helper/EventHelper";

export class NotificationsSettingsFragment extends AbstractFragment{

    constructor(site) {
        super(site, view);
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let notificationSettings = await Promise.all([NativeStoragePromise.getItem("send-notifications", "1"),
            NativeStoragePromise.getItem("time-to-notify-base"),
            NativeStoragePromise.getItem("time-to-notify-multiplier")]);

        this._timeBeforeNotificationRow = this.findBy("#time-before-setting-row");

        this._sendNotificationCheckbox = this.findBy("#send-notifications");
        this._sendNotificationCheckbox.addEventListener("change", async () => {
            if (this._sendNotificationCheckbox.checked) {
                debugger;
                this._timeBeforeNotificationRow.classList.remove("hidden");
                await NativeStoragePromise.setItem("send-notifications", "1");
                await EventHelper.updateNotificationsForFavorites();
            } else {
                this._timeBeforeNotificationRow.classList.add("hidden");
                await NativeStoragePromise.setItem("send-notifications", "0");
                await NotificationScheduler.getInstance().cancelAllNotifications();
            }
        });

        if (notificationSettings[0] === "0") {
            this._sendNotificationCheckbox.checked = false;
            this._timeBeforeNotificationRow.classList.add("hidden");
        }
        if (notificationSettings[1]) {
            this.findBy("#after").value = res[2];
        }
        if (notificationSettings[2]) {
            this.findBy("#multiplier").value = res[3];
        }
        return res;
    }
}