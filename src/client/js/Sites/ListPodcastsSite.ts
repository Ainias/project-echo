import {MenuFooterSite} from "./MenuFooterSite";
import {Helper, Translator} from "cordova-sites";
import {WelcomeSite} from "./WelcomeSite";
import {PodcastListFragment} from "../Fragments/PodcastListFragment";
import {Podcast} from "../../../shared/model/Podcast";

const view = require("../../html/Sites/listPodcastsSite.html")

export class ListPodcastsSite extends MenuFooterSite {

    private alphabeticListFragment: PodcastListFragment;

    constructor(siteManager) {
        super(siteManager, view);
        this.alphabeticListFragment = new PodcastListFragment(this);
        this.addFragment("#podcast-list", this.alphabeticListFragment);
        this._footerFragment.setSelected(".icon.home");
    }

    async onConstruct(constructParameters) {
        const res = super.onConstruct(constructParameters);

        const podcasts = <Podcast[]>await Podcast.find();

        const currentLang = Translator.getInstance().getCurrentLanguage();
        const fallbackLanguage = Translator.getInstance().getFallbackLanguage();

        const namedPodcasts = {};
        Object.values(podcasts).forEach(podcast => {
            const names = podcast.getTitles();
            let name = Helper.nonNull(names[currentLang], names[fallbackLanguage], names[Object.keys(names)[0]], "");
            namedPodcasts[name + "-" + podcast.id] = podcast;
        });

        this.alphabeticListFragment.setElements(namedPodcasts);

        return res;
    }

    onViewLoaded(): Promise<any[]> {
        const res = super.onViewLoaded();

        const headingElem = this.findBy("#podcast-list-heading");
        headingElem.remove();
        this.alphabeticListFragment.setHeading(headingElem);

        return res;
    }

    goBack() {
        this.finishAndStartSite(WelcomeSite);
    }
}
