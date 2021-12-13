import { AbstractFragment } from 'cordova-sites/dist/client/js/Context/AbstractFragment';
import { NativeStoragePromise } from 'cordova-sites/dist/client/js/NativeStoragePromise';

import view from '../../../html/Fragments/Settings/notificationsSettingsFragment.html';
import { NotificationScheduler } from '../../NotificationScheduler';
import { EventHelper } from '../../Helper/EventHelper';

export class NotificationsSettingsFragment extends AbstractFragment {
    constructor(site) {
        super(site, view);
    }

    async onViewLoaded() {
        let res = super.onViewLoaded();

        let notificationSettings = await Promise.all([
            NativeStoragePromise.getItem('send-notifications', '1'),
            NativeStoragePromise.getItem('time-to-notify-base', '1'),
            NativeStoragePromise.getItem('time-to-notify-multiplier', '86400'),
        ]);

        this._timeBeforeNotificationRow = this.findBy('#time-before-setting-row');

        this._sendNotificationCheckbox = this.findBy('#send-notifications');
        this._sendNotificationCheckbox.addEventListener('change', async () => {
            if (this._sendNotificationCheckbox.checked) {
                this._timeBeforeNotificationRow.classList.remove('hidden');
                await NativeStoragePromise.setItem('send-notifications', '1');
                await EventHelper.updateNotificationsForFavorites();
            } else {
                this._timeBeforeNotificationRow.classList.add('hidden');
                await NativeStoragePromise.setItem('send-notifications', '0');
                await NotificationScheduler.getInstance().cancelAllNotifications();
            }
        });

        if (notificationSettings[0] === '0') {
            this._sendNotificationCheckbox.checked = false;
            this._timeBeforeNotificationRow.classList.add('hidden');
        }

        let afterElement = this.findBy('#after');
        let multiplierElement = this.findBy('#multiplier');
        if (notificationSettings[1]) {
            afterElement.value = notificationSettings[1];
        }
        if (notificationSettings[2]) {
            multiplierElement.value = notificationSettings[2];
        }

        afterElement.addEventListener('change', () => {
            NativeStoragePromise.setItem('time-to-notify-base', parseInt(afterElement.value));
        });
        multiplierElement.addEventListener('change', () => {
            NativeStoragePromise.setItem('time-to-notify-multiplier', parseInt(multiplierElement.value));
        });

        return res;
    }
}
