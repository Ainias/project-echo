import {AlphabeticListFragment, Translator} from "cordova-sites";
import {Podcast} from "../../../shared/model/Podcast";

const view = require("../../html/Fragments/podcastListFragment.html");

export class PodcastListFragment extends AlphabeticListFragment {
    private podcastTemplate: HTMLElement;

    constructor(site) {
        super(site, view);
    }

    async onViewLoaded() {
        this.podcastTemplate = this.find(".info-template");
        this.podcastTemplate.remove();
        this.podcastTemplate.classList.remove("info-template");

        return super.onViewLoaded();
    }

    renderElement(podcast: Podcast) {
        Translator.getInstance().addDynamicTranslations(podcast.getDynamicTranslations());
        let infoElement = <HTMLElement>this.podcastTemplate.cloneNode(true);
        infoElement.querySelector(".name").appendChild(Translator.makePersistentTranslation(podcast.getTitleTranslation()));

        infoElement.addEventListener("click", () => {
            this.infoElemClicked(podcast.id);
        });
        return infoElement;
    }

    infoElemClicked(id){
        console.log("podcast clicked!", id);
        // this.getSite().startSite()
    }
}
