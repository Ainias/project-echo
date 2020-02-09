import {Singleton} from "cordova-sites/dist/client/js/Singleton";
import {App} from "cordova-sites/dist/client/js/App";
import {EventSite} from "./Sites/EventSite";

export class NotificationScheduler extends Singleton {

    _canNotify() {
        return (typeof device === "undefined" || device.platform !== "browser");
    }

    async hasPermission() {
        if (!this._canNotify()) {
            return;
        }

        return new Promise((resolve) => {
            cordova.plugins.notification.local.hasPermission(granted => resolve(granted));
        });
    }

    async requestPermission() {
        if (!this._canNotify()) {
            return;
        }

        if (!await this.hasPermission()) {
            return new Promise((resolve) => {
                cordova.plugins.notification.local.requestPermission(granted => resolve(granted));
            });
        }
        return true;
    }

    async schedule(id, title, text, at) {
        if (!this._canNotify()) {
            return;
        }

        if (!await this.hasPermission() && !await this.requestPermission()) {
            return;
        }

        return new Promise(resolve => {
            cordova.plugins.notification.local.schedule({
                id: id,
                title: title,
                text: text,
                trigger: {at: at}
            }, resolve);
        });
    }

    async cancelNotification(id) {
        if (!this._canNotify()){
            return;
        }
        return new Promise(resolve => {
            cordova.plugins.notification.local.cancel(id, resolve);
        });
    };

    async _handleClick(app) {
        if (!this._canNotify()) {
            return;
        }
        cordova.plugins.notification.local.on("click", e => {
            app.startSite(EventSite, {"id": e.id});
            App.setStartParam("s", "event");
            App.setStartParam("id", e.id);
        });
    }
}

App.addInitialization((app) => {
    return NotificationScheduler.getInstance()._handleClick(app);
});
