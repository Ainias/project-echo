import { Singleton } from 'cordova-sites/dist/client/js/Singleton';
import { App } from 'cordova-sites/dist/client/js/App';
import { EventSite } from './Sites/EventSite';

declare var cordova;
declare var device;

export class NotificationScheduler extends Singleton {
    _canNotify() {
        return typeof device === 'undefined' || device.platform !== 'browser';
    }

    async hasPermission() {
        if (!this._canNotify()) {
            return;
        }

        return new Promise((resolve) => {
            cordova.plugins.notification.local.hasPermission((granted) => resolve(granted));
        });
    }

    async requestPermission() {
        if (!this._canNotify()) {
            return;
        }

        if (!(await this.hasPermission())) {
            return new Promise((resolve) => {
                cordova.plugins.notification.local.requestPermission((granted) => resolve(granted));
            });
        }
        return true;
    }

    async schedule(id, eventId, title, text, at) {
        if (!this._canNotify()) {
            return;
        }

        if (!(await this.hasPermission()) && !(await this.requestPermission())) {
            return;
        }

        let now = new Date();
        if (at.getTime() <= now.getTime()) {
            at.setTime(now.getTime() + 1000 * 60);
        }

        return new Promise((resolve) => {
            cordova.plugins.notification.local.schedule(
                {
                    id: id,
                    title: title,
                    text: text,
                    trigger: { at: at },
                    data: eventId,
                },
                resolve
            );
        });
    }

    async cancelAllNotifications() {
        if (!this._canNotify()) {
            return;
        }
        return new Promise((resolve) => {
            cordova.plugins.notification.local.cancelAll(resolve);
        });
    }

    async cancelNotification(id) {
        if (!this._canNotify()) {
            return;
        }
        return new Promise((resolve) => {
            cordova.plugins.notification.local.cancel(id, resolve);
        });
    }

    async _handleClick(app) {
        if (!this._canNotify()) {
            return;
        }

        cordova.plugins.notification.local.on('click', (e) => {
            app.startSite(EventSite, { id: e.data });
            App.setStartParam('s', 'event');
            App.setStartParam('id', e.data);
        });
    }
}

App.addInitialization((app) => {
    return NotificationScheduler.getInstance()._handleClick(app);
});
