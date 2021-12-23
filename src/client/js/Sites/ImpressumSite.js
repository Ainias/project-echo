import { MenuFooterSite } from './MenuFooterSite';

import view from '../../html/Sites/impressumSite.html';
import { CookieConsentHelper } from '../CookieConsent/CookieConsentHelper';
import { App } from 'cordova-sites/dist/client/js/App';

export class ImpressumSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
    }

    onViewLoaded() {
        const res = super.onViewLoaded();
        this.findBy('#open-cookie-settings').addEventListener('click', () => {
            CookieConsentHelper.showCookieDialog();
        });
        return res;
    }
}

App.addInitialization((app) => {
    app.addDeepLink('impressum', ImpressumSite);
});
