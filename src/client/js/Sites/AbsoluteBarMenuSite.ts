const menuTemplate = require('../../html/Sites/absoluteBarMenuSiteTemplate.html');
import { FooterFragment } from '../Fragments/FooterFragment';
import { MyMenuSite } from './MyMenuSite';

export class AbsoluteBarMenuSite extends MyMenuSite {
    public footerFragment: FooterFragment;

    constructor(siteManager, view) {
        super(siteManager, view, menuTemplate);
        this.getNavbarFragment().setBackgroundImage('');

        this.footerFragment = new FooterFragment(this);
        this.addFragment('#footer-fragment', this.footerFragment);
    }

    async onStart(pauseArguments) {
        await super.onStart(pauseArguments);
        // @ts-ignore
        if (window.StatusBar) {
            // @ts-ignore
            window.StatusBar.overlaysWebView(true);
            // @ts-ignore
            window.StatusBar.backgroundColorByHexString('#33000000');
        }
    }
}
