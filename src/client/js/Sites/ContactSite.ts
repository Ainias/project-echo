import { MenuFooterSite } from './MenuFooterSite';

import { App } from 'cordova-sites/dist/client/js/App';
import { Form } from 'cordova-sites/dist/client';
import { DataManager } from 'cordova-sites/dist/client/js/DataManager';
import { Toast } from 'cordova-sites/dist/client/js/Toast/Toast';
import { Translator } from 'cordova-sites/dist/client/js/Translator';

const view = require('../../html/Sites/contactSite.html');

export class ContactSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
    }

    onViewLoaded() {
        const res = super.onViewLoaded();

        this.findBy('#contactText').appendChild(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Translator.makePersistentTranslation('contact text', [__CONTACT_EMAIL__])
        );

        new Form(this.findBy('#contact-form'), async (values) => {
            const result = await DataManager.send('contact', values);
            if (result.success) {
                new Toast('Die Nachricht wurde gesendet!').show();
                this.finish();
            } else if (result) {
                new Toast(result.message).show();
            } else {
                new Toast('Es ist ein Fehler aufgetreten...').show();
            }
        });

        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink('contact', ContactSite);
});
