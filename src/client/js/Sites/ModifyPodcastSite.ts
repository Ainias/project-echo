import {ModifyEntitySite} from "cordova-sites-easy-sync";
import {Podcast} from "../../../shared/model/Podcast";
import {UserSite} from "cordova-sites-user-management/dist/client/js/Context/UserSite";
import {App} from "cordova-sites";

const view = require("../../html/Sites/modifyPodcastSite.html");

export class ModifyPodcastSite extends ModifyEntitySite {

    constructor(siteManager: any) {
        super(siteManager, view, Podcast);
        this.addDelegate(new UserSite(this, "podcasts", false));
    }

    async dehydrate(entity: Podcast): Promise<{}> {
        const titles = entity.getTitles();
        const descriptions = entity.getDescriptions();
        const releaseCircles = entity.getReleaseCircles();

        return {
            "title-de": titles.de,
            "title-en": titles.en,
            "description-de": descriptions.de,
            "description-en": descriptions.en,
            "releaseCircles-de": releaseCircles.de,
            "releaseCircles-en": releaseCircles.en,
            "spotifyLink": entity.getSpotifyLink(),
            "youtubeLink": entity.getYoutubeLink(),
            "duration": entity.getDuration()
        };
    }

    async hydrate(values: { [key: string]: string }, entity: Podcast): Promise<any> {
        entity.setTitles({"de": values["title-de"], "en": values["title-en"]});
        entity.setDescriptions({"de": values["description-de"], "en": values["description-en"]});
        entity.setReleaseCircles({"de": values["releaseCircles-de"], "en": values["releaseCircles-en"]});
        entity.setSpotifyLink(values["spotifyLink"]);
        entity.setYoutubeLink(values["youtubeLink"]);
        entity.setDuration(parseInt(values["duration"]));

        return entity;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("modifyPodcast", ModifyPodcastSite);
});
