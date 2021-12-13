import { AccessEasySyncModel } from 'cordova-sites-user-management/dist/shared/v1/model/AccessEasySyncModel';
import { BaseDatabase } from 'cordova-sites-database';
import { EasySyncBaseModel } from 'cordova-sites-easy-sync/dist/shared/EasySyncBaseModel';
import { FileMedium } from 'cordova-sites-easy-sync/dist/shared';

export class Podcast extends AccessEasySyncModel {
    private titles: { de: string; en: string };
    private descriptions: { de: string; en: string };
    private spotifyLink: string;
    private youtubeLink: string;
    private duration: string;
    private releaseCircle: string;

    constructor() {
        super();
    }

    getTitleTranslation() {
        return 'podcasts-title-' + this.id;
    }
    getDescriptionTranslation() {
        return 'podcasts-description-' + this.id;
    }

    getDynamicTranslations() {
        let translations = {};
        Object.keys(this.titles).forEach((language) => {
            translations[language] = translations[language] || {};
            translations[language][this.getTitleTranslation()] = this.titles[language];
        });
        Object.keys(this.descriptions).forEach((language) => {
            translations[language] = translations[language] || {};
            translations[language][this.getDescriptionTranslation()] = this.descriptions[language];
        });

        return translations;
    }

    static getColumnDefinitions() {
        let columns = super.getColumnDefinitions();
        return {
            ...columns,
            titles: BaseDatabase.TYPES.MY_JSON,
            descriptions: BaseDatabase.TYPES.MY_JSON,
            spotifyLink: {
                type: BaseDatabase.TYPES.TEXT,
                nullable: true,
            },
            youtubeLink: {
                type: BaseDatabase.TYPES.TEXT,
                nullable: true,
            },
            duration: {
                type: BaseDatabase.TYPES.INTEGER,
                nullable: true,
            },
            releaseCircles: {
                type: BaseDatabase.TYPES.MY_JSON,
                nullable: true,
            },
        };
    }

    static getRelationDefinitions() {
        let relations = EasySyncBaseModel.getRelationDefinitions();
        return {
            ...relations,
            images: {
                target: FileMedium.getSchemaName(),
                type: 'many-to-many',
                joinTable: {
                    name: 'podcastImages',
                },
                sync: true,
            },
        };
    }

    setTitles(titles: { de: string; en: string }) {
        this.titles = titles;
    }

    getTitles() {
        return this.titles;
    }

    setDescriptions(descriptions: { de: string; en: string }) {
        this.descriptions = descriptions;
    }

    getDescriptions() {
        return this.descriptions;
    }

    setSpotifyLink(link: string) {
        this.spotifyLink = link;
    }

    getSpotifyLink() {
        return this.spotifyLink;
    }

    setYoutubeLink(link: string) {
        this.youtubeLink = link;
    }

    getYoutubeLink() {
        return this.youtubeLink;
    }

    setDuration(duration: string) {
        this.duration = duration;
    }

    getDuration() {
        return this.duration;
    }

    setReleaseCircle(releaseCircle: string) {
        this.releaseCircle = releaseCircle;
    }

    getReleaseCircle() {
        return this.releaseCircle;
    }

    // static getRelationDefinitions() {
    //     let relations = EasySyncBaseModel.getRelationDefinitions();
    //     relations["regions"] = {
    //         target: Region.getSchemaName(),
    //         type: "many-to-many",
    //         joinTable: {
    //             name: "postRegion"
    //         },
    //         sync: true
    //     };
    //     return relations;
    // }
}

Podcast.ACCESS_MODIFY = 'podcasts';
Podcast.SCHEMA_NAME = 'Podcast';
