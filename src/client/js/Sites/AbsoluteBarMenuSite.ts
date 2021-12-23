import { FooterFragment } from '../Fragments/FooterFragment';
import { MyMenuSite } from './MyMenuSite';

const menuTemplate = require('../../html/Sites/absoluteBarMenuSiteTemplate.html');

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (window.StatusBar) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.StatusBar.overlaysWebView(true);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.StatusBar.backgroundColorByHexString('#33000000');
        }
    }
}
