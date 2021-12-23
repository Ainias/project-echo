/* eslint-disable class-methods-use-this */
import { Singleton } from 'cordova-sites/dist/client/js/Singleton';
import { App } from 'cordova-sites/dist/client/js/App';
import { EventSite } from './Sites/EventSite';

declare let cordova;
declare let device;

export class NotificationScheduler extends Singleton {
    private static canNotify() {
        return typeof device === 'undefined' || device.platform !== 'browser';
    }

    async hasPermission() {
        if (!NotificationScheduler.canNotify()) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            cordova.plugins.notification.local.hasPermission((granted) => resolve(granted));
        });
    }

    async requestPermission() {
        if (!NotificationScheduler.canNotify()) {
            return Promise.resolve();
        }

        if (!(await this.hasPermission())) {
            return new Promise((resolve) => {
                cordova.plugins.notification.local.requestPermission((granted) => resolve(granted));
            });
        }
        return true;
    }

    async schedule(id, eventId, title, text, at) {
        if (!NotificationScheduler.canNotify()) {
            return Promise.resolve();
        }

        if (!(await this.hasPermission()) && !(await this.requestPermission())) {
            return Promise.resolve();
        }

        const now = new Date();
        if (at.getTime() <= now.getTime()) {
            at.setTime(now.getTime() + 1000 * 60);
        }

        return new Promise((resolve) => {
            cordova.plugins.notification.local.schedule(
                {
                    id,
                    title,
                    text,
                    trigger: { at },
                    data: eventId,
                },
                resolve
            );
        });
    }

    async cancelAllNotifications() {
        if (!NotificationScheduler.canNotify()) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            cordova.plugins.notification.local.cancelAll(resolve);
        });
    }

    async cancelNotification(id) {
        if (!NotificationScheduler.canNotify()) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            cordova.plugins.notification.local.cancel(id, resolve);
        });
    }

    private async handleClick(app) {
        if (!NotificationScheduler.canNotify()) {
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
    return NotificationScheduler.getInstance().handleClick(app);
});
