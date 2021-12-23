import { MatomoDelegateSite, TemplateSite } from 'cordova-sites';
import { FooterFragment } from '../Fragments/FooterFragment';

const footerTemplate = require('../../html/Sites/footerSite.html');

export class FooterSite extends TemplateSite {
    private footerFragment: FooterFragment;

    constructor(siteManager, view) {
        super(siteManager, view, footerTemplate, '#site-content');
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
