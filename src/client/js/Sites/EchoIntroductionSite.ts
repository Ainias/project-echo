import { MyMenuSite } from './MyMenuSite';
import { App } from 'cordova-sites/dist/client/js/App';
import { MenuAction, NavbarFragment } from 'cordova-sites';

const view = require('../../html/Sites/echoIntroductionSite.html');
const componentImg = require('../../img/component.jpg');

export class EchoIntroductionSite extends MyMenuSite {
    constructor(siteManager: any) {
        super(siteManager, view);
        this.getNavbarFragment().setCanGoBack(false);
        this.getNavbarFragment().setBackgroundImage(componentImg);
    }

    onCreateMenu(navbar: NavbarFragment) {
        navbar.removeAllActions(false);

        const menuItems = {
            '.background-img': 'home',
            '#ueberall-erhaeltlich': 'stores',
            '#trailer': 'trailer',
            '#vision': 'vision',
        };

        Object.keys(menuItems).forEach((selector) => {
            const menuAction = new MenuAction(
                menuItems[selector],
                () => {
                    this.find(selector).scrollIntoView({ behavior: 'smooth' });
                },
                MenuAction.SHOW_FOR_MEDIUM
            );
            navbar.addAction(menuAction);
        });

        super.onCreateMenu(navbar);
    }
}

App.addInitialization((app) => {
    app.addDeepLink('echo', EchoIntroductionSite);
});
