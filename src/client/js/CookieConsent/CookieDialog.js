import { Dialog } from 'cordova-sites/dist/client/js/Dialog/Dialog';

import view from '../../html/Dialoges/cookieDialog.html';
import { ViewInflater } from 'cordova-sites/dist/client/js/ViewInflater';
import { Form } from 'cordova-sites/dist/client/';

export class CookieDialog extends Dialog {
    constructor(currentConsent) {
        super(
            ViewInflater.getInstance()
                .load(view)
                .then((view) => {
                    view.querySelector('#accept-all').addEventListener('click', () => {
                        this._result = ['functional', 'statistic', 'thirdParty'];
                        this.close();
                    });

                    view.querySelector('#open-settings').addEventListener('click', () => {
                        view.querySelector('#cookie-settings').classList.remove('hidden');
                    });

                    const form = new Form(view.querySelector('#cookie-settings-form'), (values) => {
                        this._result = Object.keys(values);
                        this.close();
                    });

                    const values = {};
                    currentConsent.forEach((cookie) => {
                        values[cookie] = 1;
                    });

                    form.setValues(values);

                    return view;
                }),
            'Cookie-Einstellungen'
        );
        this.setCancelable(false);
    }
}
