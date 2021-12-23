import { MatomoDelegateSite, MenuSite } from 'cordova-sites';
import { FooterFragment } from '../Fragments/FooterFragment';

const menuTemplate = require('../../html/Sites/menuFooterSiteTemplate.html');

export class MenuFooterSite extends MenuSite {
    private footerFragment: FooterFragment;

    constructor(siteManager, view) {
        super(siteManager, view, menuTemplate);
        this.footerFragment = new FooterFragment(this);
        this.addFragment('#footer-fragment', this.footerFragment);
        this.addDelegate(new MatomoDelegateSite(this));
    }

    async onStart(pauseArguments) {
        await super.onStart(pauseArguments);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.StatusBar) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            StatusBar.overlaysWebView(true);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            StatusBar.backgroundColorByHexString('#33000000');
        }
    }

    getFooterFragment() {
        return this.footerFragment;
    }
}
