import { AlphabeticListFragment, Translator } from 'cordova-sites';
import { Podcast } from '../../../shared/model/Podcast';
import { PodcastDetailSite } from '../Sites/PodcastDetailSite';

const view = require('../../html/Fragments/podcastListFragment.html');

export class PodcastListFragment extends AlphabeticListFragment {
    private podcastTemplate: HTMLElement;

    constructor(site) {
        super(site, view);
    }

    async onViewLoaded() {
        this.podcastTemplate = this.find('.info-template');
        this.podcastTemplate.remove();
        this.podcastTemplate.classList.remove('info-template');

        return super.onViewLoaded();
    }

    renderElement(podcast: Podcast) {
        Translator.getInstance().addDynamicTranslations(podcast.getDynamicTranslations());
        const infoElement = <HTMLElement>this.podcastTemplate.cloneNode(true);

        const images = podcast.getImages();

        (<HTMLImageElement>infoElement.querySelector('.podcast-image')).src =
            images && images[0] ? images[0].getUrl() : '';
        infoElement
            .querySelector('.name')
            .appendChild(Translator.makePersistentTranslation(podcast.getTitleTranslation()));

        infoElement.addEventListener('click', () => {
            this.infoElemClicked(podcast.id);
        });
        return infoElement;
    }

    infoElemClicked(id) {
        // console.log("podcast clicked!", id);
        this.getSite().startSite(PodcastDetailSite, { id });
    }
}
