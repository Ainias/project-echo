import { Dialog } from 'cordova-sites/dist/client/js/Dialog/Dialog';

import view from '../../html/Dialoges/settingsDialog.html';
import { ViewInflater } from 'cordova-sites/dist/client/js/ViewInflater';
import { NativeStoragePromise } from 'cordova-sites/dist/client/js/NativeStoragePromise';
import { EventHelper } from '../Helper/EventHelper';

export class SettingsDialog extends Dialog {
    constructor() {
        super(
            Promise.all([
                ViewInflater.getInstance().load(view),
                NativeStoragePromise.getItem('send-notifications'),
                NativeStoragePromise.getItem('time-to-notify-base'),
                NativeStoragePromise.getItem('time-to-notify-multiplier'),
            ]).then((res) => {
                let content = res[0];
                this._timeBeforeNotificationRow = content.querySelector('#time-before-setting-row');

                this._sendNotificationCheckbox = content.querySelector('#send-notifications');
                this._sendNotificationCheckbox.addEventListener('change', () => {
                    if (this._sendNotificationCheckbox.checked) {
                        this._timeBeforeNotificationRow.classList.remove('hidden');
                    } else {
                        this._timeBeforeNotificationRow.classList.add('hidden');
                    }
                });

                if (res[1] === '0') {
                    this._sendNotificationCheckbox.checked = false;
                    this._timeBeforeNotificationRow.classList.add('hidden');
                }
                if (res[2]) {
                    content.querySelector('#after').value = res[2];
                }
                if (res[3]) {
                    content.querySelector('#multiplier').value = res[3];
                }

                return content;
            }),
            'settings-dialog-heading'
        );
    }

    close() {
        let p = Promise.resolve();
        if (this._content) {
            let timeToNotifyBase = parseInt(this._content.querySelector('#after').value);
            let timeToNotifyMultiplier = parseInt(this._content.querySelector('#multiplier').value);

            p = Promise.all([
                NativeStoragePromise.setItem('send-notifications', this._sendNotificationCheckbox.checked ? '1' : '0'),
                NativeStoragePromise.setItem('time-to-notify-base', timeToNotifyBase),
                NativeStoragePromise.setItem('time-to-notify-multiplier', timeToNotifyMultiplier),
            ]).then(() => {
                return EventHelper.updateNotificationsForFavorites();
            });
        }
        this._result = p;

        super.close();
    }
}
