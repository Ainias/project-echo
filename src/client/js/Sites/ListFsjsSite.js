import view from '../../html/Sites/listFsjsSite.html';
import { App, Helper, Translator } from 'cordova-sites';
import { MenuFooterSite } from './MenuFooterSite';
import { WelcomeSite } from './WelcomeSite';
import { Fsj } from '../../../shared/model/Fsj';
import { FsjListFragment } from '../Fragments/FsjListFragment';

export class ListFsjsSite extends MenuFooterSite {
    constructor(siteManager) {
        super(siteManager, view);
        this._alphabeticListFragment = new FsjListFragment(this);
        this.addFragment('#fsj-list', this._alphabeticListFragment);
        this._footerFragment.setSelected('.icon.home');
    }

    async onConstruct(constructParameters) {
        let res = super.onConstruct(constructParameters);

        let fsjArray = await Fsj.find();
        let fsjs = Helper.arrayToObject(fsjArray, (fsj) => fsj.id);

        let currentLang = Translator.getInstance().getCurrentLanguage();
        let fallbackLanguage = Translator.getInstance().getFallbackLanguage();

        let namedFsjs = {};
        Object.values(fsjs).forEach((fsjs) => {
            let name = Helper.nonNull(
                fsjs.names[currentLang],
                fsjs.names[fallbackLanguage],
                fsjs.names[Object.keys(fsjs.names)[0]],
                ''
            );
            namedFsjs[name + '-' + fsjs.id] = fsjs;
        });

        this._alphabeticListFragment.setElements(namedFsjs);

        return res;
    }

    goBack() {
        this.finishAndStartSite(WelcomeSite);
    }
}

App.addInitialization((app) => {
    app.addDeepLink('fsjs', ListFsjsSite);
});
