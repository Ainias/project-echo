import view from '../../html/Sites/listFsjsSite.html';
import { App, Helper, Translator } from 'cordova-sites';
import { MenuFooterSite } from './MenuFooterSite';
import { WelcomeSite } from './WelcomeSite';
import { Fsj } from '../../../shared/model/Fsj';
import { FsjListFragment } from '../Fragments/FsjListFragment';

export class ListFsjsSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this.alphabeticListFragment = new FsjListFragment(this);
        this.addFragment('#fsj-list', this.alphabeticListFragment);
        this.getFooterFragment().setSelected('.icon.home');
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);

        const fsjArray = await Fsj.find();
        const fsjs = Helper.arrayToObject(fsjArray, (fsj) => fsj.id);

        const currentLang = Translator.getInstance().getCurrentLanguage();
        const fallbackLanguage = Translator.getInstance().getFallbackLanguage();

        const namedFsjs = {};
        Object.values(fsjs).forEach((fsjs) => {
            const name = Helper.nonNull(
                fsjs.names[currentLang],
                fsjs.names[fallbackLanguage],
                fsjs.names[Object.keys(fsjs.names)[0]],
                ''
            );
            namedFsjs[`${name}-${fsjs.id}`] = fsjs;
        });

        this.alphabeticListFragment.setElements(namedFsjs);

        return res;
    }

    goBack() {
        this.finishAndStartSite(WelcomeSite);
    }
}

App.addInitialization((app) => {
    app.addDeepLink('fsjs', ListFsjsSite);
});
