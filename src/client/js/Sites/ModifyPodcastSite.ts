import {ModifyEntitySite} from "cordova-sites-easy-sync";
import {Podcast} from "../../../shared/model/Podcast";
import {UserSite} from "cordova-sites-user-management/dist/client/js/Context/UserSite";
import {App, Helper} from "cordova-sites";
import {FileMedium} from "cordova-sites-easy-sync/dist/shared";

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
            "releaseCircle-de": releaseCircles.de?releaseCircles.de: "",
            "releaseCircle-en": releaseCircles.en?releaseCircles.en: "",
            "spotifyLink": entity.getSpotifyLink(),
            "youtubeLink": entity.getYoutubeLink(),
            "duration": entity.getDuration(),
            "image": entity.getImages() && entity.getImages().length > 0 ? entity.getImages()[0].getUrl(): null,
            "image-before": entity.getImages() && entity.getImages().length > 0 ? entity.getImages()[0].getUrl(): null,
        };
    }

    async hydrate(values: { [key: string]: string }, entity: Podcast): Promise<any> {
        entity.setTitles({"de": values["title-de"], "en": values["title-en"]});
        entity.setDescriptions({"de": values["description-de"], "en": values["description-en"]});
        entity.setReleaseCircles({"de": values["releaseCircle-de"], "en": values["releaseCircle-en"]});
        entity.setSpotifyLink(values["spotifyLink"]);
        entity.setYoutubeLink(values["youtubeLink"]);
        entity.setDuration(parseInt(values["duration"]));


        console.log("values", values);
        let imageSrc = values["image"];
        if (Helper.imageUrlIsEmpty(imageSrc)) {
            imageSrc = values["image-before"];
        }
        const image: FileMedium = entity.getImages() && entity.getImages().length > 0? entity.getImages()[0]: new FileMedium();
        image.setSrc(imageSrc);
        await image.save();

        entity.setImages([image]);

        return entity;
    }
}

App.addInitialization((app) => {
    app.addDeepLink("modifyPodcast", ModifyPodcastSite);
});
