import { App, Helper, Translator } from 'cordova-sites';
import { Region } from '../../../shared/model/Region';
import { MenuFooterSite } from './MenuFooterSite';
import { ChurchListFragment } from '../Fragments/ChurchListFragment';
import { WelcomeSite } from './WelcomeSite';
import { Church } from '../../../shared/model/Church';

const view = require('../../html/Sites/listChurchesSite.html');

export class ListChurchesSite extends MenuFooterSite {
    private alphabeticListFragment: ChurchListFragment;

    constructor(siteManager) {
        super(siteManager, view);
        this.alphabeticListFragment = new ChurchListFragment(this);
        this.addFragment('#church-list', this.alphabeticListFragment);
        this.getFooterFragment().setSelected('.icon.home');
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);

        const regionIds = [];
        if (constructParameters) {
            Helper.nonNull(constructParameters.regionIds, []);
        }
        let regions: Region[];
        if (regionIds.length >= 1) {
            regions = await Region.findByIds(regionIds, Region.getRelations());
        } else {
            regions = (await Region.find(
                undefined,
                undefined,
                undefined,
                undefined,
                Region.getRelations()
            )) as Region[];
        }

        const churches: { [id: number]: Church } = {};
        regions.forEach((region) => {
            if (region.getChurches()) {
                region.getChurches().forEach((church) => {
                    churches[church.id] = church;
                });
            }
        });

        const currentLang = Translator.getInstance().getCurrentLanguage();
        const fallbackLanguage = Translator.getInstance().getFallbackLanguage();

        const namedChurches = {};
        Object.values(churches).forEach((church) => {
            const names = church.getNames();
            const name = Helper.nonNull(names[currentLang], names[fallbackLanguage], names[Object.keys(names)[0]], '');
            namedChurches[`${name}-${church.id}`] = church;
        });

        this.alphabeticListFragment.setElements(namedChurches);

        return res;
    }

    onViewLoaded(): Promise<any[]> {
        const res = super.onViewLoaded();

        const headingElem = this.findBy('#church-list-heading');
        headingElem.remove();
        this.alphabeticListFragment.setHeading(headingElem);

        return res;
    }

    goBack() {
        this.finishAndStartSite(WelcomeSite);
    }
}

App.addInitialization((app) => {
    app.addDeepLink('churches', ListChurchesSite);
});
